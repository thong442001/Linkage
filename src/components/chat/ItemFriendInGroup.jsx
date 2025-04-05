import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');
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
              <Text style={styles.name}
                numberOfLines={1} // Số dòng tối đa
                ellipsizeMode="tail" // Cách hiển thị dấu 3 chấm (tail: ở cuối)
              >{item.first_name} {item.last_name}</Text>
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
                <Text style={{ color: 'red', marginRight: 10 }}>Giao quyền</Text>
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
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018, // 1.8% chiều cao màn hình
  },
  avatar: {
    width: width * 0.13, // 13% chiều rộng màn hình
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2, // Bo tròn theo kích thước ảnh
    marginRight: width * 0.025, // 2.5% chiều rộng màn hình
  },
  chatInfo: {
    flex: 1,
  },
  name: {
    fontSize: width * 0.045, // 4.5% chiều rộng màn hình
    fontWeight: 'bold',
    color: "black",
    // width: "50"
  },
  vBtn: {
    flexDirection: 'row',
  },
  btn: {
    marginHorizontal: width * 0.015, // 1.5% chiều rộng màn hình
    color: 'blue',
  },
  admin: {
    color: 'gray',
    fontSize: width * 0.03, // 3% chiều rộng màn hình
    marginTop: height * 0.005, // 0.5% chiều cao màn hình
  },
});
