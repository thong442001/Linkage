import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { joinGroupPrivate } from '../../rtk/API';
///jahahahah
const { width, height } = Dimensions.get('window');

const ItemFriendHomeChat = ({ item, navigation, isOnline }) => {
  const [ID_friend, setID_friend] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const me = useSelector(state => state.app.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (item.ID_userA._id === me._id) {
      setID_friend(item.ID_userB._id);
      setLastName(item.ID_userB.last_name);
      setAvatar(item.ID_userB.avatar);
    } else {
      setID_friend(item.ID_userA._id);
      setLastName(item.ID_userA.last_name);
      setAvatar(item.ID_userA.avatar);
    }
  }, [me, item]);

  const getID_groupPrivate = async (user1, user2) => {
    try {
      const paramsAPI = { user1, user2 };
      await dispatch(joinGroupPrivate(paramsAPI))
        .unwrap()
        .then(response => {
          navigation.navigate('Chat', { ID_group: response.ID_group });
        })
        .catch(error => {
          console.log('Lỗi khi tạo nhóm chat riêng:', error);
        });
    } catch (error) {
      console.log('Lỗi:', error);
    }
  };

  const onChat = async () => {
    if (!ID_friend) {
      console.log('Không tìm thấy ID_friend, không thể tạo nhóm chat.');
      return;
    }
    await getID_groupPrivate(me._id, ID_friend);
  };

  return (
    <TouchableOpacity onPress={onChat} style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image style={styles.img} source={{ uri: avatar }} />
        ) : (
          <View style={styles.placeholderAvatar} /> // Placeholder nếu avatar chưa sẵn sàng
        )}
        {isOnline && avatar && <View style={styles.onlineIndicator} />}
      </View>
      <Text style={styles.text}>{lastName || 'Đang tải...'}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: height * 0.01,
    marginHorizontal: width * 0.01,
  },
  avatarContainer: {
    position: 'relative',
  },
  img: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  placeholderAvatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    backgroundColor: '#ddd',
  },
  text: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: 'black',
    marginTop: height * 0.01,
    textAlign: 'center',
  },
  onlineIndicator: {
    width: width * 0.05,
    height: width * 0.05,
    backgroundColor: 'green',
    borderRadius: width * 0.025,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderColor: '#e3e3e3',
    borderWidth: width * 0.006,
  },
});

export default ItemFriendHomeChat;