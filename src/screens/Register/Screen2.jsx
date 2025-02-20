import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkPhone } from '../../rtk/API';
import { useDispatch } from 'react-redux';

const { width } = Dimensions.get('window');

const Screen2 = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    function isValidPhone(phone) {
        return /^(84|0[3|5|7|8|9])[0-9]{8}$/.test(phone);
    }

    const check = () => {
        if (!phone.trim()) {
            setError('Vui lòng nhập số điện thoại.');
            return;
        }

        if (!isValidPhone(phone)) {
            setError('Số điện thoại không hợp lệ.');
            return;
        }

        setError('');
        callAPICheckPhone();
    };


    const callAPICheckPhone = () => {
        dispatch(checkPhone({ phone }))
    .unwrap()
    .then((response) => {
        console.log("Response từ API:", response); 
        if (response.status) {
            handleTiep();
        } else {
            Alert.alert('Lỗi', response.message);
        }
    })
    .catch((error) => {
        Alert.alert('Lỗi', 'Đã xảy ra lỗi khi kiểm tra số điện thoại.');
        console.log('Error:', error);
    });

    };


    const handleTiep = () => {
        navigation.navigate('CreatePasswordScreen', {
            first_name: params.first_name,
            last_name: params.last_name,
            dateOfBirth: params.dateOfBirth,
            sex: params.sex,
            phone: phone,
            email: null,
        });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Screen1')}>
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

            <Pressable style={styles.button} onPress={check}>
                <Text style={styles.buttonText}>Tiếp</Text>
            </Pressable>

            <View style={styles.containerButton}>
                <Pressable
                    style={styles.buttonNextSceen}
                    onPress={() => navigation.navigate('Screen3', {
                        first_name: params.first_name,
                        last_name: params.last_name,
                        dateOfBirth: params.dateOfBirth,
                        sex: params.sex,
                    })}
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
