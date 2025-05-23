import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function GroupcomponentShare({ item }) {
  const me = useSelector(state => state.app.user);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);


  useEffect(() => {
    if (item.isPrivate == true) {
      const otherUser = item.members.find(user => user._id !== me._id);
      if (otherUser) {
        setAvatar(otherUser.avatar);
      } else {
        console.log('⚠️ Không tìm thấy thành viên khác trong nhóm!');
      }

      if (item.name == null) {
        if (otherUser) {
          setName(`${otherUser.first_name} ${otherUser.last_name}`);
        } else {
          console.log('⚠️ Không tìm thấy thành viên khác trong nhóm!');
        }
      } else {
        setName(item.name);
      }
    } else {
      if (item.avatar == null) {
        setAvatar(
          'https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Anlene%2Flogo.png?alt=media&token=f98a4e03-1a8e-4a78-8d0e-c952b7cf94b4',
        );
      } else {
        setAvatar(item.avatar);
      }
      if (item.name == null) {
        const names = item.members
          .filter(user => user._id !== me._id)
          .map(user => `${user.first_name} ${user.last_name}`)
          .join(', ');
        setName(names);
      } else {
        setName(item.name);
      }
    }
  }, [item, me._id]);


  return (
    <View style={styles.contactItem}>
      <Image source={{ uri: avatar }} style={styles.contactAvatar} />
      <Text numberOfLines={1} style={styles.contactName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    alignItems: 'center',
    marginRight: 15,
    maxWidth: 80
  },
  contactAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  contactName: {
    color: 'black',
    fontSize: 12,
    textAlign: 'center',
  },
});