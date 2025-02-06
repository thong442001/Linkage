import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { register } from '../../rtk/API';
import { useDispatch } from 'react-redux';

const { width, height } = Dimensions.get('window');

const CreatePasswordScreen = (props) => {

    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();

    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const onRegister = () => {
        console.log(params.first_name);
        console.log(params.last_name);
        console.log(params.dateOfBirth);
        console.log(params.sex)
        console.log(params.phone);
        console
        const userDataRegister = {
            first_name: params.first_name,
            last_name: params.last_name,
            dateOfBirth: params.dateOfBirth,
            sex: params.sex,
            email: params.email,
            phone: params.phone,
            password: password,
        };
        if (password != '') {
            dispatch(register(userDataRegister))
                .unwrap()
                .then((response) => {
                    console.log(response?.message);
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    if (error?.message === 'Tài khoản đã tồn tại') {
                        console.log('Tài khoản đã tồn tại. Vui lòng thử email hoặc số điện thoại khác.');
                    } else {
                        console.log('Lỗi không xác định:', error);
                    }
                });
                
        } else {
            console.log('THieu password');
        }

    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={30} color="black" />
            </Pressable>

            <Text style={styles.title}>Tạo mật khẩu</Text>
            <Text style={styles.description}>
                Tạo mật khẩu gồm ít nhất 6 chữ cái hoặc chữ số. Bạn nên chọn mật khẩu thật khó đoán
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={'#8C96A2'}
                    style={styles.input}
                    placeholder="Mật khẩu"
                    secureTextEntry={!isPasswordVisible}
                    value={password}
                    onChangeText={setPassword}
                />
                <Pressable onPress={togglePasswordVisibility} style={styles.eyeIcon}>
                    <Icon name={isPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#A0A0A0" />
                </Pressable>
            </View>

            <Pressable
                style={styles.button}
                onPress={() => onRegister()}
            >
                <Text style={styles.buttonText}>Tạo</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
        backgroundColor: '#EFF5FF',
    },
    iconBack: {
        marginBottom: height * 0.02,
    },
    title: {
        fontSize: width * 0.07,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: height * 0.01,
    },
    description: {
        fontSize: width * 0.04,
        color: 'black',
        marginBottom: height * 0.03,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: width * 0.03,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#FFFFFF',
        marginBottom: height * 0.03,
    },
    input: {
        flex: 1,
        fontSize: width * 0.045,
        color: 'black',
    },
    eyeIcon: {
        marginLeft: width * 0.02,
    },
    button: {
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.07,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.045,
    },
});

export default CreatePasswordScreen;
