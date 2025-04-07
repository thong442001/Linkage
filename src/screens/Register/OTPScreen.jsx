import { StyleSheet, Text, View, TextInput, TouchableOpacity, Pressable, Dimensions } from 'react-native';
import React, { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const OTPScreen = (props) => {
    const { navigation, route } = props;
    const { params } = route;
  // State để lưu giá trị của từng ô OTP (4 ô)
  const [otp, setOtp] = useState(['', '', '', '']);
  // Ref để di chuyển focus giữa các ô
  const inputRefs = useRef([]);

  // Hàm xử lý khi nhập giá trị vào ô
  const handleOtpChange = (text, index) => {
    if (/^[0-9]$/.test(text) || text === '') { // Chỉ cho phép số hoặc rỗng
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Tự động chuyển focus sang ô tiếp theo nếu nhập xong
      if (text && index < 3) {
        inputRefs.current[index + 1].focus();
      }
      // Chuyển về ô trước nếu xóa
      if (!text && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // Hàm kiểm tra khi nhấn nút Xác nhận
  const handleSubmit = () => {
    const otpCode = otp.join('');
    if (otpCode.length === 4) {
      console.log('Mã OTP:', otpCode);
      // Thực hiện logic xác minh OTP ở đây
    } else {
      console.log('Vui lòng nhập đủ 4 số');
    }
  };

  // Hàm xóa toàn bộ giá trị trong các ô
  const handleClear = () => {
    setOtp(['', '', '', '']);
    inputRefs.current[0].focus(); // Đưa focus về ô đầu tiên
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.navigate('Screen2', params)} 
      >
        <Icon name="angle-left" size={width * 0.08} color="black" />
      </Pressable>
      <Text style={styles.title}>Nhập mã OTP</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleOtpChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            color="#333"
          />
        ))}
      </View>
      <Text style={styles.instruction}>
        Vui lòng nhập mã OTP gồm 4 số được gửi đến số điện thoại của bạn.
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.buttonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
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