import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    checkEmail,
    check_email,
    sendOTP_dangKi_gmail
} from '../../rtk/API';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import { set } from '@react-native-firebase/database';

const { width, height } = Dimensions.get('window');

const Screen3 = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [emailVerified, setEmailVerified] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        const checkUserEmail = async () => {
            const user = auth().currentUser;
            if (user) {
                await user.reload(); // Cập nhật trạng thái từ Firebase
                callcheck_email(user.uid);
            }
        };

        checkUserEmail();
    }, []); // Chạy một lần khi component mount

    const callcheck_email = (uid) => {
        dispatch(check_email({ uid: uid }))
            .unwrap()
            .then((response) => {
                setEmailVerified(response.emailVerified);
            })
            .catch((error) => {
                console.log('Error callcheck_email:', error);
            });
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    };

    const handleTiep = async () => {
        // Ngăn spam khi đang loading
        if (isLoading) return;

        // Kiểm tra email hợp lệ
        if (!validateEmail(email)) {
            setError('Email không hợp lệ');
            return;
        }

        setError(''); // Xóa lỗi nếu có
        setIsLoading(true); // Bật trạng thái loading

        try {
            // API checkEmail
            const checkEmailResponse = await dispatch(checkEmail({ email: email })).unwrap();
            if (!checkEmailResponse.status) {
                setError(checkEmailResponse.message || 'Email không hợp lệ hoặc đã được sử dụng');
                setIsLoading(false);
                setIsFailed(true);
                setTimeout(() => setIsFailed(false), 1500);
                return;
            }

            // API sendOTP_dangKi_gmail
            const sendOTPResponse = await dispatch(sendOTP_dangKi_gmail({ gmail: email })).unwrap();
            if (!sendOTPResponse.status) {
                setError(sendOTPResponse.message || 'Gửi OTP thất bại');
                setIsLoading(false);
                setIsFailed(true);
                setTimeout(() => setIsFailed(false), 1500);
                return;
            }

            // Nếu gửi OTP thành công
            setIsSuccess(true);
            setTimeout(() => {
                setIsLoading(false);
                setIsSuccess(false);
                navigation.navigate('OTPGmailScreen', {
                    first_name: params.first_name,
                    last_name: params.last_name,
                    dateOfBirth: params.dateOfBirth,
                    sex: params.sex,
                    phone: null,
                    email: email,
                });
            }, 2000);
            setEmail(''); // Reset email sau khi gửi thành công
        } catch (error) {
            console.log('Error:', error);
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
            setIsLoading(false);
            setIsFailed(true);
            setTimeout(() => setIsFailed(false), 1500);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => 
                navigation.navigate('Screen2', {
                    first_name: params.first_name,
                    last_name: params.last_name,
                    dateOfBirth: params.dateOfBirth,
                    sex: params.sex,
                })
            }>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Email của bạn là gì ?</Text>
            <Text style={styles.label2}>Nhập Email có thể dùng để liên lạc với bạn.</Text>

            <TextInput
                value={email}
                onChangeText={(text) => {
                    setEmail(text);
                    setError(''); // Xóa lỗi khi người dùng nhập
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Email"
                style={[styles.inputDate, error && { borderColor: 'red' }]}
                editable={!isLoading} // Vô hiệu hóa input khi đang loading
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.infoText}>Chúng tôi có thể gửi thông báo cho bạn qua email</Text>

            <Pressable 
                style={[styles.button, isLoading && styles.buttonDisabled]} 
                onPress={handleTiep}
                disabled={isLoading} // Vô hiệu hóa nút khi đang loading
            >
                <Text style={styles.buttonText}>Tiếp</Text>
            </Pressable>

            <View style={styles.containerButton}>
                <Pressable
                    style={styles.buttonNextSceen}
                    onPress={() => navigation.navigate('Screen2', {
                        first_name: params.first_name,
                        last_name: params.last_name,
                        dateOfBirth: params.dateOfBirth,
                        sex: params.sex,
                    })}
                    disabled={isLoading} // Vô hiệu hóa nút khi đang loading
                >
                    <Text style={styles.buttonTextNextScreen}>Đăng ký bằng số điện thoại</Text>
                </Pressable>
            </View>

            {/* Thêm các Modal */}
            <LoadingModal visible={isLoading} />
            <SuccessModal visible={isSuccess} message="Gửi OTP thành công!" />
            <FailedModal visible={isFailed} message="Không thể gửi OTP tới email này!" />
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
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        padding: height * 0.015,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
        color: 'black',
    },
    errorText: {
        color: 'red',
        fontSize: height * 0.018,
        bottom: height * 0.015,
    },
    infoText: {
        fontSize: height * 0.018,
        color: 'black',
    },
    button: {
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.05,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A0C4FF', // Màu nhạt hơn khi bị vô hiệu hóa
        opacity: 0.6,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
    containerButton: {
        width: width * 0.92,
    },
    buttonNextSceen: {
        borderWidth: 1,
        borderColor: '#CED5DF',
        height: height * 0.06,
        width: width * 0.92,
        paddingVertical: height * 0.01,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextNextScreen: {
        fontWeight: '500',
        fontSize: height * 0.02,
        color: 'black',
    },
});

export default Screen3;