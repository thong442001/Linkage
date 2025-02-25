import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { register } from '../../rtk/API'; 
import { useDispatch } from 'react-redux';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
const { width, height } = Dimensions.get('window');

const CreateNewPassWord = ({ route, navigation }) => {
    const { first_name, last_name, dateOfBirth, sex, email, phone } = route.params; 
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [validPassword, setValidPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false); 
    const [successVisible, setSuccessVisible] = useState(false); 
    const [failed, setfailed] = useState(false);

    const dispatch = useDispatch();

    
    const validatePassword = (text) => {
        // Yêu cầu: ít nhất 6 ký tự, bao gồm chữ cái và số, không được chứa ký tự đặc biệt
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    
        if (!passwordRegex.test(text)) {
            setError('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ cái và số, không được chứa ký tự đặc biệt.');
        } else {
            setError('');
        }
    
        setPassword(text);
        setValidPassword(passwordRegex.test(text));
    };
    
    // Hàm xử lý đăng ký
    const handleRegister = () => {
        if (!validPassword) {
            setError('Vui lòng nhập mật khẩu hợp lệ.');
            return;
        }
    
        const userData = { first_name, last_name, dateOfBirth, sex, email, phone, password }; 
        dispatch(register(userData)) 
            .unwrap()
            .then(() => {
                setSuccessVisible(true)
                setTimeout(() => {
                    setSuccessVisible(false);
                }, 2000); 
                navigation.navigate('Login');
            })
            .catch((err) => {
                console.error(err);
                setfailed(true)
                setTimeout(() => {
                    setfailed(false);
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

            <SuccessModal visible={successVisible} message="Tạo tài khoản thành công!"/>
            <FailedModal visible={failed} message="Đã có lỗi xảy ra! Vui lòng thử lại"/>
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
