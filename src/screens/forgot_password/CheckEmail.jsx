import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const { width, height } = Dimensions.get('window');

const CheckEmail = (props) => {
    const { navigation } = props;

    const [code, setCode] = useState('')

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.goBack()}>
                <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
            </Pressable>

            <Text style={styles.label}>Kiểm tra Email</Text>
            <Text style={styles.label2}>Chúng tôi đã gửi mã đến email của bạn. Hãy nhập
                mã đó để xác nhận tài khoản.</Text>

            <TextInput
                onChangeText={'black'}
                placeholderTextColor={'#8C96A2'}
                placeholder="Nhập mã"
                style={styles.inputDate}
            />

            <View>
                <Text style={styles.infoText}>Có thể bạn cần chờ đợi vài phút để nhận được mã
                    này. <Text style={styles.newCode} >Lấy mã mới</Text>
                </Text>
            </View>
            <Pressable style={styles.button} onPress={() => navigation.navigate('CreateNewPassWord')}>
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
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.03,
        padding: height * 0.015,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
    },
    infoText: {
        fontSize: height * 0.019,
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
    },
    newCode: {
        color: '#0064E0',
        fontWeight: '450',
    }
});

export default CheckEmail;
