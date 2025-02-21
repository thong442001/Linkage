import {
  StyleSheet,
  Text,
  View,
  Image
} from "react-native";
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Groupcomponent({ item }) {

  const me = useSelector(state => state.app.user);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  //console.log(item);

  useEffect(() => {
    if (item.isPrivate == true) {
      const otherUser = item.members.find(user => user._id !== me._id);
      if (otherUser) {
        setAvatar(otherUser.avatar);
      } else {
        console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
      }

      if (item.name == null) {
        if (otherUser) {
          //setName(otherUser.displayName);
          setName((otherUser.first_name + " " + otherUser.last_name));
        } else {
          console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
        }
      } else {
        setName(item.name);
      }
    } else {
      if (item.avatar == null) {
        setAvatar('https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Anlene%2Flogo.png?alt=media&token=f98a4e03-1a8e-4a78-8d0e-c952b7cf94b4');
      } else {
        setAvatar(item.avatar);
      }
      if (item.name == null) {
        const names = item.members
          .filter(user => user._id !== me._id)
          .map(user => `${user.first_name} ${user.last_name}`)
          .join(", ");
        // Cập nhật state một lần duy nhất
        setName(names);
      } else {
        setName(item.name);
      }
    }

  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Hiển thị 24h (Bỏ dòng này nếu muốn 12h)
    });
  };

  return (
    <View style={styles.chatItem}>
      {
        (name != null)
        && <Image source={{ uri: avatar }} style={styles.avatar} />
      }
      {/* view tên nhóm và tin nhắn mới nhất */}
      <View style={styles.vTxt}>
        {
          (avatar != null)
          && <View style={styles.chatInfo}>
            <Text style={styles.name}
              numberOfLines={1} // Số dòng tối đa
              ellipsizeMode="tail" // Cách hiển thị dấu 3 chấm (tail: ở cuối)
            >{name}</Text>
          </View>
        }
        {/* tin nhắn mới nhất */}
        {
          item.messageLatest != null
          && (
            <View style={styles.vMessageNew}>
              {/* name */}
              {
                me._id != item.messageLatest.sender.ID_user
                  ? <Text
                    style={styles.messageName}>
                    {item.messageLatest.sender.displayName}: </Text>
                  : <Text
                    style={styles.messageName}>
                    Bạn: </Text>
              }
              {/* content */}
              <Text
                style={styles.messageContent}
                numberOfLines={1}
              >{item.messageLatest.content}</Text>
              {/* thời gian */}
              <Text style={styles.messageNewTime}>{formatTime(item.messageLatest.createdAt)}</Text>
            </View>
          )
        }
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5
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
    width: "70%"
  },
  time: {
    fontSize: 12,
    color: 'gray',
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
  messageNewTime: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 3,
    alignItems: "flex-end",
  },
});
