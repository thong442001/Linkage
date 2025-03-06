// components/SearchItem.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const SearchItem = ({ user, onDelete }) => {
  return (
    <View style={styles.container}>
      <View style={styles.container_img_name}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>
          {user.first_name} {user.last_name}
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(user._id)}>
          <Icon name="close" size={20} color="#B3B3B3" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  container_img_name: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'medium',
  },
});

export default SearchItem;
