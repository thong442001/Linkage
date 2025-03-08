import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const ItemNotification = ({data}) => {
  const me = useSelector(state => state.app.user);
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const date = new Date(data.createdAt);
  const formattedDate = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  useEffect(() => {
    if (data.type == 'Lời mời kết bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
            ' ' +
            data.ID_relationship.ID_userB.last_name
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    } else if (data.type == 'Đã thành bạn bè của bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
            ' ' +
            data.ID_relationship.ID_userB.last_name
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    }
  }, []);


  // Xác định màn hình cần chuyển đến dựa vào loại thông báo
  const navigateToScreen = () => {
    if (data.type === 'Lời mời kết bạn') {
      navigation.navigate('Friend', { userId: me._id });
    } else if (data.type === 'Đã thành bạn bè của bạn') {
      navigation.navigate('Profile', { _id: data.ID_relationship.ID_userB});
    } else if (data.type === 'Bài viết mới') {
      navigation.navigate('PostDetailScreen', { postId: data.postId });
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen} >
    <View style={styles.container}>
      {avatar && <Image source={{uri: avatar}} style={styles.img} />}
      <View style={styles.container_content}>
        <View style={styles.container_name}>
          <Text style={styles.text_name}>{name}</Text>
          <Text style={styles.text_content}>{data.type ?? "Bạn có thông báo mới"}</Text>
        </View>
        <Text style={styles.text_time}>{formattedDate}</Text>
      </View>
    </View>
    </TouchableOpacity>
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
    flexDirection: 'column',
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
