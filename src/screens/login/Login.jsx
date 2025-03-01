import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import styles from '../../styles/screens/login/LoginS';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../rtk/API';
import ButtonCreateNewAccount from '../../components/button/ButtonCreateNewAccount';
import { CustomTextInputEmail, CustomTextInputPassword } from '../../components/textinputs/CustomTextInput';
import LoadingModal from '../../utils/animation/loading/LoadingModal';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const fcmToken = useSelector(state => state.app.fcmToken);

  const [emailVsPhone, setEmailVsPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmailPhone, setErrorEmailPhone] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    return /^(84|0[3|5|7|8|9])[0-9]{8}$/.test(phone);
  }

  function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  }

  const validateForm = () => {
    let isValid = true;
    if (!emailVsPhone.trim()) {
      setErrorEmailPhone('Vui lòng nhập số điện thoại hoặc email.');
      isValid = false;
    } else if (!isValidEmail(emailVsPhone) && !isValidPhone(emailVsPhone)) {
      setErrorEmailPhone('Email hoặc số điện thoại không hợp lệ.');
      isValid = false;
    } else {
      setErrorEmailPhone('');
    }

    if (!password.trim()) {
      setErrorPassword('Vui lòng nhập mật khẩu.');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setErrorPassword('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setErrorPassword('');
    }
    return isValid;
  };

  const checkLogin = () => {
    if (!validateForm()) return;

    const data = isValidEmail(emailVsPhone)
      ? { email: emailVsPhone, phone: '', password: password, fcmToken: fcmToken }
      : { email: '', phone: emailVsPhone, password: password, fcmToken: fcmToken };

    onLogin(data);
  };

  const onLogin = (data) => {
    setLoading(true);
    dispatch(login(data))
      .unwrap()
      .then((response) => {
        console.log(response);
        setLoading(false);
      })
      .catch((error) => {
        setErrorPassword(error);
        setLoading(false);
      });
  };

  return (
    <View style={styles.container}>
      <LoadingModal visible={loading} />

      <View style={styles.viewLogo}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/Logo_app.png')}
        />
      </View>

      <View style={styles.formSectionLogin}>
        <View style={styles.formInput}>
          <CustomTextInputEmail
            placeholder="Số di động hoặc email"
            value={emailVsPhone}
            onChangeText={(text) => {
              setEmailVsPhone(text);
              setErrorEmailPhone('');
            }}
          />
          {errorEmailPhone ? <Text style={styles.errorText}>{errorEmailPhone}</Text> : null}

          <CustomTextInputPassword
            placeholder="Mật khẩu"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorPassword('');
            }}
          />
          {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={checkLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate('FindWithEmail')}>
          <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu ư?</Text>
        </Pressable>
      </View>

      <ButtonCreateNewAccount onPress={() => navigation.navigate('Screen1')} />
    </View>
  );
};

export default Login;
