import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const ItemNotification = ({ data }) => {
  const me = useSelector(state => state.app.user);

  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (data.type == 'Lời mời kết bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setID_friend(data.ID_relationship.ID_userB._id)
        setName(data.ID_relationship.ID_userB.first_name
          + " " + data.ID_relationship.ID_userB.last_name);
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setID_friend(data.ID_relationship.ID_userA._id)
        setName(data.ID_relationship.ID_userA.first_name
          + " " + data.ID_relationship.ID_userA.last_name);
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    }

  }, []);

  return (
    <View style={styles.container}>
      {
        avatar && (
          <Image source={{ uri: avatar }} style={styles.img} />
        )
      }
      <View style={styles.container_content}>
        <View style={styles.container_name}>
          {/* <Text style={styles.text_name}>{data.senderName}</Text> */}
          <Text style={styles.text_content}>
            {data.content}
          </Text>
        </View>
        <Text style={styles.text_time}>{data.createdAt}</Text>
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
