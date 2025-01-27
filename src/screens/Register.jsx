import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginTest } from '../rtk/Reducer';

const Register = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const onRegister = () => {
    dispatch(loginTest())
  };

  return (
    <View>

      <Text>Register</Text>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Welcome</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onRegister()}>
        <Text>Home</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Register;
