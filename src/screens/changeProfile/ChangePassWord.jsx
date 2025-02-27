import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { editPasswordOfUser } from '../../rtk/API';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';

const { width, height } = Dimensions.get('window');

const ChangePassWord = (props) => {
    const { navigation } = props;
    const me = useSelector(state => state.app.user);
    const dispatch = useDispatch();

    const [passwordNew, setpasswordNew] = useState('');
    const [passwordOLd, setPasswordOld] = useState('');
    const [RePass, setRepass] = useState('');
    const [btnState, setBtnState] = useState(false);
    const [loading, setLoading] = useState(false); 
    const [successVisible, setSuccessVisible] = useState(false); 
    const [failed, setfailed] = useState(false);

    const [errorOldPassword, setErrorOldPassword] = useState('');
    const [errorNewPassword, setErrorNewPassword] = useState('');
    const [errorRePass, setErrorRePass] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    
    useEffect(() => {
        if (passwordNew.trim() && passwordOLd.trim() && RePass.trim()) {
            setBtnState(true);
        } else {
            setBtnState(false);
        }
    }, [passwordNew, passwordOLd, RePass]);

    const onChangePassWord = async () => {
        let hasError = false;
        setErrorOldPassword('');
        setErrorNewPassword('');
        setErrorRePass('');
        
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    
        if (!passwordRegex.test(passwordNew)) {
            setErrorNewPassword('Mật khẩu mới phải có ít nhất 6 ký tự, bao gồm chữ cái và số, không được chứa ký tự đặc biệt.');
            hasError = true;
        }
    
        if (passwordNew === passwordOLd) {
            setErrorOldPassword('Mật khẩu mới không được trùng với mật khẩu cũ.');
            hasError = true;
        }
    
        if (passwordNew !== RePass) {
            setErrorRePass('Mật khẩu nhập lại không khớp.');
            hasError = true;
        }
    
        if (hasError) {
            return;
        }
    
        setLoading(true);
        setBtnState(false);
        const data = { ID_user: me._id, passwordOLd, passwordNew };
    
        setTimeout(() => {
            dispatch(editPasswordOfUser(data))
                .unwrap()
                .then((response) => {
                    if (response.status === true) {
                        setSuccessVisible(true); 
                        setTimeout(() => {
                            setSuccessVisible(false);
                            navigation.goBack(); 
                        }, 2000); 
                    } else {
                        setfailed(true);
                        setTimeout(() => {
                            setfailed(false);
                        }, 2000);
                    }
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setLoading(false);
                    setBtnState(true);
                });
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>
            <Text>{me.first_name} {me.last_name}</Text>
            <Text style={styles.label}>Thay đổi mật khẩu</Text>
            <Text style={styles.label2}>Mật khẩu của bạn phải có tối thiểu 6 ký tự, bao gồm cả chữ số, chữ cái.</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    value={passwordOLd}
                    onChangeText={setPasswordOld}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu hiện tại"
                    style={styles.input}
                    secureTextEntry={!showOldPassword}
                />
                <Pressable onPress={() => setShowOldPassword(!showOldPassword)}>
                    <Icon name={showOldPassword ? "eye" : "eye-slash"} size={22} color="black" />
                </Pressable>
            </View>
            {errorOldPassword ? <Text style={styles.errorText}>{errorOldPassword}</Text> : null}

            <View style={styles.inputContainer}>
                <TextInput
                    value={passwordNew}
                    onChangeText={setpasswordNew}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Mật khẩu mới"
                    style={styles.input}
                    secureTextEntry={!showNewPassword}
                />
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                    <Icon name={showNewPassword ? "eye" : "eye-slash"} size={22} color="black" />
                </Pressable>
            </View>
            {errorNewPassword ? <Text style={styles.errorText}>{errorNewPassword}</Text> : null}

            <View style={styles.inputContainer}>
                <TextInput
                    value={RePass}
                    onChangeText={setRepass}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập lại mật khẩu mới"
                    style={styles.input}
                    secureTextEntry={!showRePassword}
                />
                <Pressable onPress={() => setShowRePassword(!showRePassword)}>
                    <Icon name={showRePassword ? "eye" : "eye-slash"} size={22} color="black" />
                </Pressable>
            </View>
            {errorRePass ? <Text style={styles.errorText}>{errorRePass}</Text> : null}

            <View style={styles.passInfoContainer}>
                <Pressable onPress={() => navigation.navigate('FindWithEmail')}>
                    <Text style={styles.textBlue}>Bạn quên mật khẩu ư?</Text>
                </Pressable>
            </View>

            <Pressable
                style={btnState && !loading ? styles.button : styles.buttonOpacity}
                onPress={onChangePassWord}
                disabled={!btnState || loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Đổi mật khẩu</Text>
                )}
            </Pressable>

            <SuccessModal visible={successVisible} message="Cập nhật mật khẩu thành công!" />
            <FailedModal visible={failed} message="Cập nhật thất bại! Vui lòng thử lại"/> 
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
        backgroundColor: '#f0f4ff',
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
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
    button: {
        position: 'absolute',
        bottom: width * 0.04,
        left: 0,
        right: 0,
        marginHorizontal: width * 0.03,
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.1,
        alignItems: 'center',
    },
    buttonOpacity: {
        position: 'absolute',
        bottom: width * 0.04,
        left: 0,
        right: 0,
        marginHorizontal: width * 0.03,
        marginVertical: height * 0.02,
        backgroundColor: '#A0A0A0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.03,
        
        borderRadius: width * 0.08,
        marginBottom: height * 0.015,
        justifyContent: 'space-between',
    },
    input: {
        fontSize: height * 0.02,
        color: 'black',
        width: '90%',
    },
    textBlue: {
        fontSize: height * 0.02,
        color: '#0064E0',
    },
});

export default ChangePassWord;
