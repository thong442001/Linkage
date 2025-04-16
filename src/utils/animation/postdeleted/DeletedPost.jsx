import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const DeletedPost = ({ visible, message, onClose }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <LottieView
            source={require('./deletedpost.json')}
            autoPlay
            loop
            style={styles.successAnimation}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    alignItems: 'center',
  },
  successAnimation: {
    width: 150,
    height: 150,
  },
  successMessage: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
});

export default DeletedPost;