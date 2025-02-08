import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const ItemFriend = props => {

  const { data, me, onXacNhan, onXoa } = props;

  return (
    <View style={styles.container}>
      {
        data.ID_userA == me
          ? <Image style={styles.img} source={{ uri: data.ID_userA.avatar }} />
          : <Image style={styles.img} source={{ uri: data.ID_userB.avatar }} />
      }
      <View>
        {
          data.ID_userA == me
            ? <Text style={styles.text}>
              {data.ID_userA.first_name} {data.ID_userA.last_name}
            </Text>
            : <Text style={styles.text}>
              {data.ID_userB.first_name} {data.ID_userB.last_name}
            </Text>
        }
        <View style={styles.container_button}>
          <TouchableOpacity
            style={styles.button1}
            onPress={() => onXacNhan(data._id)}
          >
            <Text style={styles.text_button}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button2}
            onPress={() => onXoa(data._id)}
          >
            <Text style={styles.text_button}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ItemFriend;

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
