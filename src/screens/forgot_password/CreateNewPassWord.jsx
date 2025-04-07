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
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false); // State cho ẩn/hiện mật khẩu mới
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State cho ẩn/hiện xác nhận mật khẩu
    const dispatch = useDispatch();

    const handleCreatePassword = async () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

        if (!passwordNew.trim()) {
            setError('Vui lòng nhập mật khẩu mới.');
            return;
        }
        if (!passwordRegex.test(passwordNew)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự, gồm chữ cái và số, không chứa ký tự đặc biệt.');
            return;
        }
        if (passwordNew !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp.');
            return;
        }

        setError('');
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
                setError(response.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            setIsLoading(false);
            console.log("Lỗi khi đổi mật khẩu:", error);
            setError(error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.');
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

           
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={(text) => {
                        setPasswordNew(text);
                        setError('');
                    }}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu mới"
                    value={passwordNew}
                    style={[styles.inputDate, error && { borderColor: 'red' }]}
                    secureTextEntry={!showPasswordNew} // Ẩn/hiện dựa trên state
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

           
            <View style={styles.inputContainer}>
                <TextInput
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        setError('');
                    }}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Xác nhận mật khẩu"
                    value={confirmPassword}
                    style={[styles.inputDate, error && { borderColor: 'red' }]}
                    secureTextEntry={!showConfirmPassword} // Ẩn/hiện dựa trên state
                    autoCapitalize="none"
                    color={'#8C96A2'}
                    autoCompleteType="password"
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

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

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
        flex: 1, // Để TextInput chiếm toàn bộ chiều ngang còn lại
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
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default CreateNewPassWord;