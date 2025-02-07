import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const ItemNewFriend = props => {
  const { data } = props;
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: data.img }} />
      <View>
        <Text style={styles.text}>{data.name}</Text>
        <View style={styles.container_button}>
          <TouchableOpacity style={styles.button1}>
            <Text style={styles.text_button}>Thêm bạn bè</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button2}>
            <Text style={styles.text_button}>Gỡ</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemNewFriend;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  img: {
    width: 61,
    height: 61,
    borderRadius: 50,
    marginRight: 3,
  },
  text: {
    color: 'black',
    fontSize: 16,
  },
  button1: {
    width: 150,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0064E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  button2: {
    width: 150,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#A6A6A6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text_button: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  container_button: {
    flexDirection: 'row',
    marginTop: 4,
  },
});
