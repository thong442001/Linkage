import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
const ItemNotification = ({data}) => {
  const me = useSelector(state => state.app.user);
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  // time
  const [timeAgo, setTimeAgo] = useState(data.updatedAt);

  useEffect(() => {
    const updateDiff = () => {
      const now = Date.now();
      const createdTime = new Date(data.updatedAt).getTime(); // Chuyển từ ISO sang timestamp

      if (isNaN(createdTime)) {
        setTimeAgo('Không xác định');
        return;
      }

      // Tính thời gian cho bài viết chính
      const diffMs = now - createdTime;
      if (diffMs < 0) {
        setTimeAgo('Vừa xong');
      } else {
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          setTimeAgo(`${days} ngày trước`);
        } else if (hours > 0) {
          setTimeAgo(`${hours} giờ trước`);
        } else if (minutes > 0) {
          setTimeAgo(`${minutes} phút trước`);
        } else {
          setTimeAgo(`${seconds} giây trước`);
        }
      }
    };

    updateDiff();
    // const interval = setInterval(updateDiff, 1000);

    // return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data.type == 'Lời mời kết bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
            ' ' +
            data.ID_relationship.ID_userB.last_name,
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name,
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    }
    if (data.type == 'Đã đăng story mới') {
      if (data.ID_post.ID_user._id) {
        setName(
          data.ID_post.ID_user.first_name +
            ' ' +
            data.ID_post.ID_user.last_name,
        );
        setAvatar(data.ID_post.ID_user.avatar);
      } else {
        setName(
          data.ID_post.ID_user.first_name +
            ' ' +
            data.ID_post.ID_user.last_name,
        );
        setAvatar(data.ID_post.ID_user.last_name);
      }
    }
    if (data.type == "Đã thành bạn bè của bạn") {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
            ' ' +
            data.ID_relationship.ID_userB.last_name,
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name,
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    }
  }, []);

  // Xác định màn hình cần chuyển đến dựa vào loại thông báo
  const navigateToScreen = () => {
    if (data.type === 'Lời mời kết bạn') {
      navigation.navigate('Friend', {userId: me._id});
    } else if (data.type === 'Tin nhắn mới') {
      navigation.navigate('ChatScreen', {conversationId: data.conversationId});
    } else if (data.type === 'Bài viết mới') {
      navigation.navigate('PostDetailScreen', {postId: data.postId});
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen}>
      <View style={styles.container}>
        {avatar && <Image source={{uri: avatar}} style={styles.img} />}
        <View style={styles.container_content}>
          <View style={styles.container_name}>
            <Text style={styles.text_name}>{name}</Text>
            <Text style={styles.text_content}>
              {data.content ??data.type ??'Bạn có thông báo mới'}
            </Text>
          </View>
          <Text style={styles.text_time}>{timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 13,
  },
  img: {
    width: 68,
    height: 68,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  container_name: {
    flexDirection: 'column',
  },
  text_content: {
    marginLeft: 2,
    fontSize: 16,
    fontWeight: '400', // "medium" không hợp lệ, dùng "400" tương đương
    color: 'black',
  },
  text_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container_content: {
    marginLeft: 13,
  },
  text_time: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
  },
});
