import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { checkOTP_gmail } from '../../rtk/API';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

const OTPGmailScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;
    const dispatch = useDispatch();

    // State để lưu giá trị của từng ô OTP (4 ô)
    const [otp, setOtp] = useState(['', '', '', '']);
    const [error, setError] = useState(''); // State để hiển thị lỗi
    // Ref để di chuyển focus giữa các ô
    const inputRefs = useRef([]);

    // Hàm xử lý khi nhập giá trị vào ô
    const handleOtpChange = (text, index) => {
        if (/^[0-9]$/.test(text) || text === '') { // Chỉ cho phép số hoặc rỗng
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            // Tự động chuyển focus sang ô tiếp theo nếu nhập xong
            if (text && index < 3) {
                inputRefs.current[index + 1].focus();
            }
            // Chuyển về ô trước nếu xóa
            if (!text && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    };

    // Hàm kiểm tra khi nhấn nút Xác nhận
    const handleSubmit = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 4) {
            setError('Vui lòng nhập đủ 4 số');
            return;
        }

        setError(''); // Xóa lỗi nếu có

        try {
            // Gọi API checkOTP_gmail để kiểm tra OTP
            const response = await dispatch(checkOTP_gmail({
                gmail: params.email, // Email được truyền từ Screen3
                otp: otpCode
            })).unwrap();

            if (response.status) {
                // Nếu OTP hợp lệ, chuyển sang màn hình CreatePasswordScreen
                console.log("Response từ checkOTP_gmail:", response);
                navigation.navigate('CreatePasswordScreen', {
                    first_name: params.first_name,
                    last_name: params.last_name,
                    dateOfBirth: params.dateOfBirth,
                    sex: params.sex,
                    phone: params.phone,
                    email: params.email,
                });
                setOtp(['', '', '', '']); // Reset giá trị OTP sau khi xác nhận thành công
            } else {
                // Nếu OTP không hợp lệ, hiển thị thông báo lỗi
                setError(response.message || 'Mã OTP không đúng');
            }
        } catch (error) {
            console.log('Error checking OTP:', error);
            setError('Mã OTP không hợp lệ.');
        }
    };

    // Hàm xóa toàn bộ giá trị trong các ô
    const handleClear = () => {
        setOtp(['', '', '', '']);
        setError(''); // Xóa lỗi khi xóa OTP
        inputRefs.current[0].focus(); // Đưa focus về ô đầu tiên
    };

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={() => navigation.navigate('Screen3', params)}>
                <Icon name="angle-left" size={width * 0.08} color="black" />
            </Pressable>
            <Text style={styles.title}>Nhập mã OTP</Text>
            <View style={styles.otpContainer}>
                {otp.map((digit, index) => (
                    <TextInput
                        key={index}
                        style={[styles.otpInput, error && { borderColor: 'red' }]} // Đổi màu viền nếu có lỗi
                        value={digit}
                        onChangeText={(text) => handleOtpChange(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        ref={(ref) => (inputRefs.current[index] = ref)}
                        color="#333"/>
                ))}
                <TouchableOpacity onPress={handleClear} style={{ left: width * 0.02 }}>
                <MaterialIcons name={"backspace"} size={width * 0.08} color="black" />
                </TouchableOpacity>
            </View>
            <View>
            <Text style={styles.instruction}>
                Vui lòng nhập mã OTP gồm 4 số được gửi đến</Text>
            <Text style={styles.nameMail}>{params.email}</Text>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Xác nhận</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f4ff',
    },
    backButton: {
        position: 'absolute',
        top: height * 0.05,
        left: width * 0.05,
    },
    title: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginTop: height * 0.15,
        marginBottom: height * 0.03,
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.6,
        alignSelf: 'center',
        alignItems: 'center'
    },
    otpInput: {
        width: width * 0.12,
        height: width * 0.12,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: width * 0.05,
        backgroundColor: '#fff',
        marginHorizontal: width * 0.015,
    },
    instruction: {
        marginTop: height * 0.03,
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: width * 0.05,
    },
    nameMail:{
        fontWeight: 'bold',
        fontSize: width * 0.04,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: width * 0.05,
    },
    errorText: {
        color: 'red',
        fontSize: width * 0.04,
        textAlign: 'center',
        marginTop: height * 0.02,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.03,
        alignSelf: 'center',
        alignItems: 'center',
    },
    submitButton: {
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: 8,
    },
    clearButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.05,
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
});

export default OTPGmailScreen;