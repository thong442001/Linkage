import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {checkOTP_phone}from '../../rtk/API';
import { useDispatch } from 'react-redux';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
const { width, height } = Dimensions.get('window');

const OTPScreen = (props) => {
  const { navigation, route } = props;
  const { params } = route;
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
      if (/^[0-9]$/.test(text) || text === '') {
          const newOtp = [...otp];
          newOtp[index] = text;
          setOtp(newOtp);

          if (text && index < 3) {
              inputRefs.current[index + 1].focus();
          }
          if (!text && index > 0) {
              inputRefs.current[index - 1].focus();
          }
      }
  };

  const handleSubmit = async () => {
      const otpCode = otp.join('');
      if (otpCode.length !== 4) {
          setError('Vui lòng nhập đủ 4 số');
          return;
      }

      setError('');
      setIsLoading(true);

      try {
          const response = await dispatch(checkOTP_phone({
              phone: params.phone,
              otp: otpCode
          })).unwrap();

          if (response.status) {
              setIsLoading(false);
              setIsSuccess(true);
              setTimeout(() => {
                  setIsSuccess(false);
                  navigation.navigate('CreatePasswordScreen', {
                      first_name: params.first_name,
                      last_name: params.last_name,
                      dateOfBirth: params.dateOfBirth,
                      sex: params.sex,
                      phone: params.phone,
                      email: params.email,
                  });
                  setOtp(['', '', '', '']);
              }, 2000);
          } else {
              setIsLoading(false);
              setIsFailed(true);
              setError(response.message || 'Mã OTP không đúng');
              setTimeout(() => {
                  setIsFailed(false);
              }, 2000);
          }
      } catch (error) {
          setIsLoading(false);
          setIsFailed(true);
          setError('Mã OTP không hợp lệ.');
          console.log('Error checking OTP:', error);
          setTimeout(() => {
              setIsFailed(false);
          }, 2000);
      }
  };

  const handleClear = () => {
      setOtp(['', '', '', '']);
      setError('');
      inputRefs.current[0].focus();
  };



  return (
      <View style={styles.container}>
          <LoadingModal visible={isLoading} />
          <SuccessModal visible={isSuccess} message="Xác thực thành công!" />
          <FailedModal visible={isFailed} message={error || "Mã OTP không hợp lệ!"} />

          <Pressable
              style={styles.backButton}
              onPress={() => navigation.navigate('Screen2', params)}>
              <Icon name="angle-left" size={width * 0.08} color="black" />
          </Pressable>
          <Text style={styles.title}>Nhập mã OTP</Text>
          <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                  <TextInput
                      key={index}
                      style={[styles.otpInput, error && { borderColor: 'red' }]}
                      value={digit}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      keyboardType="numeric"
                      maxLength={1}
                      ref={(ref) => (inputRefs.current[index] = ref)}
                      color="#333"
                      editable={!isLoading}
                  />
              ))}
          </View>
          <Text style={styles.instruction}>
              Vui lòng nhập mã OTP gồm 4 số được gửi đến số điện thoại của bạn.
          </Text>
          {error ? (
              <View style={styles.errorContainer}>
                  <Icon name="exclamation-circle" size={width * 0.04} color="red" style={styles.errorIcon} />
                  <Text style={styles.errorText}>{error}</Text>
              </View>
          ) : null}
          <View style={styles.buttonContainer}>
              <TouchableOpacity
                  style={[styles.submitButton, isLoading && { opacity: 0.6 }]}
                  onPress={handleSubmit}
                  disabled={isLoading}
              >
                  <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.clearButton, isLoading && { opacity: 0.6 }]}
                  onPress={handleClear}
                  disabled={isLoading}
              >
                  <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
          </View>
      </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
    errorText:{
        color: 'red',
        fontSize: width * 0.04,
        marginTop: 5,
    },
  resendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 5,
},
errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
},
errorIcon: {
    marginRight: 8,
},
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05, 
    left: width * 0.05, 
  },
  title: {
    fontSize: width * 0.06, 
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: height * 0.15,
    marginBottom: height * 0.03,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.6, 
    alignSelf: 'center',
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: width * 0.05,
    backgroundColor: '#fff',
    marginHorizontal: width * 0.015,
  },
  instruction: {
    marginTop: height * 0.03,
    fontSize: width * 0.04,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: width * 0.05,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 0.6, 
    marginTop: height * 0.03,
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#0064E0',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});