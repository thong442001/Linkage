import { StyleSheet, Text, View, TextInput, Pressable, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkOTP_gmail } from '../../rtk/API';
import { useDispatch } from 'react-redux';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';

const { width, height } = Dimensions.get('window');

const OTPGmailScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;
    const dispatch = useDispatch();

    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Hàm xử lý khi nhấn nút Xác nhận (giữ nguyên logic API)
    const handleSubmit = async () => {
        const otpCode = otp;
        if (otpCode.length !== 4) {
            setError('Vui lòng nhập đủ 4 số');
            return;
        }

        setError('');
        setIsLoading(true);
        try {
            const response = await dispatch(checkOTP_gmail({
                gmail: params.email,
                otp: otpCode
            })).unwrap();

            if (response.status) {
                console.log("Response từ checkOTP_gmail:", response);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    navigation.navigate('CreatePasswordScreen', {
                        first_name: params.first_name,
                        last_name: params.last_name,
                        dateOfBirth: params.dateOfBirth,
                        sex: params.sex,
                        phone: params.phone,
                        email: params.email,
                    });
                    setOtp('');
                }, 2000);
            } else {
                setError(response.message || 'Mã OTP không đúng');
                setIsLoading(false);
            }
        } catch (error) {
            console.log('Error checking OTP:', error);
            setError('Mã OTP không hợp lệ.');
            setIsLoading(false);
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
                Chúng tôi đã gửi 1 mã xác minh gồm 4 số đến email <Text style={styles.emailText}>{params.email}</Text>, Hãy nhập mã đó để xác nhận tài khoản.
            </Text>

            <TextInput
                onChangeText={(text) => {
                    setOtp(text);
                    setError('');
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Nhập mã"
                value={otp}
                style={[styles.inputDate, error && { borderColor: 'red' }]}
                color={'black'}
                maxLength={4}
                keyboardType="numeric"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View>
                <Text style={styles.infoText}>
                    Có thể bạn cần chờ vài phút để nhận được mã này.{' '}
                    <Text style={styles.newCode} onPress={() => navigation.navigate('Screen3', params)}>
                        Lấy mã mới
                    </Text>
                </Text>
            </View>

            <Pressable style={styles.button} onPress={handleSubmit}>
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

export default OTPGmailScreen;