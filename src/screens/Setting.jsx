import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logoutTest } from '../rtk/Reducer';

const Setting = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();

  const onRegister = () => {
    dispatch(logoutTest())
  };
  return (
    <View>

      <Text>Setting</Text>

      <TouchableOpacity onPress={() => onRegister()}>
        <Text>Logout</Text>
      </TouchableOpacity>

    </View>
  );
};



export default Setting;
