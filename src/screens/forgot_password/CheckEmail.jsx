import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux';
import { checkOTP_gmail, sendOTP_quenMatKhau_gmail } from '../../rtk/API';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import { OtpInput } from 'react-native-otp-entry';

const { width, height } = Dimensions.get('window');

const CheckEmail = (props) => {
  const { navigation, route } = props;
  const { gmail } = route.params;
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSendSuccess, setIsSendSuccess] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const dispatch = useDispatch();

  // Bộ đếm ngược cho nút "Lấy mã mới"
  useEffect(() => {
    let timer;
    if (resendCooldown > 0 && isResendDisabled) {
      timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown, isResendDisabled]);


  const handleCheckOTP = async () => {
    if (!code.trim() || code.length !== 4) {
      setError('Vui lòng nhập đủ 4 số');
      return;
    }

    setError('');
    try {
      setIsLoading(true);
      const response = await dispatch(checkOTP_gmail({ gmail, otp: code })).unwrap();
      console.log('Response từ checkOTP_gmail:', response);

      if (response.status) {
        setIsLoading(false);
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          navigation.navigate('CreateNewPassWord', {
            gmail: gmail,
          });
        }, 2000);
      } else {
        setIsLoading(false);
        setError(response.message || 'Mã OTP không đúng. Vui lòng thử lại.');
        setCode('');
        setIsFailed(true);
        setTimeout(() => {
          setIsFailed(false);
        }, 2000);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('Lỗi khi kiểm tra OTP:', error);
      setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      setCode('');
      setIsFailed(true);
      setTimeout(() => {
        setIsFailed(false);
      }, 2000);
    }
  };

  // Hàm xử lý khi nhấn "Lấy mã mới"
  const handleResendOTP = () => {
    if (isResendDisabled) return;

    setIsLoading(true);
    setError('');
    dispatch(sendOTP_quenMatKhau_gmail({ gmail }))
      .unwrap()
      .then((response) => {
        if (response.status) {
          setIsSendSuccess(true);
          setTimeout(() => {
            setIsSendSuccess(false);
            setResendCooldown(30);
            setIsResendDisabled(true);
            setCode('');
          }, 2000);
        } else {
          setError(response.message || 'Không thể gửi OTP mới');
          setIsFailed(true);
          setTimeout(() => {
            setIsFailed(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log('Error resending OTP:', error);
        setError('Không thể gửi OTP mới. Vui lòng thử lại.');
        setIsFailed(true);
        setTimeout(() => {
          setIsFailed(false);
        }, 2000);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <LoadingModal visible={isLoading} />
      <SuccessModal visible={isSuccess} message="Xác thực OTP thành công!" />
      <SuccessModal visible={isSendSuccess} message="Mã OTP đã được gửi lại!" />
      <FailedModal visible={isFailed} message={error || 'Không thể gửi OTP mới!'} />

      <Pressable onPress={() => navigation.navigate('FindWithEmail')}>
        <Icon style={styles.iconBack} name="angle-left" size={width * 0.08} color="black" />
      </Pressable>

      <Text style={styles.label}>Kiểm tra Email</Text>
      <Text style={styles.label2}>
        Chúng tôi đã gửi 1 mã xác nhận gồm 4 số đến email{' '}
        <Text style={styles.emailText}>{gmail}</Text>. Mã này dùng để đặt lại mật khẩu mới cho tài khoản của bạn.
      </Text>

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <OtpInput
          numberOfDigits={4}
          type="numeric"
          autoFocus={true}
          focusColor="#0064E0"
          placeholder="0"
          value={code}
          onTextChange={(text) => {
            setCode(text);
            setError('');
          }}
          onFilled={(text) => {
            setCode(text);
            handleCheckOTP();
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
          Có thể bạn cần chờ vài phút để nhận được mã này.{' '}
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
        onPress={handleCheckOTP}
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

export default CheckEmail;