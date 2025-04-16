import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const NoAccessModal = ({ visible, message, onClose }) => {
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
            source={require('./no_access.json')}
            autoPlay
            loop
            style={styles.successAnimation}
            onError={(error) => console.log('Lottie error:', error)} // Debug lỗi Lottie
          />
          <Text style={styles.successMessage}>Bạn không có quyền truy cập vào bài viết</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
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

export default NoAccessModal;