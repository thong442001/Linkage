import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkPhone, sendOTP_dangKi_phone } from '../../rtk/API';
import { useDispatch } from 'react-redux';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
const { width, height } = Dimensions.get('window');

const FindWithPhone = (props) => {
    const { navigation } = props;
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();


     const handleCheckPhone = async () => {
            if (!phone.trim()) {
                setError('Vui lòng nhập số điện thoại.');
                return;
            }
    
            const phoneRegex = /^(?:\+84|84|0)(3[2-9]|5[5-9]|7[0|6-9]|8[1-9]|9[0-4|6-9])\d{7}$/;
            if (!phoneRegex.test(phone)) {
                setError('Số điện thoại không hợp lệ.');
                return;
            }
    
            setError('');
            setIsLoading(true); // Bật loading trước khi gửi request
            try {
                setIsLoading(true); // Bật loading trước khi gửi request
                console.log("Sending payload:", { phone });
                const response = await dispatch(sendOTP_dangKi_phone({ phone })).unwrap();
                console.log("Response từ sendOTP_dangKi_phone:", response);
                if (response.status) {
                    setIsLoading(false);
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 2000);
                    navigation.navigate('CheckPhone', { phone });
                } else {
                    setError(response.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
                }
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false); // Tắt loading sau khi xử lý xong (dù thành công hay thất bại)
            }
        };

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Tìm tài khoản</Text>
            <Text style={styles.label2}>Nhập số di dộng của bạn.</Text>

            <TextInput
                onChangeText={(text) => {
                    setPhone(text);
                    setError('');
                }}
                placeholderTextColor={'#8C96A2'}
                placeholder="Số di động"
                style={styles.inputDate}
                color={'#8C96A2'}
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable style={styles.button} onPress={handleCheckPhone}>
                <Text style={styles.buttonText}>Tiếp tục</Text>
            </Pressable>

            <View style={styles.containerButton}>
                <Pressable
                    style={styles.buttonNextSceen}
                    onPress={() => navigation.navigate('FindWithEmail')}>
                    <Text style={styles.buttonTextNextScreen}>Tìm kiếm bằng email</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
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
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        padding: height * 0.015,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
    },
    infoText: {
        fontSize: height * 0.018,
        color: 'black',
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
    containerButton: {
        width: width * 0.92,
    },
    linkText: {
        color: 'black',
        fontWeight: '500',
        fontSize: width * 0.04,
        marginTop: height * 0.01,
    },
    buttonNextSceen: {
        borderWidth: 1,
        borderColor: '#CED5DF',
        height: height * 0.06,
        width: width * 0.92,
        paddingVertical: height * 0.01,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTextNextScreen: {
        fontWeight: '500',
        fontSize: height * 0.02,
        color: 'black'
    }
});

export default FindWithPhone;
