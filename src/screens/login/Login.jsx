import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable
} from 'react-native';
import styles from '../../styles/screens/login/LoginS';
import { useDispatch } from 'react-redux';
import { login } from '../../rtk/API';

import ButtonCreateNewAccount
  from '../../components/button/ButtonCreateNewAccount';
import {
  CustomTextInputEmail,
  CustomTextInputPassword
} from '../../components/textinputs/CustomTextInput';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const [emailVsPhone, setEmailVsPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmailPhone, setErrorEmailPhone] = useState('');
  const [errorPassword, setErrorPassword] = useState('');

  function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  function isValidPhone(phone) {
    return /^(84|0[3|5|7|8|9])[0-9]{8}$/.test(phone);
  }

  function isValidPassword(password) {
    // Kiểm tra mật khẩu chỉ chứa chữ cái và số, không chứa ký tự đặc biệt
    return /^[A-Za-z0-9]{8,}$/.test(password);
  }

  const validateForm = () => {
    let isValid = true;

    // Kiểm tra email hoặc số điện thoại
    if (!emailVsPhone.trim()) {
      setErrorEmailPhone('Vui lòng nhập số điện thoại hoặc email.');
      isValid = false;
    } else if (!isValidEmail(emailVsPhone) && !isValidPhone(emailVsPhone)) {
      setErrorEmailPhone('Email hoặc số điện thoại không hợp lệ.');
      isValid = false;
    } else {
      setErrorEmailPhone('');
    }

    // Kiểm tra mật khẩu
    if (!password.trim()) {
      setErrorPassword('Vui lòng nhập mật khẩu.');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setErrorPassword('Mật khẩu phải có ít nhất 8 ký tự và không chứa ký tự đặc biệt.');
      isValid = false;
    } else {
      setErrorPassword('');
    }

    return isValid;
  };

  const checkLogin = () => {
    if (!validateForm()) {
      return;
    }

    const checkEmail = isValidEmail(emailVsPhone);
    if (checkEmail) {
      const dataEmail = {
        email: emailVsPhone,
        phone: '',
        password: password,
      };
      onLogin(dataEmail);
    } else {
      const dataPhone = {
        email: '',
        phone: emailVsPhone,
        password: password,
      };
      onLogin(dataPhone);
    }
  };

  const onLogin = (data) => {
    dispatch(login(data))
      .unwrap()
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        setErrorPassword(error)
      });
  };

  return (
    <View style={styles.container}>
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
