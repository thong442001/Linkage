import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

const NothingHome = () => {
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                <LottieView
                    source={require('./ghost.json')} 
                    autoPlay
                    loop
                    style={styles.animation} />
                <Text style={styles.successMessage}>Nothing</Text>
            </View>
        </View>
    );
};

export default NothingHome;

const styles = StyleSheet.create({
    successMessage: {
        fontSize: 18,
        color: 'black',
        fontWeight: 'bold'
    },
    container: {
        marginVertical: 25,
        justifyContent: 'center',  // Căn giữa theo chiều dọc
        alignItems: 'center',      // Căn giữa theo chiều ngang
    },
    animation: {
        width: 200,    // Đặt kích thước phù hợp cho animation
        height: 200,   // Đặt kích thước phù hợp cho animation
    },
});
