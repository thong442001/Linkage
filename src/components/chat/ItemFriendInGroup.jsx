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
      <View style={styles.containerAll}>
        <TouchableOpacity
          onPress={() => toProfile(item._id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.name}>{item.first_name} {item.last_name}</Text>
              {
                ID_admin == item._id
                && (
                  <Text style={styles.admin}>Quản trị viên</Text>
                )
              }
            </View>
          </View>
        </TouchableOpacity>
        <View
          style={styles.vBtn}
        >
          {/* Trưởng nhóm mới có quyền kick vs add vs chuyền key */}
          {
            (ID_admin == me._id && ID_admin != item._id)
            && (
              <TouchableOpacity
                onPress={() => handlePassKey(item._id)}
              >
                <Text style={{color : 'red', marginRight: 10}}>Giao quyền</Text>
              </TouchableOpacity>
            )
          }

          {
            ID_admin == me._id
            && (
              <TouchableOpacity
                onPress={() => handleXoa(item._id)}
              >
                <Text style={styles.btn}>Xóa</Text>
              </TouchableOpacity>
            )
          }
        </View>
      </View>
    </TouchableOpacity >
  );
}

const styles = StyleSheet.create({
  containerAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
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
    color: 'blue'
  },
  admin: {
    color: 'gray',
    fontSize: 12,
    marginTop: 2
  }
});
