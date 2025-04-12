import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions
} from "react-native";
import React from 'react';
import { useSelector } from 'react-redux';
const { width, height } = Dimensions.get('window');

export default function ItemFriendInGroup({ item, ID_admin, toProfile, handleXoa, handlePassKey }) {
  const me = useSelector(state => state.app.user);

  const shortenName = (name) => {
    if (!name) return '';
    if (name.length > 15) {
      return name.substring(0, 12) + '...';
    }
    return name;
  };

  // Nối first_name và last_name
  const fullName = `${item.first_name || ''} ${item.last_name || ''}`.trim();

  return (
    <TouchableOpacity
      style={styles.chatItem}
    >
      <View style={styles.containerAll}>
        <TouchableOpacity
          onPress={() => toProfile(item._id)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={{ flexDirection: 'column' }}>
              <Text
                style={styles.name}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {shortenName(fullName)}
              </Text>
              {ID_admin === item._id && (
                <Text style={styles.admin}>Quản trị viên</Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.vBtn}>
          {/* Trưởng nhóm mới có quyền kick vs add vs chuyền key */}
          {ID_admin === me._id && ID_admin !== item._id && (
            <TouchableOpacity
              onPress={() => handlePassKey(item._id)}
            >
              <Text style={{ color: 'red', marginRight: 10 }}>Giao quyền</Text>
            </TouchableOpacity>
          )}
          {ID_admin === me._id && (
            <TouchableOpacity
              onPress={() => handleXoa(item._id)}
            >
              <Text style={styles.btn}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
    paddingVertical: height * 0.018,
  },
  avatar: {
    width: width * 0.13,
    height: width * 0.13,
    borderRadius: (width * 0.13) / 2,
    marginRight: width * 0.025,
  },
  name: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: "black",
  },
  vBtn: {
    flexDirection: 'row',
  },
  btn: {
    marginHorizontal: width * 0.015,
    color: 'blue',
  },
  admin: {
    color: 'gray',
    fontSize: width * 0.03,
    marginTop: height * 0.005,
  },
});