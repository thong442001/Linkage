import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function FriendAddGroup({ item, onToggle, selectedUsers }) {

  const me = useSelector(state => state.app.user);
  const [ID_friend, setID_friend] = useState(null);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const isSelected = selectedUsers.includes(ID_friend);

  useEffect(() => {
    if (item.ID_userA._id == me._id) {
      setID_friend(item.ID_userB._id)
      setName(item.ID_userB.first_name
        + " " + item.ID_userB.last_name);
      setAvatar(item.ID_userB.avatar);
    } else {
      setID_friend(item.ID_userA._id)
      setName(item.ID_userA.first_name
        + " " + item.ID_userA.last_name);
      setAvatar(item.ID_userA.avatar);
    }


  }, []);



  return (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onToggle(ID_friend)}
    >

      {
        (name != null)
        && <Image source={{ uri: avatar }} style={styles.avatar} />
      }
      {/* view tên nhóm và tin nhắn mới nhất */}
      <View style={styles.vTxt}>
        {
          (avatar != null)
          && <View style={styles.chatInfo}>
            <Text style={styles.name}>{name}</Text>
          </View>
        }

      </View>
      {isSelected ? <Text>✔</Text> : <Text>○</Text>}

    </TouchableOpacity >
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black",
  },
  vTxt: {
    flexDirection: 'column',
    //backgroundColor: 'blue',
    flex: 1,
  },
  vMessageNew: {
    flexDirection: 'row',

  },
  messageName: {
    fontSize: 14,
    color: 'gray',
  },
  messageContent: {
    fontSize: 14,
    color: 'gray',
    flex: 1,
  },

});
