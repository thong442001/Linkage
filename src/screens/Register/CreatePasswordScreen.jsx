import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { register } from '../../rtk/API'; 
import { useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');

const CreateNewPassWord = ({ route, navigation }) => {
    const { first_name, last_name, dateOfBirth, sex, email, phone } = route.params; 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const dispatch = useDispatch();

    
    const validatePassword = (text) => {
        const hasUpperCase = /[A-Z]/.test(text); // Kiểm tra chữ in hoa
        const hasLowerCase = /[a-z]/.test(text); // Kiểm tra chữ thường
        const hasNumber = /\d/.test(text); // Kiểm tra chữ số
        const hasSpecialChar = /[^a-zA-Z0-9]/.test(text); // Kiểm tra ký tự đặc biệt
        const minLength = text.length >= 8; // Kiểm tra độ dài tối thiểu

        if (!minLength) {
            setError('Mật khẩu phải có ít nhất 8 ký tự.');
        } else if (!hasUpperCase) {
            setError('Mật khẩu phải chứa ít nhất một chữ cái in hoa.');
        } else if (!hasLowerCase) {
            setError('Mật khẩu phải chứa ít nhất một chữ cái thường.');
        } else if (!hasNumber) {
            setError('Mật khẩu phải chứa ít nhất một chữ số.');
        } else if (hasSpecialChar) {
            setError('Mật khẩu không được chứa ký tự đặc biệt.');
        } else {
            setError('');
        }

        setPassword(text);
        setValidPassword(minLength && hasUpperCase && hasLowerCase && hasNumber && !hasSpecialChar);
    };

    // Hàm xử lý đăng ký
    const handleRegister = () => {
        const userData = { first_name, last_name, dateOfBirth, sex, email, phone, password }; 
        dispatch(register(userData)) 
            .unwrap()
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((err) => {
                console.error(err);
                setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại.');
            });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Tạo mật khẩu</Text>
            <Text style={styles.label2}>
                Tạo mật khẩu gồm ít nhất 8 ký tự, bao gồm chữ cái in hoa, chữ cái thường và chữ số.
                Bạn nên chọn mật khẩu thật khó đoán.
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={password}
                    onChangeText={validatePassword} // Kiểm tra ngay khi nhập
                    placeholderTextColor={'black'}
                    placeholder="Mật khẩu mới"
                    color={'black'}
                    secureTextEntry={!showPassword} // Nếu showPassword là true thì mật khẩu sẽ hiện ra
                    style={[styles.inputDate, error ? styles.inputError : null]} // Đổi màu khi lỗi
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} >
                    <Icon name={showPassword ? "eye-slash" : "eye"} size={width * 0.06} color="black" />
                </Pressable>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable
                style={[styles.button, validPassword ? null : styles.buttonDisabled]} 
                onPress={handleRegister} // Gọi hàm handleRegister khi nhấn nút
                disabled={!validPassword} // Chặn nếu mật khẩu không hợp lệ
            >
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        paddingHorizontal: width * 0.03,
        marginVertical: height * 0.02,
    },
    inputDate: {
        flex: 1,
        paddingVertical: height * 0.015,
    },
    inputError: {
        borderColor: 'red', 
    },
    errorText: {
        color: 'red',
        fontSize: height * 0.018,
        marginBottom: height * 0.015,
    },
    button: {
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.05,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0', // Màu xám nếu có lỗi
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default CreateNewPassWord;
