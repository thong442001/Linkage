import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../../styles/components/items/FriendsItem';

const FriendRequestItem = ({ data, me, onXacNhan, onXoa }) => {
  const [timeAgo, setTimeAgo] = useState('');

  // Hàm tính toán thời gian
  const updateDiff = () => {
    const now = Date.now();
    const createdTime = new Date(data.updatedAt).getTime();

    if (isNaN(createdTime)) {
      setTimeAgo('Không xác định');
      return;
    }

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

  // Cập nhật timeAgo mỗi khi data.updatedAt thay đổi
  useEffect(() => {
    updateDiff();
    // Cập nhật thời gian mỗi giây (tùy chọn, nếu muốn real-time)
    const interval = setInterval(updateDiff, 1000);
    return () => clearInterval(interval);
  }, [data.updatedAt]); // Phụ thuộc vào data.updatedAt

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <View style={styles.imgWrap}>
        {data.ID_userA._id === me ? (
          <Image style={styles.image} source={{ uri: data.ID_userB.avatar }} />
        ) : (
          <Image style={styles.image} source={{ uri: data.ID_userA.avatar }} />
        )}
      </View>
      <View style={styles.wrapper}>
        <View style={styles.info}>
          {data.ID_userA._id === me ? (
            <Text style={styles.name}>
              {data.ID_userB.first_name} {data.ID_userB.last_name}
            </Text>
          ) : (
            <Text style={styles.name}>
              {data.ID_userA.first_name} {data.ID_userA.last_name}
            </Text>
          )}
        </View>
        <View>
          <Text style={styles.mutualFriends}>{timeAgo}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onXacNhan(data._id)}
            style={[styles.acpButton, { backgroundColor: '#0064E0' }]}
          >
            <Text style={[styles.acpTxt, { color: 'white' }]}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onXoa(data._id)}
            style={[styles.delButton, { backgroundColor: '#A6A6A6' }]}
          >
            <Text style={[styles.delTxt, { color: 'white' }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FriendRequestItem;