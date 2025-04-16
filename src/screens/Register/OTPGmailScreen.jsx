import { StyleSheet, Text, View, Pressable, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { checkOTP_gmail, sendOTP_dangKi_gmail } from '../../rtk/API';
import { useDispatch } from 'react-redux';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import SendOTPSuccessModal from '../../utils/animation/success/SuccessModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import { OtpInput } from 'react-native-otp-entry';

const { width, height } = Dimensions.get('window');

const OTPGmailScreen = (props) => {
  const { navigation, route } = props;
  const { params } = route;
  const dispatch = useDispatch();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(30); // Bộ đếm ngược 30 giây
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Trạng thái vô hiệu hóa nút

  // Bộ đếm ngược cho nút "Lấy mã mới"
  useEffect(() => {
    let timer;
    if (resendCooldown > 0 && isResendDisabled) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false); // Kích hoạt lại nút
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer); // Dọn dẹp khi component unmount
  }, [resendCooldown, isResendDisabled]);

  // Reset OTP khi màn hình được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setOtp('');
      setError('');
    });
    return unsubscribe;
  }, [navigation]);

  const handleSubmit = async (otpCode) => {
    console.log('OTP submitted:', otpCode);
    if (!otpCode || otpCode.length !== 4) {
      setError('Vui lòng nhập đủ 4 số');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const response = await dispatch(
        checkOTP_gmail({
          gmail: params.email,
          otp: otpCode,
        })
      ).unwrap();

      if (response.status) {
        console.log('Response từ checkOTP_gmail:', response);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigation.replace('CreatePasswordScreen', {
            first_name: params.first_name,
            last_name: params.last_name,
            dateOfBirth: params.dateOfBirth,
            sex: params.sex,
            phone: null,
            email: params.email,
          });
          setOtp('');
        }, 2000);
      } else {
        setError(response.message || 'Mã OTP không đúng');
        setIsLoading(false);
        setOtp('');
      }
    } catch (error) {
      console.log('Error checking OTP:', error);
      setError('Mã OTP không hợp lệ.');
      setIsLoading(false);
      setOtp('');
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý khi nhấn "Lấy mã mới"
  const handleResendOTP = () => {
    if (isResendDisabled) return;

    setIsLoading(true);
    setError('');
    dispatch(sendOTP_dangKi_gmail({ gmail: params.email }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setIsSendSuccess(true);
          setTimeout(() => {
            setIsSendSuccess(false);
            setResendCooldown(30); // Reset bộ đếm ngược
            setIsResendDisabled(true); // Vô hiệu hóa lại nút
            setOtp(''); // Xóa OTP cũ
          }, 2000);
        } else {
          setError(response.message || 'Không thể gửi OTP mới');
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log('Error resending OTP:', error);
        setError('Không thể gửi OTP mới. Vui lòng thử lại.');
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <SuccessModal visible={isSuccess} message="Xác thực OTP thành công!" />
      <SendOTPSuccessModal  visible={isSendSuccess} message={"Mã OTP đã được gửi lại"}/>
      <LoadingModal visible={isLoading} />
      <Pressable onPress={() => navigation.navigate('Screen3', params)}>
        <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
      </Pressable>

      <Text style={styles.label}>Kiểm tra Email</Text>
      <Text style={styles.label2}>
        Chúng tôi đã gửi 1 mã xác minh gồm 4 số đến email{' '}
        <Text style={styles.emailText}>{params.email}</Text>, Hãy nhập mã đó để xác nhận tài khoản.
      </Text>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <OtpInput
          numberOfDigits={4}
          type="numeric"
          autoFocus={true}
          focusColor="#0064E0"
          placeholder="0"
          value={otp}
          onTextChange={(text) => {
            setOtp(text);
            setError('');
          }}
          onFilled={(text) => {
            setOtp(text);
            handleSubmit(text);
          }}
          theme={{
            containerStyle: styles.otpContainer,
            pinCodeContainerStyle: styles.otpInput,
            pinCodeTextStyle: styles.otpText,
            placeholderTextStyle: styles.placeholderText,
            focusedPinCodeContainerStyle: styles.focusedInput,
            filledPinCodeContainerStyle: {
              backgroundColor: '#e6f0ff',
            },
          }}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <View>
        <Text style={styles.infoText}>
          Có thể bạn cần chờ vài phút để nhận mã này.{' '}
          <Text
            style={[styles.newCode, isResendDisabled && styles.disabledText]}
            onPress={handleResendOTP}
          >
            {isResendDisabled ? `Gửi lại sau ${resendCooldown}s` : 'Lấy mã mới'}
          </Text>
        </Text>
      </View>

      <Pressable
        style={[styles.button, isLoading && { opacity: 0.6 }]}
        onPress={() => handleSubmit(otp)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Tiếp tục</Text>
      </Pressable>
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
  emailText: {
    fontWeight: 'bold',
    color: '#0064E0',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: width * 0.04,
    marginVertical: height * 0.02,
  },
  otpInput: {
    width: width * 0.12,
    height: width * 0.12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: width * 0.03,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  otpText: {
    fontSize: height * 0.025,
    color: 'black',
  },
  placeholderText: {
    fontSize: height * 0.025,
    color: '#999',
  },
  focusedInput: {
    borderColor: '#0064E0',
    borderWidth: 2,
  },
  errorText: {
    color: 'red',
    fontSize: height * 0.018,
    fontWeight: '500',
    marginBottom: height * 0.015,
  },
  infoText: {
    fontSize: height * 0.019,
    color: 'black',
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
  newCode: {
    color: '#0064E0',
    fontWeight: '450',
  },
  disabledText: {
    color: '#A0A0A0', // Màu xám khi vô hiệu hóa
  },
});

export default OTPGmailScreen;