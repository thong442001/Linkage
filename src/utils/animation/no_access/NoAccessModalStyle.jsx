import { Dimensions, StyleSheet } from 'react-native';
const {width, height} = Dimensions.get('window');
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successAnimation: {
    width: width * 0.5,
    height: height * 0.3,
  },
  successMessage:{
    color: 'black',
    fontSize: width * 0.04,
    fontWeight: 'bold',
    
  }
});

export default styles;
