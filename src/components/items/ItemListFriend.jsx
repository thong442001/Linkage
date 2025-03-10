import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'

const ItemListFriend = (props) => {
  const { item, _id } = props;
  const [ID_friend, setID_friend] = useState(null);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (item.ID_userA._id === _id) {
      setID_friend(item.ID_userB._id);
      setName(`${item.ID_userB.first_name} ${item.ID_userB.last_name}`);
      setAvatar(item.ID_userB.avatar);
    } else {  
      setID_friend(item.ID_userA._id);
      setName(`${item.ID_userA.first_name} ${item.ID_userA.last_name}`);
      setAvatar(item.ID_userA.avatar);
    }
  }, [item, _id]);
  return (
    <View style={styles.container}>
      {
        avatar &&
        <Image style={styles.img} source={{ uri: avatar }} />
      }

      <Text style={styles.text}>{name}</Text>
    </View>
  )
}

export default ItemListFriend

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10
  },
  img: {
    width: 61,
    height: 61,
    borderRadius: 50,
  },
  text: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10
  }
})