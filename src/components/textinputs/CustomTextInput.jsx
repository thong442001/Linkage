import React from 'react';
import { View, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUser, faRedo } from '@fortawesome/free-solid-svg-icons';
import inputStyles from '../../styles/components/textinputs/TextInputS';
import searchStyles from '../../styles/components/textinputs/TextInputSearchS';

export const CustomTextInputUserName = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={inputStyles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#64676c'}
        onChangeText={onChangeText}
        style={inputStyles.input}
        value={value}
        keyboardType="email-address"
      />
    </View>
  );
};

export const CustomTextInputEmail = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={inputStyles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#8C96A2'}
        onChangeText={onChangeText}
        style={inputStyles.input}
        value={value}
        keyboardType="email-address"
      />
    </View>
  );
};

export const CustomTextInputPassword = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={inputStyles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#8C96A2'}
        onChangeText={onChangeText}
        style={inputStyles.input}
        value={value}
        secureTextEntry
      />
    </View>
  );
};

export const CustomTextInputRePassword = ({ placeholder, onChangeText, value }) => {
  return (
    <View style={inputStyles.inputContainer}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'#64676c'}
        onChangeText={onChangeText}
        style={inputStyles.input}
        value={value}
        secureTextEntry
      />
    </View>
  );
};

export const CustomTextInputSearch = ({ placeholder, onChangeText, value, placeholderTextColor }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
      {/* <Icon name="arrow-back-outline" size={30} color="black" style={{ marginRight: 5 }} /> */}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={searchStyles.input}
        placeholderTextColor={placeholderTextColor}
      />
    </View>

  );
};
