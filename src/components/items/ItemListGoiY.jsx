import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';

const ItemListGoiY = memo(({ item, _id, onThemBanBe }) => {
  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: item.user.avatar }} />
      <View style={{ flex: 1, paddingHorizontal: 10, gap: 3 }}>
        <Text style={styles.text}>
          {item.user.first_name} {item.user.last_name}
        </Text>
        <Text style={styles.text_goi_y}>{item.mutualFriendCount} bạn chung</Text>
        <TouchableOpacity style={styles.button1} onPress={() => onThemBanBe(item.user._id)}>
          <Text style={styles.text_button}>Thêm bạn bè</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

export default ItemListGoiY;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  img: {
    top: 5,
    width: 61,
    height: 61,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5,
  },
  button1: {
    width: '100%',
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0064E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  text_button: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  text_goi_y: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 5,
  },
});