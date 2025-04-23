import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import { Modal } from 'react-native-paper';

const NothingFriend = ({message}) => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <LottieView
                    source={require('./NoFriend.json')} 
                    autoPlay
                    loop
                    style={styles.animation} />
            </View>
            <Text style={styles.successMessage}>{message}</Text>
        </View>
    );
};

export default NothingFriend;

const styles = StyleSheet.create({
    successMessage: {
        fontSize: 16,
        color: 'black',
        fontWeight: 'bold'
    },
    container: {
        marginVertical: 20,
        justifyContent: 'center',  // Căn giữa theo chiều dọc
        alignItems: 'center',      // Căn giữa theo chiều ngang
    },
    animation: {
        width: 200,    // Đặt kích thước phù hợp cho animation
        height: 200,   // Đặt kích thước phù hợp cho animation
    },
});
