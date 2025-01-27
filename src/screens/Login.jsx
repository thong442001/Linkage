import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginTest } from '../rtk/Reducer';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const onRegister = () => {
    dispatch(loginTest())
  };

  return (
    <View>

      <Text>Login</Text>

      <TouchableOpacity onPress={() => navigation.goback()}>
        <Text>Welcome</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRegister()}>
        <Text>Home</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Login;
