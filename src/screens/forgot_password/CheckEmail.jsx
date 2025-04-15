import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux'; 
import { checkOTP_gmail } from '../../rtk/API'; 
import SuccessModal from '../../utils/animation/success/SuccessModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
const { width, height } = Dimensions.get('window');

const CheckEmail = (props) => {
    const { navigation, route } = props; // Thêm route để lấy params
    const { gmail } = route.params; // Lấy gmail từ params
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); 
    const [isSuccess, setIsSuccess] = useState(false); 
    const dispatch = useDispatch(); // Khai báo dispatch

    const handleCheckOTP = async () => {
        if (!code.trim()) {
            setError('Vui lòng nhập mã OTP.');
            return;
        }

        setError('');
        try {
            // Gọi API checkOTP_gmail với gmail và code
            setIsLoading(true); 
            const response = await dispatch(checkOTP_gmail({ gmail, otp: code })).unwrap();
            console.log("Response từ checkOTP_gmail:", response);

            if (response.status) {
                // Nếu OTP hợp lệ, chuyển sang màn hình tạo mật khẩu mới
                setIsLoading(false);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false); // Đóng modal sau 2 giây
                    navigation.navigate('CreateNewPassWord', {
                    gmail: gmail, 
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

    return (
        <View style={styles.container}>
            <LoadingModal visible={isLoading} />
            <SuccessModal visible={isSuccess} message="Xác thực OTP thành công!" />
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Kiểm tra Email</Text>
            <Text style={styles.label2}>
                Chúng tôi đã gửi 1 mã xác nhận gồm 4 số đến email <Text style={styles.emailText}>{gmail}</Text>. Mã này dùng để đặt lại mật khẩu mới cho tài khoản của bạn.
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

export default CheckEmail;