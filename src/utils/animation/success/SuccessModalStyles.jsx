import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm mờ nền
  },
  successAnimation: {
    width: 150,
    height: 150,
  },
  successMessage: {
    marginTop: 20,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Inter-Italic-VariableFont_opsz,wght',  
  },
});

export default styles;
