import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.05,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ECF5FA',
  },
  viewLogo: {
    width: width * 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.1,
  },
  logo: {
    resizeMode: 'contain',
    width: 83,
    height: 83,
  },
  formInput: {
    marginBottom: height * 0.02,
  },
  loginButton: {
    height: height * 0.06,
    width: width * 0.9,
    backgroundColor: '#1976D2',
    paddingVertical: height * 0.01,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.01,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: width * 0.040,
    fontWeight: '500',
  },
  forgotPasswordText: {
    alignSelf: 'center',
    color: 'black',
    fontWeight: '600',
    fontSize: width * 0.04,
    marginBottom: height * 0.02,
  },
  formSectionLogin: {
    marginBottom: height * 0.25,
  }
});


export default styles;