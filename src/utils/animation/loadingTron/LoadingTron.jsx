import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './LoadingTronStyle';

const LoadingTron = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <LottieView
          source={require('./loadingTron.json')} // Đường dẫn tới file Lottie animation
          autoPlay
          loop // Không lặp lại, chỉ chạy một lần
          style={styles.successAnimation}
        />
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </Modal>
  );
};

export default LoadingTron;
