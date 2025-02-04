import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, Dimensions, ToastAndroid } from 'react-native';
import styles from '../styles/LoginS';
import { useDispatch } from 'react-redux';
import { login } from '../rtk/API';

import ButtonCreateNewAccount from '../styles/custom/button/ButtonCreateNewAccount';
import { CustomTextInputEmail, CustomTextInputPassword } from '../custom/CustomTextInput';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = () => {
    const data = { email, password };
    dispatch(login(data))
      .unwrap()
      .then(() => {
        ToastAndroid.show('Đăng nhập thành công', ToastAndroid.SHORT);
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show('Email hoặc mật khẩu không chính xác', ToastAndroid.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.viewLogo}>
        <Image
          style={styles.logo}
          source={require('../../assets/images/Logo_app.png')}
        />
      </View>
      

      <View style={styles.formSectionLogin}>
      <View style={styles.formInput}>
        <CustomTextInputEmail
          placeholder="Số di động hoặc email"
          value={email}
          onChangeText={setEmail}
        />
        <CustomTextInputPassword
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>
      <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu ư?</Text>
      </View>
      <ButtonCreateNewAccount onPress={() => navigation.navigate('Screen1')} />
    </View>
  );
};

export default Login;
