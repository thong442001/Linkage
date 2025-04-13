import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Groupcomponent({ item }) {
  const me = useSelector(state => state.app.user);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);


  // Hàm kiểm tra link Google Maps
  const isGoogleMapsLink = text => {
    return /^https:\/\/www\.google\.com\/maps\?q=/.test(text || '');
  };



  // Hàm hiển thị nội dung tin nhắn
  const getMessageContent = message => {
    if (!message || !message.content) return '';

    // Debug dữ liệu message
    console.log('messageLatest:', {
      type: message.type,
      content: message.content,
      sender: message.sender,
    });

    const type = message.type || 'text'; 
    const content = message.content;

    // Kiểm tra Google Maps dựa trên content
    if (isGoogleMapsLink(content)) {
      return 'Link Google Map';
    }

    // Phân loại dựa trên type
    switch (type) {
      case 'image':
        return 'Hình ảnh';
      case 'video':
        return 'Video';
      case 'game3la':
        return 'Lời mời chơi game bài cào';
      case 'text':
      default:
        return content; // Hiển thị nội dung gốc nếu là text hoặc type không xác định
    }
  };

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

  const formatTime = timestamp => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  return (
    <View style={styles.chatItem}>
      {name != null && <Image source={{ uri: avatar }} style={styles.avatar} />}
      <View style={styles.vTxt}>
        {avatar != null && (
          <View style={styles.chatInfo}>
            <Text
              style={styles.name}
              numberOfLines={1}
              ellipsizeMode="tail">
              {name}
            </Text>
          </View>
        )}
        {item.messageLatest != null && (
          <View style={styles.vMessageNew}>
            {me._id != item.messageLatest.sender.ID_user ? (
              <Text style={styles.messageName}>
                {item.messageLatest.sender.first_name}{' '}
                {item.messageLatest.sender.last_name}:{' '}
              </Text>
            ) : (
              <Text style={styles.messageName}>Bạn: </Text>
            )}
            <Text
              style={styles.messageContent}
              numberOfLines={1}>
              {getMessageContent(item.messageLatest)}
            </Text>
            <Text style={styles.messageNewTime}>
              {formatTime(item.messageLatest.createdAt)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chatItem: {
    top: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 5,
    borderRadius: 30,
    paddingHorizontal: 10,
    borderColor: '#d8dce0',
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
    color: 'black',
    width: '70%',
  },
  time: {
    fontSize: 12,
    color: 'gray',
  },
  vTxt: {
    flexDirection: 'column',
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
    fontSize: 12,
    fontWeight: 'bold',
    color: '#aaa',
    marginTop: 3,
    alignItems: 'flex-end',
  },
});