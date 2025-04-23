import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { sendOTP_quenMatKhau_phone } from '../../rtk/API';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import SuccessModal from '../../utils/animation/success/SuccessModal';
const { width, height } = Dimensions.get('window');

const FindWithPhone = (props) => {
  const { navigation } = props;
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleCheckPhone = async () => {
    if (!phone.trim()) {
      setError('Vui lòng nhập số điện thoại.');
      setIsFailed(true);
      setTimeout(() => setIsFailed(false), 2000);
      return;
    }

    const phoneRegex = /^(?:\+84|84|0)(3[2-9]|5[5-9]|7[0|6-9]|8[1-9]|9[0-4|6-9])\d{7}$/;
    if (!phoneRegex.test(phone)) {
      setError('Số điện thoại không hợp lệ.');
      setIsFailed(true);
      setTimeout(() => setIsFailed(false), 2000);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // Gửi OTP và kiểm tra số điện thoại tồn tại
      console.log('Sending OTP for phone:', { phone });
      const otpResponse = await dispatch(sendOTP_quenMatKhau_phone({ phone })).unwrap();
      console.log('Response từ sendOTP_quenMatKhau_phone:', otpResponse);

      if (otpResponse.status) {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigation.navigate('CheckPhone', { phone });
        }, 2000);
      } else {
        setError(otpResponse.message || 'Số điện thoại chưa được đăng ký.');
        setIsFailed(true);
        setTimeout(() => setIsFailed(false), 2000);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      setIsFailed(true);
      setTimeout(() => setIsFailed(false), 2000);
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LoadingModal visible={isLoading} />
      <FailedModal visible={isFailed} message={error || 'Đã xảy ra lỗi!'} />
      <SuccessModal visible={isSuccess} message="Đã gửi OTP thành công!" />

      <Pressable onPress={() => navigation.navigate('FindWithEmail')}>
        <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
      </Pressable>

      <Text style={styles.label}>Tìm tài khoản</Text>
      <Text style={styles.label2}>Nhập số điện thoại của bạn.</Text>

      <TextInput
        onChangeText={(text) => {
          setPhone(text);
          setError('');
        }}
        placeholderTextColor={'#8C96A2'}
        placeholder="Số điện thoại"
        style={styles.inputDate}
        color={'#8C96A2'}
        keyboardType="phone-pad"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleCheckPhone}>
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </Pressable>

      <View style={styles.containerButton}>
        <Pressable
          style={styles.buttonNextSceen}
          onPress={() => navigation.navigate('FindWithEmail', setError(''))}
        >
          <Text style={styles.buttonTextNextScreen}>Tìm kiếm bằng email</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: '#f0f4ff',
  },
  iconBack: {
    marginVertical: height * 0.02,
  },
  label: {
    color: 'black',
    fontSize: height * 0.03,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  label2: {
    fontSize: height * 0.018,
    color: '#1C2931',
    fontWeight: '450',
    marginBottom: height * 0.02,
  },
  inputDate: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.03,
    padding: height * 0.015,
    backgroundColor: '#fff',
    marginVertical: height * 0.02,
  },
  errorText: {
    color: 'red',
    fontSize: height * 0.018,
    marginBottom: height * 0.015,
  },
  button: {
    marginVertical: height * 0.02,
    backgroundColor: '#0064E0',
    paddingVertical: height * 0.015,
    borderRadius: width * 0.05,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
  },
  containerButton: {
    width: width * 0.92,
  },
  buttonNextSceen: {
    borderWidth: 1,
    borderColor: '#CED5DF',
    height: height * 0.06,
    width: width * 0.92,
    paddingVertical: height * 0.01,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextNextScreen: {
    fontWeight: '500',
    fontSize: height * 0.02,
    color: 'black',
  },
});

export default FindWithPhone;