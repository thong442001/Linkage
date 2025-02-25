import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './SuccessModalStyles';

const SuccessModal = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <LottieView
          source={require('./success.json')} // Đường dẫn tới file Lottie animation
          autoPlay
          loop={false} // Không lặp lại, chỉ chạy một lần
          style={styles.successAnimation}
        />
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </Modal>
  );
};

export default SuccessModal;
