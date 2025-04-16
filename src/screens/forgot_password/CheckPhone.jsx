import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux'; 
import { checkOTP_phone, sendOTP_dangKi_phone } from '../../rtk/API'; 
import SuccessModal from '../../utils/animation/success/SuccessModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
const { width, height } = Dimensions.get('window');

const CheckPhone = (props) => {
    const { navigation, route } = props; // Thêm route để lấy params
    const { phone } = route.params; // Lấy gmail từ params
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const [resendCooldown, setResendCooldown] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [isSendSuccess, setIsSendSuccess] = useState(false);
    
    const dispatch = useDispatch(); 


      // Bộ đếm ngược cho nút "Lấy mã mới"
      useEffect(() => {
        let timer;
        if (resendCooldown > 0 && isResendDisabled) {
          timer = setInterval(() => {
            setResendCooldown((prev) => {
              if (prev <= 1) {
                clearInterval(timer);
                setIsResendDisabled(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
        return () => clearInterval(timer);
      }, [resendCooldown, isResendDisabled]);

    const handleCheckOTP = async () => {
        if (!code.trim()) {
            setError('Vui lòng nhập mã OTP.');
            return;
        }

        setError('');
        try {
            // Gọi API checkOTP_phone với phone và code
            setIsLoading(true); 
            const response = await dispatch(checkOTP_phone({ phone, otp: code })).unwrap();
            console.log("Response từ checkOTP_phone:", response);

            if (response.status) { 
                // Nếu OTP hợp lệ, chuyển sang màn hình tạo mật khẩu mới
                setIsLoading(false);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false); 
                    navigation.navigate('CreatePasswordPhone', {
                    phone: phone, 
                });
                }, 2000)
                
            } else {
                setIsLoading(false);
                setError(response.message || 'Mã OTP không đúng. Vui lòng thử lại.');
            }
        } catch (error) {
            setIsLoading(false);
            console.log("Lỗi khi kiểm tra OTP:", error);
            setError(error || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };



      // Hàm xử lý khi nhấn "Lấy mã mới"
      const handleResendOTP = () => {
        if (isResendDisabled) return;
    
        setIsLoading(true);
        setError('');
        dispatch(sendOTP_dangKi_phone({ phone }))
          .unwrap()
          .then((response) => {
            if (response.status) {
              setIsSendSuccess(true);
              setTimeout(() => {
                setIsSendSuccess(false);
                setResendCooldown(30);
                setIsResendDisabled(true);
                setCode('');
              }, 2000);
            } else {
              setError(response.message || 'Không thể gửi OTP mới');
              setIsFailed(true);
              setTimeout(() => {
                setIsFailed(false);
              }, 2000);
            }
          })
          .catch((error) => {
            console.log('Error resending OTP:', error);
            setError('Không thể gửi OTP mới. Vui lòng thử lại.');
            setIsFailed(true);
            setTimeout(() => {
              setIsFailed(false);
            }, 2000);
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

    return (
        <View style={styles.container}>
            <LoadingModal visible={isLoading} />
            <SuccessModal visible={isSuccess} message="Xác thực OTP thành công!" />
            <SuccessModal visible={isSendSuccess} message={"Mã OTP đã được gửi lại!"}/>
            <Pressable onPress={() => navigation.navigate('FindWithPhone')}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Kiểm tra số điện thoại</Text>
            <Text style={styles.label2}>
                Chúng tôi đã gửi mã đến số <Text style={styles.emailText}>{phone}</Text> Hãy nhập mã đó để xác nhận tài khoản.
            </Text>

            <TextInput
                onChangeText={(text) => {
                    setCode(text);
                    setError(''); // Xóa lỗi khi người dùng nhập
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Nhập mã"
                value={code}
                style={[styles.inputDate, error && { borderColor: 'red' }]} // Đổi màu viền nếu có lỗi
                color={'black'}
                maxLength={4} // Giới hạn độ dài tối đa của mã OTP
                keyboardType="numeric" // Chỉ cho phép nhập số
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View>
                <Text style={styles.infoText}>
                    Có thể bạn cần chờ vài phút để nhận được mã này.{' '}
                    <Text style={styles.newCode} onPress={() => navigation.navigate('FindWithEmail')}>
                        Lấy mã mới
                    </Text>
                </Text>
            </View>

            <Pressable style={styles.button} onPress={handleCheckOTP}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
        backgroundColor: '#f0f4ff',
    },
    iconBack: {
        marginVertical: height * 0.02,
    },
    label: {
        color: 'black',
        fontSize: height * 0.03,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    label2: {
        fontSize: height * 0.018,
        color: '#1C2931',
        fontWeight: '450',
        marginBottom: height * 0.02,
    },
    emailText: {
        fontWeight: 'bold',
        color: '#0064E0',
    },
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        padding: height * 0.015,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
    },
    errorText: {
        color: 'red',
        fontSize: height * 0.018,
        marginBottom: height * 0.015,
    },
    infoText: {
        fontSize: height * 0.019,
        color: 'black',
    },
    button: {
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.05,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
    newCode: {
        color: '#0064E0',
        fontWeight: '450',
    },
});

export default CheckPhone;