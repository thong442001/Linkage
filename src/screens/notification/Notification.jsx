import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import database from '@react-native-firebase/database';
import {Snackbar} from 'react-native-paper';
import ItemNotification from '../../components/items/ItemNotification';

const Notification = () => {
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]); // State chứa danh sách thông báo
  const [newNotification, setNewNotification] = useState(null); // State chứa thông báo mới nhất
  const [visible, setVisible] = useState(false); // State điều khiển Snackbar

  const me = useSelector(state => state.app.user); // Lấy thông tin user từ Redux

  useEffect(() => {
    if (!me?._id) return; // Kiểm tra me._id trước khi gọi Firebase tránh lỗi undefined

    const notificationRef = database().ref(`notifications/${me._id}`);

    const unsubscribe = notificationRef.on('child_added', snapshot => {
      if (snapshot.exists()) {
        const newNotif = snapshot.val();
        console.log('📢 Thông báo mới:', newNotif);

        setNewNotification(newNotif);
        setVisible(true); // Hiển thị Snackbar
        setNotifications(prevNotifs => [newNotif, ...prevNotifs]); // Thêm vào danh sách
      }
    });

    return () => notificationRef.off('child_added', unsubscribe); // Hủy lắng nghe khi component unmount
  }, [me?._id]); // Chạy lại khi me._id thay đổi

  return (
    <View style={styles.container}>
      {/* Snackbar hiển thị thông báo mới */}
      <Snackbar
        visible={visible && !!newNotification}
        onDismiss={() => setVisible(false)}
        duration={3000}
        action={{
          label: 'Xem',
          onPress: () => {
            setVisible(false);
          },
        }}>
        {`${newNotification?.senderName ?? 'Người dùng'} ${
          newNotification?.type === 'friend_request'
            ? 'đã gửi lời mời kết bạn'
            : newNotification?.content ?? ''
        }`}
      </Snackbar>

      {/* Danh sách thông báo */}
      <Text style={styles.title}>Thông báo</Text>
      <FlatList
        data={showAll ? notifications : notifications.slice(0, 7)}
        renderItem={({item}) => <ItemNotification data={item} />}
        keyExtractor={(item, index) => index.toString()}
      />

      {notifications.length > 7 && !showAll && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowAll(true)}>
          <Text style={styles.text_button}>Xem thêm thông báo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    height: 39,
    backgroundColor: '#E1E6EA',
    marginHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  text_button: {
    fontSize: 16,
    fontWeight: '400',
    color: 'black',
  },
});
