import React from 'react';
import { Dimensions, Text, TouchableOpacity, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const ButtonCreateNewAccount = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Tạo tài khoản mới</Text>
      </TouchableOpacity>
      <Text style={{ color: 'black', fontWeight: '500' }}>Linkage</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: height * 0.03,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    borderWidth: 1,
    borderColor: '#1976D2',
    height: height * 0.06,
    width: width * 0.9,
    backgroundColor: '#ffffff',
    paddingVertical: height * 0.01,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  buttonText: {
    color: '#1976D2',
    fontSize: 16,
  },
});

export default ButtonCreateNewAccount;
