import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { register } from '../../rtk/API';
import { useDispatch } from 'react-redux';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';

const { width, height } = Dimensions.get('window');

const CreatePassWord = ({ route, navigation }) => {
    const { first_name, last_name, dateOfBirth, sex, email, phone } = route.params;
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ password: '' }); // Tách lỗi cho trường password
    const [validPassword, setValidPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [failed, setFailed] = useState(false);

    const dispatch = useDispatch();

    // Hàm validate mật khẩu
    const validatePassword = (text) => {
        if (!text.trim()) {
            return 'Vui lòng nhập mật khẩu.';
        }
        if (text.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        }
        if (!/[A-Za-z]/.test(text)) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái.';
        }
        if (!/\d/.test(text)) {
            return 'Mật khẩu phải chứa ít nhất một số.';
        }
        if (/[^A-Za-z\d]/.test(text)) {
            return 'Mật khẩu không được chứa ký tự đặc biệt.';
        }
        return '';
    };

    // Hàm xử lý khi người dùng nhập mật khẩu
    const handlePasswordChange = (text) => {
        setPassword(text);
        const error = validatePassword(text);
        setErrors({ password: error });
        setValidPassword(!error); // Mật khẩu hợp lệ nếu không có lỗi
    };

    // Hàm xử lý đăng ký
    const handleRegister = () => {
        const passwordError = validatePassword(password);

        if (passwordError) {
            setErrors({ password: passwordError });
            return;
        }

        setErrors({ password: '' });
        const userData = { first_name, last_name, dateOfBirth, sex, email, phone, password };
        dispatch(register(userData))
            .unwrap()
            .then(() => {
                setSuccessVisible(true);
                setTimeout(() => {
                    setSuccessVisible(false);
                    navigation.navigate('Login');
                }, 2000);
            })
            .catch((err) => {
                console.error(err);
                setFailed(true);
                setErrors({ password: err.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
                setTimeout(() => {
                    setFailed(false);
                }, 2000);
            });
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Tạo mật khẩu</Text>
            <Text style={styles.label2}>
                Tạo mật khẩu gồm ít nhất 6 ký tự, bao gồm chữ cái thường và chữ số.
                Bạn nên chọn mật khẩu thật khó đoán.
            </Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={password}
                    onChangeText={handlePasswordChange} // Kiểm tra ngay khi nhập
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu mới"
                    color={'black'}
                    secureTextEntry={!showPassword}
                    style={[styles.inputDate, errors.password && styles.inputError]}
                    maxLength={20} 
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
                    <Icon name={showPassword ? "eye" : "eye-slash"} size={width * 0.05} color="#8C96A2" />
                </Pressable>
            </View>

            {errors.password ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{errors.password}</Text>
                </View>
            ) : null}

            <Pressable
                style={[styles.button, validPassword ? null : styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={!validPassword}
            >
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </Pressable>

            <SuccessModal visible={successVisible} message="Tạo tài khoản thành công!" />
            <FailedModal visible={failed} message="Đã có lỗi xảy ra! Vui lòng thử lại" />
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
        color: 'black',
    },
    inputError: {
        borderColor: 'red',
    },
    iconEye: {
        position: 'absolute',
        right: width * 0.03,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: height * 0.005,
        marginBottom: height * 0.01,
    },
    errorIcon: {
        marginRight: width * 0.02,
    },
    errorText: {
        color: 'red',
        fontSize: height * 0.018,
    },
    button: {
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.05,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default CreatePassWord;