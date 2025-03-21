import React from 'react';
import { Modal, View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import styles from './BinModalStyle';

const BinModal = ({ visible, message }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.modalBackground}>
        <LottieView
          source={require('./bin.json')} 
          autoPlay
          loop
          style={styles.successAnimation}
        />
        <Text style={styles.successMessage}>{message}</Text>
      </View>
    </Modal>
  );
};

export default BinModal;
