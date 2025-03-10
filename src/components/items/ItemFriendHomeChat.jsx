import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { joinGroupPrivate } from '../../rtk/API';

const ItemFriendHomeChat = ({ item, navigation }) => {
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
    // console.log("Tạo phòng chat với:", user1, user2);
    try {
      const paramsAPI = {
        user1: user1,
        user2: user2,
      };
      await dispatch(joinGroupPrivate(paramsAPI))
        .unwrap()
        .then(response => {
        //   console.log("Nhóm chat riêng tư đã tạo:", response);
          navigation.navigate('Chat', { ID_group: response.ID_group });
        })
        .catch(error => {
          console.log('Lỗi khi tạo nhóm chat riêng:', error);
        });
    } catch (error) {
      console.log("Lỗi:", error);
    }
  };
  

  const onChat = async () => {
    if (!ID_friend) {
      console.log("Không tìm thấy ID_friend, không thể tạo nhóm chat.");
      return;
    }
    await getID_groupPrivate(me._id, ID_friend);
  };
  

  return (
    <TouchableOpacity onPress={onChat} style={styles.container}>
      {avatar && <Image style={styles.img} source={{ uri: avatar }} />}
      <Text style={styles.text}>{lastName}</Text>
    </TouchableOpacity>
  )
}



export default ItemFriendHomeChat;


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    marginLeft:10,
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 5, // Để tên nằm bên dưới avatar
    textAlign: 'center',
  }
});