import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Pressable,
  //ToastAndroid
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

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  const checkLogin = () => {
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
    if (emailVsPhone != '' && password != '') {
      dispatch(login(data))
        .unwrap()
        .then((response) => {
          console.log(response);
          //ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
        })
        .catch((error) => {
          console.error(error);
          //ToastAndroid.show('Email hoặc mật khẩu không chính xác', ToastAndroid.SHORT);
        });
    } else {
      console.log(" thiếu ");
    }
  }

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
            onChangeText={setEmailVsPhone}
          />
          <CustomTextInputPassword
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
          />
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
