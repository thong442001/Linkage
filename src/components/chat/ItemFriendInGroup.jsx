import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ItemFriendInGroup({ item, ID_admin, toProfile, handleXoa, handlePassKey }) {

  const me = useSelector(state => state.app.user);

  return (
    <TouchableOpacity
      style={styles.chatItem}
    //onPress={() => onToggle(ID_friend)}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      {
        ID_admin == item._id
        && (
          <Text style={styles.btn}>🔑</Text>
        )
      }
      <Text style={styles.name}>{item.first_name} {item.last_name}</Text>


      <View
        style={styles.vBtn}
      >
        <TouchableOpacity
          onPress={() => toProfile(item._id)}
        >
          <Text style={styles.btn}>Profile</Text>
        </TouchableOpacity>

        {/* Trưởng nhóm mới có quyền kick vs add vs chuyền key */}
        {
          (ID_admin == me._id && ID_admin != item._id)
          && (
            <TouchableOpacity
              onPress={() => handlePassKey(item._id)}
            >
              <Text style={styles.btn}>🔑</Text>
            </TouchableOpacity>
          )
        }

        {
          ID_admin == me._id
          && (
            <TouchableOpacity
              onPress={() => handleXoa(item._id)}
            >
              <Text style={styles.btn}>x</Text>
            </TouchableOpacity>
          )
        }


      </View>



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
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: "black",
  },
  vBtn: {
    flexDirection: 'row',
  },
  btn: {
    marginHorizontal: 5,
    color: 'red'
  }
});
