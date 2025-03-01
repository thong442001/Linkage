import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
export default function FriendAdd({ item, onToggle, selectedUsers, membersGroup }) {
  const me = useSelector(state => state.app.user);
  const [ID_friend, setID_friend] = useState(null);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (item.ID_userA._id === me._id) {
      setID_friend(item.ID_userB._id);
      setName(`${item.ID_userB.first_name} ${item.ID_userB.last_name}`);
      setAvatar(item.ID_userB.avatar);
    } else {
      setID_friend(item.ID_userA._id);
      setName(`${item.ID_userA.first_name} ${item.ID_userA.last_name}`);
      setAvatar(item.ID_userA.avatar);
    }
  }, [item, me]);

  const isJoined = membersGroup.some(member => member._id === ID_friend);
  const isSelected = isJoined ? true : selectedUsers.includes(ID_friend);


  return (
    <TouchableOpacity
      style={[styles.chatItem, isJoined && { opacity: 0.5 }]}
      onPress={() => onToggle(ID_friend)}
      disabled={isJoined}>
      <View style={styles.boxSelect}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}
          <View style={styles.vTxt}>
            {name && (
              <View style={styles.chatInfo}>
                <Text style={styles.name}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >{name}</Text>
              </View>
            )}
          </View>
        </View>
        {isSelected ? <Icon name="checkmark-circle-sharp" size={25} color="blue" /> : <Icon name="radio-button-off" size={25} color="gray" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderBottomColor: '#ddd',
    // opacity: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  chatInfo: {
    marginLeft: 10
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black",
    width: width * 0.4
  },
  // vTxt: {
  //   flexDirection: 'column',
  //   flex: 1,
  // },
  boxSelect: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10
  }
});

