import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const ItemNotification = ({data}) => {
  const me = useSelector(state => state.app.user);
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  const date = new Date(data.createdAt);
   const [timeAgo, setTimeAgo] = useState(data.createdAt);
  // const formattedDate = new Intl.DateTimeFormat('vi-VN', {
  //   year: 'numeric',
  //   month: '2-digit',
  //   day: '2-digit',
  //   hour: '2-digit',
  //   minute: '2-digit',
  //   second: '2-digit',
  //   hour12: false,
  // }).format(date);

     useEffect(() => {
          const updateDiff = () => {
              const now = Date.now();
              const createdTime = new Date(data.createdAt).getTime(); // Chuyển từ ISO sang timestamp
  
              let createdTimeShare = null;
              if (data.ID_post_shared?.createdAt) {
                  createdTimeShare = new Date(data.ID_post_shared.createdAt).getTime();
              }
  
              if (isNaN(createdTime)) {
                  setTimeAgo("Không xác định");
                  setTimeAgoShare("Không xác định");
                  return;
              }
  
              // Tính thời gian cho bài viết chính
              const diffMs = now - createdTime;
              if (diffMs < 0) {
                  setTimeAgo("Vừa xong");
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
  
              // Nếu bài viết là chia sẻ, tính thời gian cho bài gốc
              if (createdTimeShare !== null) {
                  const diffMsShare = now - createdTimeShare;
                  if (diffMsShare < 0) {
                      setTimeAgoShare("Vừa xong");
                  } else {
                      const seconds = Math.floor(diffMsShare / 1000);
                      const minutes = Math.floor(seconds / 60);
                      const hours = Math.floor(minutes / 60);
                      const days = Math.floor(hours / 24);
  
                      if (days > 0) {
                          setTimeAgoShare(`${days} ngày trước`);
                      } else if (hours > 0) {
                          setTimeAgoShare(`${hours} giờ trước`);
                      } else if (minutes > 0) {
                          setTimeAgoShare(`${minutes} phút trước`);
                      } else {
                          setTimeAgoShare(`${seconds} giây trước`);
                      }
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
            data.ID_relationship.ID_userB.last_name
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    } else if (data.type == 'Đã thành bạn bè của bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
            ' ' +
            data.ID_relationship.ID_userB.last_name
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
            ' ' +
            data.ID_relationship.ID_userA.last_name
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
      }
    }
  }, []);


  // Xác định màn hình cần chuyển đến dựa vào loại thông báo
  const navigateToScreen = () => {
    if (data.type === 'Lời mời kết bạn') {
      navigation.navigate('friend', { userId: me._id });
    } else if (data.type === 'Đã thành bạn bè của bạn') {
      navigation.navigate('Profile', { _id: data.ID_relationship.ID_userB});
    } else if (data.type === 'Bài viết mới') {
      navigation.navigate('PostDetailScreen', { postId: data.postId });
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen} >
    <View style={styles.container}>
      {avatar && <Image source={{uri: avatar}} style={styles.img} />}
      <View style={styles.container_content}>
        <View style={styles.container_name}>
          <Text style={styles.text_name}>{name}</Text>
          <Text style={styles.text_content}>{data.type ?? "Bạn có thông báo mới"}</Text>
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
    backgroundColor: 'white',
    padding: 12,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB', // Viền xám nhẹ tạo cảm giác tinh tế
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  container_content: {
    marginLeft: 12,
    flex: 1,
  },
  text_name: {
    fontSize: 16,
    fontWeight: '600', // Sử dụng weight 600 để nhìn thanh lịch hơn
    color: '#1F2937', // Màu chữ đậm nhưng không quá gắt
  },
  text_content: {
    fontSize: 14,
    color: '#4B5563', // Màu xám đậm giúp dễ đọc nhưng không bị quá tối
    marginTop: 3,
  },
  text_time: {
    fontSize: 13,
    color: '#9CA3AF', // Màu xám nhạt hơn cho thời gian
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});
