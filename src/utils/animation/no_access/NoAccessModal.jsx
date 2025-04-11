import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './NoAccessModalStyle'; 

const NoAccessModal = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <LottieView
          source={require('./no_access.json')} 
          autoPlay
          loop
          style={styles.successAnimation}
        />
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </Modal>
  );
};

export default NoAccessModal;
