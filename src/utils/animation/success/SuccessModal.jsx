import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './SuccessModalStyle';

const SuccessModal = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <View style={styles.messageContainer}>
          <LottieView
            source={require('./success.json')} 
            autoPlay
            loop={false} 
            style={styles.successAnimation}
          />
          <Text style={styles.successMessage}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;