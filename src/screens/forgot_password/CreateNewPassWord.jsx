import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { quenMatKhau_gmail } from '../../rtk/API';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import SuccessModal from '../../utils/animation/success/SuccessModal';

const { width, height } = Dimensions.get('window');

const CreateNewPassWord = (props) => {
    const { route, navigation } = props;
    const { gmail } = route.params;
    const [passwordNew, setPasswordNew] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({ passwordNew: '', confirmPassword: '' }); // Tách lỗi cho từng trường
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const dispatch = useDispatch();

    // Hàm validate mật khẩu mới
    const validatePasswordNew = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
        if (!password.trim()) {
            return 'Vui lòng nhập mật khẩu mới.';
        }
        if (password.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự.';
        }
        if (!/[A-Za-z]/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một chữ cái.';
        }
        if (!/\d/.test(password)) {
            return 'Mật khẩu phải chứa ít nhất một số.';
        }
        if (/[^A-Za-z\d]/.test(password)) {
            return 'Mật khẩu không được chứa ký tự đặc biệt.';
        }
        return '';
    };

    // Hàm validate xác nhận mật khẩu
    const validateConfirmPassword = (confirm, password) => {
        if (!confirm.trim()) {
            return 'Vui lòng nhập xác nhận mật khẩu.';
        }
        if (confirm !== password) {
            return 'Mật khẩu xác nhận không khớp.';
        }
        return '';
    };

    // Validate khi người dùng nhập
    const handlePasswordNewChange = (text) => {
        setPasswordNew(text);
        const error = validatePasswordNew(text);
        setErrors((prev) => ({ ...prev, passwordNew: error }));
    };

    const handleConfirmPasswordChange = (text) => {
        setConfirmPassword(text);
        const error = validateConfirmPassword(text, passwordNew);
        setErrors((prev) => ({ ...prev, confirmPassword: error }));
    };

    const handleCreatePassword = async () => {
        const passwordNewError = validatePasswordNew(passwordNew);
        const confirmPasswordError = validateConfirmPassword(confirmPassword, passwordNew);

        if (passwordNewError || confirmPasswordError) {
            setErrors({
                passwordNew: passwordNewError,
                confirmPassword: confirmPasswordError,
            });
            return;
        }

        setErrors({ passwordNew: '', confirmPassword: '' });
        setIsLoading(true);
        try {
            console.log("Sending payload:", { gmail, passwordNew });
            const response = await dispatch(quenMatKhau_gmail({ gmail, passwordNew })).unwrap();
            console.log("Response từ quenMatKhau_gmail:", response);

            if (response.status) {
                setIsLoading(false);
                setIsSuccess(true);
                setTimeout(() => {
                    setIsSuccess(false);
                    navigation.navigate('Login');
                }, 2000);
            } else {
                setIsLoading(false);
                setErrors({ passwordNew: '', confirmPassword: response.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.' });
            }
        } catch (error) {
            setIsLoading(false);
            console.log("Lỗi khi đổi mật khẩu:", error);
            setErrors({ passwordNew: '', confirmPassword: error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.' });
        }
    };

    return (
        <View style={styles.container}>
            <LoadingModal visible={isLoading} />
            <SuccessModal visible={isSuccess} message="Đổi mật khẩu thành công!" />

            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Tạo mật khẩu mới</Text>
            <Text style={styles.label2}>
                Mật khẩu phải có ít nhất 6 ký tự, gồm chữ cái và số, không chứa ký tự đặc biệt.
            </Text>

            {/* Trường nhập mật khẩu mới */}
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={handlePasswordNewChange}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu mới"
                    value={passwordNew}
                    style={[styles.inputDate, errors.passwordNew && { borderColor: 'red' }]}
                    secureTextEntry={!showPasswordNew}
                    autoCapitalize="none"
                    color={'#8C96A2'}
                    autoCompleteType="password"
                />
                <Pressable
                    onPress={() => setShowPasswordNew(!showPasswordNew)}
                    style={styles.iconEye}
                >
                    <Icon
                        name={showPasswordNew ? 'eye' : 'eye-slash'}
                        size={width * 0.05}
                        color="#8C96A2"
                    />
                </Pressable>
            </View>
            {errors.passwordNew ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{errors.passwordNew}</Text>
                </View>
            ) : null}

            {/* Trường nhập xác nhận mật khẩu */}
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={handleConfirmPasswordChange}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    style={[styles.inputDate, errors.confirmPassword && { borderColor: 'red' }]}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    color={'#8C96A2'}
                    autoCompleteType="password"
                    maxLength={20}
                    minLength={6}
                />
                <Pressable
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.iconEye}
                >
                    <Icon
                        name={showConfirmPassword ? 'eye' : 'eye-slash'}
                        size={width * 0.05}
                        color="#8C96A2"
                    />
                </Pressable>
            </View>
            {errors.confirmPassword ? (
                <View style={styles.errorContainer}>
                    <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                </View>
            ) : null}

            <Pressable
                style={[styles.button, { opacity: isLoading ? 0.6 : 1 }]}
                onPress={handleCreatePassword}
                disabled={isLoading}
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
        marginVertical: height * 0.01,
    },
    inputDate: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        padding: height * 0.015,
        backgroundColor: '#fff',
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
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default CreateNewPassWord;