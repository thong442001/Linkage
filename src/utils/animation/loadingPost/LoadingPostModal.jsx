import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './LoadingPostStyles';

const LoadingPostModal = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <LottieView
          source={require('./loading.json')} 
          autoPlay
          loop
          style={styles.successAnimation}
        />
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </Modal>
  );
};

export default LoadingPostModal;
