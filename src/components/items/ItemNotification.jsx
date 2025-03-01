import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const ItemNotification = ({ data }) => {
  return (
    <View style={styles.container}>
      <Image source={{ uri: data.avatar }} style={styles.img} />
      <View style={styles.container_content}>
        <View style={styles.container_name}>
          <Text style={styles.text_name}>{data.senderName}</Text>
          <Text style={styles.text_content}>
            {data.type === 'friend_request' ? ' đã gửi lời mời kết bạn' : data.content}
          </Text>
        </View>
        <Text style={styles.text_time}>{data.timestamp}</Text>
      </View>
    </View>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 13,
  },
  img: {
    width: 68,
    height: 68,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  container_name: {
    flexDirection: 'row',
  },
  text_content: {
    marginLeft: 2,
    fontSize: 16,
    fontWeight: '400', // "medium" không hợp lệ, dùng "400" tương đương
    color: 'black',
  },
  text_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container_content: {
    marginLeft: 13,
  },
  text_time: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
  },
});
