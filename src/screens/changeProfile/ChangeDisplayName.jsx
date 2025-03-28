import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
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

    // Hàm validate tên: chỉ kiểm tra ký tự hợp lệ, không giới hạn độ dài
    const validateName = (name) => {
        const regex = /^[A-Za-zÀ-Ỹà-ỹ\s]+$/; // Chỉ kiểm tra ký tự hợp lệ, không giới hạn độ dài
        return regex.test(name);
    };

    const onChangeNameUser = async () => {
        // Kiểm tra không để trống
        if (!first_name.trim() || !last_name.trim()) {
            setShowErrorFirstName(!first_name.trim());
            setShowErrorLastName(!last_name.trim());
            Alert.alert('Thông báo', "Vui lòng nhập đầy đủ họ và tên mới.");
            return;
        }

        // Kiểm tra ký tự hợp lệ
        if (!validateName(first_name) || !validateName(last_name)) {
            setShowErrorFirstName(!validateName(first_name));
            setShowErrorLastName(!validateName(last_name));
            Alert.alert('Thông báo', "Tên không hợp lệ! Chỉ được chứa chữ cái, không chứa số hoặc ký tự đặc biệt.");
            return;
        }

        // Kiểm tra tổng độ dài
        const totalLength = first_name.trim().length + last_name.trim().length;
        if (totalLength > 30) {
            setShowErrorFirstName(true);
            setShowErrorLastName(true);
            Alert.alert('Thông báo', "Tổng độ dài của họ và tên không được vượt quá 30 ký tự.");
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

            <Text>{me.first_name} {me.last_name}</Text>
            <Text style={styles.label}>Thay đổi tên</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập tên mới"
                    style={showErrorFirstName ? styles.inputError : styles.input}
                    value={first_name}
                    onChangeText={(text) => {
                        setFirstname(text);
                        const totalLength = text.trim().length + last_name.trim().length;
                        setShowErrorFirstName(!text.trim() || !validateName(text) || totalLength > 30);
                        setShowErrorLastName(!last_name.trim() || !validateName(last_name) || totalLength > 30);
                    }}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Nhập họ mới"
                    style={showErrorLastName ? styles.inputError : styles.input}
                    value={last_name}
                    onChangeText={(text) => {
                        setLastName(text);
                        const totalLength = first_name.trim().length + text.trim().length;
                        setShowErrorFirstName(!first_name.trim() || !validateName(first_name) || totalLength > 30);
                        setShowErrorLastName(!text.trim() || !validateName(text) || totalLength > 30);
                    }}
                />
            </View>

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
        marginBottom: height * 0.015,
    },
    input: {
        flex: 1,
        fontSize: width * 0.04,
        color: 'black',
    },
    inputError: {
        flex: 1,
        fontSize: width * 0.04,
        color: 'black',
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: width * 0.03,
        paddingHorizontal: width * 0.04,
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