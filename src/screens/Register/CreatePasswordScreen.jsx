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
    const [confirmPassword, setConfirmPassword] = useState(''); // Thêm state cho nhập lại mật khẩu
    const [errors, setErrors] = useState({ password: '', confirmPassword: '' }); // Thêm lỗi cho confirmPassword
    const [validPassword, setValidPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Thêm state để hiển thị/ẩn confirmPassword
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

    // Hàm validate nhập lại mật khẩu
    const validateConfirmPassword = (confirmText, passwordText) => {
        if (!confirmText.trim()) {
            return 'Vui lòng nhập lại mật khẩu.';
        }
        if (confirmText !== passwordText) {
            return 'Mật khẩu nhập lại không khớp.';
        }
        return '';
    };

    // Hàm xử lý khi người dùng nhập mật khẩu
    const handlePasswordChange = (text) => {
        setPassword(text);
        const passwordError = validatePassword(text);
        const confirmError = validateConfirmPassword(confirmPassword, text); // Cập nhật lỗi confirm khi mật khẩu gốc thay đổi
        setErrors({ password: passwordError, confirmPassword: confirmError });
        setValidPassword(!passwordError && !confirmError && confirmPassword.trim());
    };

    // Hàm xử lý khi người dùng nhập lại mật khẩu
    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        const confirmError = validateConfirmPassword(text, password);
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        setValidPassword(!errors.password && !confirmError && password.trim());
    };

    // Hàm xử lý đăng ký
    const handleRegister = () => {
        const passwordError = validatePassword(password);
        const confirmError = validateConfirmPassword(confirmPassword, password);

        if (passwordError || confirmError) {
            setErrors({ password: passwordError, confirmPassword: confirmError });
            return;
        }

        setErrors({ password: '', confirmPassword: '' });
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
                setErrors({ password: '', confirmPassword: err.message || 'Đăng ký thất bại. Vui lòng thử lại.' });
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

            <View style={[styles.inputContainer, errors.password && styles.inputContainerError]}>
                <TextInput
                    value={password}
                    onChangeText={handlePasswordChange}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu mới"
                    color={'black'}
                    secureTextEntry={!showPassword}
                    style={[styles.inputDate]}
                    maxLength={20}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
                    <Icon name={showPassword ? 'eye' : 'eye-slash'} size={width * 0.05} color="#8C96A2" />
                </Pressable>
            </View>
            {errors.password ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{errors.password}</Text>
                </View>
            ) : null}

            <View style={[styles.inputContainer, errors.confirmPassword && styles.inputContainerError]}>
                <TextInput
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập lại mật khẩu"
                    color={'black'}
                    secureTextEntry={!showConfirmPassword}
                    style={[styles.inputDate]}
                    maxLength={20}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.iconEye}>
                    <Icon name={showConfirmPassword ? 'eye' : 'eye-slash'} size={width * 0.05} color="#8C96A2" />
                </Pressable>
            </View>
            {errors.confirmPassword ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
        marginVertical: height * 0.01,
    },
    inputContainerError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    inputDate: {
        flex: 1,
        color: 'black',
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