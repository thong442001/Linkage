import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkEmail } from '../../rtk/API';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

const Screen3 = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const check = () => {
        if (validateEmail(email)) {
            callAPICheckEamil();
        } else {
            setError('Email không hợp lệ');
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailPattern.test(email);
    };

    const callAPICheckEamil = () => {
        dispatch(checkEmail({ email: email }))
            .unwrap()
            .then((response) => {
                if (response.status) {
                    handleTiep();
                } else {
                    console.log("Lỗi: " + response.message);
                    setError(response.message)
                }
            })
            .catch((error) => {
                console.log('Error:', error);
            });
    };

    const handleTiep = () => {
        navigation.navigate('CreatePasswordScreen', {
            first_name: params.first_name,
            last_name: params.last_name,
            dateOfBirth: params.dateOfBirth,
            sex: params.sex,
            phone: null,
            email: email,
        });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Screen2')}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Email của bạn là gì ?</Text>
            <Text style={styles.label2}>Nhập Email có thể dùng để liên lạc với bạn.</Text>

            <TextInput
                value={email}
                onChangeText={setEmail}
                placeholderTextColor={'#8C96A2'}
                placeholder="Email"
                style={[styles.inputDate, error && { borderColor: 'red' }]}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={styles.infoText}>Chúng tôi có thể gửi thông báo cho bạn qua email</Text>

            <Pressable style={styles.button} onPress={check}>
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
                >
                    <Text style={styles.buttonTextNextScreen}>Đăng ký bằng số điện thoại</Text>
                </Pressable>
            </View>
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
    },
    errorText: {
        color: 'red',
        fontSize: height * 0.018,
        marginBottom: height * 0.015,
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
        color: 'black'
    }
});

export default Screen3;
