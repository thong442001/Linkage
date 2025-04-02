import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkPhone, sendOTP_dangKi } from '../../rtk/API';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

const Screen2 = (props) => {
    const { route, navigation } = props;
    const { params } = route;
    const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    // Hàm kiểm tra định dạng số điện thoại
    function isValidPhone(phone) {
        const cleanedPhone = phone.replace(/\D/g, '');
        return /^(?:\+84|84|0)(3[2-9]|5[5-9]|7[0|6-9]|8[1-9]|9[0-4|6-9])\d{7}$/.test(cleanedPhone);
    }

    // Hàm xử lý khi nhấn "Tiếp"
    const handleNext = async () => {
        // Kiểm tra đầu vào
        if (!phone.trim()) {
            setError('Vui lòng nhập số điện thoại.');
            return;
        }

        if (!isValidPhone(phone)) {
            setError('Số điện thoại không hợp lệ.');
            return;
        }

        setError('');
        try {
            // Gọi API checkPhone để kiểm tra số có tồn tại không
            const checkResponse = await dispatch(checkPhone({ phone })).unwrap();
            console.log("Response từ checkPhone:", checkResponse);

            if (checkResponse.status) {
                // Số chưa tồn tại -> Gửi OTP
                const otpResponse = await dispatch(sendOTP_dangKi({ phone })).unwrap();
                console.log("Response từ sendOTP_dangKi:", otpResponse);

                if (otpResponse.status) {
                    // Chuyển sang OTPScreen với dữ liệu người dùng
                    navigation.navigate('OTPScreen', {
                        first_name: params.first_name,
                        last_name: params.last_name,
                        dateOfBirth: params.dateOfBirth,
                        sex: params.sex,
                        phone: phone,
                    });
                } else {
                    Alert.alert('Lỗi', otpResponse.message || 'Không thể gửi OTP.');
                }
            } else {
                Alert.alert('Lỗi', checkResponse.message || 'Số điện thoại đã tồn tại.');
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi xử lý. Vui lòng thử lại.');
            console.log('Error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Screen1', params)}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Số di động của bạn là gì?</Text>
            <Text style={styles.label2}>Nhập số di động có thể dùng để liên lạc với bạn.</Text>

            <TextInput
                value={phone}
                onChangeText={(text) => {
                    setPhone(text);
                    setError('');
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Số điện thoại"
                style={[styles.inputDate, error && { borderColor: 'red' }]}
                keyboardType="phone-pad"
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.infoText}>Chúng tôi có thể gửi thông báo cho bạn qua SMS</Text>
            <Pressable style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Tiếp</Text>
            </Pressable>

            <View style={styles.containerButton}>
                <Pressable
                    style={styles.buttonNextSceen}
                    onPress={() => navigation.navigate('Screen3', params)}
                >
                    <Text style={styles.buttonTextNextScreen}>Đăng ký bằng email</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    iconBack: {
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    label2: {
        fontSize: 16,
        color: '#555',
        marginBottom: 10,
    },
    inputDate: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        marginBottom: 5,
        color: 'black',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    infoText: {
        fontSize: 14,
        color: '#777',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    containerButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    buttonNextSceen: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    buttonTextNextScreen: {
        fontSize: 16,
        color: '#007bff',
    },
});

export default Screen2;