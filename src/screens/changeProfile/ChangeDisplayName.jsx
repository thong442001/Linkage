import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { editNameOfUser } from '../../rtk/API';
import { changeName } from '../../rtk/Reducer';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';

const { width, height } = Dimensions.get('window');

const ChangeDisplayName = ({ navigation }) => {
    const me = useSelector(state => state.app.user);
    const dispatch = useDispatch();

    const [first_name, setFirstname] = useState('');
    const [last_name, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const [failed, setFailed] = useState(false);
    const [showErrorFirstName, setShowErrorFirstName] = useState(false);
    const [showErrorLastName, setShowErrorLastName] = useState(false);
    const [errorMessageFirstName, setErrorMessageFirstName] = useState('');
    const [errorMessageLastName, setErrorMessageLastName] = useState('');

    // Hàm validate tên: chỉ kiểm tra ký tự hợp lệ
    const validateName = (name) => {
        const regex = /^[A-Za-zÀ-Ỹà-ỹ\s]+$/;
        return regex.test(name);
    };

    // Hàm kiểm tra và đặt thông báo lỗi
    const checkErrors = (firstName, lastName) => {
        const totalLength = firstName.trim().length + lastName.trim().length;

        // Kiểm tra lỗi cho first_name
        if (!firstName.trim()) {
            setShowErrorFirstName(true);
            setErrorMessageFirstName('Vui lòng nhập tên');
        } else if (!validateName(firstName)) {
            setShowErrorFirstName(true);
            setErrorMessageFirstName('Tên chỉ được chứa chữ cái, không chứa số hoặc ký tự đặc biệt');
        } else if (totalLength > 30) {
            setShowErrorFirstName(true);
            setErrorMessageFirstName('Tổng độ dài họ và tên không được vượt quá 30 ký tự');
        } else {
            setShowErrorFirstName(false);
            setErrorMessageFirstName('');
        }

        // Kiểm tra lỗi cho last_name
        if (!lastName.trim()) {
            setShowErrorLastName(true);
            setErrorMessageLastName('Vui lòng nhập họ');
        } else if (!validateName(lastName)) {
            setShowErrorLastName(true);
            setErrorMessageLastName('Họ chỉ được chứa chữ cái, không chứa số hoặc ký tự đặc biệt');
        } else if (totalLength > 30) {
            setShowErrorLastName(true);
            setErrorMessageLastName('Tổng độ dài họ và tên không được vượt quá 30 ký tự');
        } else {
            setShowErrorLastName(false);
            setErrorMessageLastName('');
        }
    };

    const onChangeNameUser = async () => {
        checkErrors(first_name, last_name);

        // Nếu có lỗi, không thực hiện đổi tên
        if (showErrorFirstName || showErrorLastName) {
            return;
        }

        setLoading(true);

        const data = { ID_user: me._id, first_name, last_name };

        setTimeout(() => {
            dispatch(editNameOfUser(data))
                .unwrap()
                .then(() => {
                    dispatch(changeName({ first_name, last_name }));
                    setSuccessVisible(true);
                    setTimeout(() => {
                        setSuccessVisible(false);
                        navigation.goBack();
                    }, 2000);
                    setFirstname('');
                    setLastName('');
                })
                .catch(error => {
                    console.error(error);
                    setFailed(true);
                    setTimeout(() => {
                        setFailed(false);
                    }, 2000);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={{ color: 'black' }}>{me.first_name} {me.last_name}</Text>
            <Text style={styles.label}>Thay đổi tên</Text>

            <View style={[styles.inputContainer, showErrorFirstName && styles.inputContainerError]}>
                <TextInput
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập tên mới"
                    style={styles.input}
                    value={first_name}
                    onChangeText={(text) => {
                        setFirstname(text);
                        checkErrors(text, last_name);
                    }}
                />
            </View>
            {showErrorFirstName && (
                <Text style={styles.errorText}>{errorMessageFirstName}</Text>
            )}

            <View style={[styles.inputContainer, showErrorLastName && styles.inputContainerError]}>
                <TextInput
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập họ mới"
                    style={styles.input}
                    value={last_name}
                    onChangeText={(text) => {
                        setLastName(text);
                        checkErrors(first_name, text);
                    }}
                />
            </View>
            {showErrorLastName && (
                <Text style={styles.errorText}>{errorMessageLastName}</Text>
            )}

            <View style={styles.passInfoContainer}>
                <Text style={styles.textBlue}>Tên của bạn sẽ là: {first_name} {last_name}</Text>
            </View>

            <Pressable
                style={[
                    styles.button,
                    (loading || !first_name.trim() || !last_name.trim() || showErrorFirstName || showErrorLastName) && styles.buttonDisabled,
                ]}
                onPress={onChangeNameUser}
                disabled={loading || !first_name.trim() || !last_name.trim() || showErrorFirstName || showErrorLastName}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Đổi tên</Text>
                )}
            </Pressable>

            <SuccessModal visible={successVisible} message="Cập nhật tên thành công" />
            <FailedModal visible={failed} message="Cập nhật tên thất bại" />
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: width * 0.03,
        paddingHorizontal: width * 0.04,
        backgroundColor: '#FFFFFF',
        marginVertical: height * 0.009,
    },
    inputContainerError: {
        borderColor: 'red',
        borderWidth: 1,
    },
    input: {
        flex: 1,
        fontSize: width * 0.04,
        color: 'black',
    },
    errorText: {
        color: 'red',
        fontSize: width * 0.035,
    },
    passInfoContainer: {
        paddingVertical: width * 0.01,
        flexDirection: 'column',
        paddingHorizontal: width * 0.02,
    },
    textBlue: {
        color: '#0064E0',
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
    buttonDisabled: {
        backgroundColor: '#A0A0A0',
    },
    buttonText: {
        fontWeight: '450',
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default ChangeDisplayName;