import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { sendOTP_quenMatKhau_gmail } from '../../rtk/API';

const { width, height } = Dimensions.get('window');

const FindWithEmail = (props) => {
    const { navigation } = props;
    const [gmail, setGmail] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleCheckEmail = async () => {
        if (!gmail.trim()) {
            setError('Vui lòng nhập địa chỉ email.');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(gmail)) {
            setError('Địa chỉ email không hợp lệ.');
            return;
        }

        setError('');
        try {
            console.log("Sending payload:", { gmail });
            const response = await dispatch(sendOTP_quenMatKhau_gmail({ gmail })).unwrap();
            console.log("Response từ sendOTP_quenMatKhau_gmail:", response);
            if (response.status) {
                navigation.navigate('CheckEmail', { gmail });
            } else {
                setError(response.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error("Lỗi khi gửi OTP:", error);
            setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>
            <Text style={styles.label}>Tìm tài khoản</Text>
            <Text style={styles.label2}>Nhập địa chỉ email của bạn</Text>
            <TextInput
                onChangeText={(text) => {
                    setGmail(text);
                    setError('');
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Email"
                color={'#8C96A2'}
                autoCapitalize="none"
                value={gmail}
                style={styles.inputDate}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Pressable style={styles.button} onPress={handleCheckEmail}>
                <Text style={styles.buttonText}>Tiếp</Text>
            </Pressable>
            <View style={styles.containerButton}>
                <Pressable
                    style={styles.buttonNextSceen}
                    onPress={() => navigation.navigate('FindWithPhone')}
                >
                    <Text style={styles.buttonTextNextScreen}>Tìm bằng số điện thoại</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
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

export default FindWithEmail;