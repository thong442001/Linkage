import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ItemNotification from '../../components/items/ItemNotification';
import {
  getAllNotificationOfUser
} from '../../rtk/API';
const Notification = () => {
  const [showAll, setShowAll] = useState(false);
  const [notifications, setNotifications] = useState([]); // State chứa danh sách thông báo
  const [newNotification, setNewNotification] = useState(null); // State chứa thông báo mới nhất
  const [visible, setVisible] = useState(false); // State điều khiển Snackbar

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user); // Lấy thông tin user từ Redux
  const token = useSelector(state => state.app.token); // Lấy thông tin user từ Redux

  const callGetAllNotificationOfUser = async () => {
    try {
      await dispatch(getAllNotificationOfUser({ me: me._id, token: token }))
        .unwrap()
        .then(response => {
          console.log(response);
          setNotifications(response.notifications);
        })
        .catch(error => {
          console.log('Error getAllNotificationOfUser: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      callGetAllNotificationOfUser(); // Gọi API load dữ liệu
    }, [])
  );

  return (
    <View style={styles.container}>

      {/* Danh sách thông báo */}
      <Text style={styles.title}>Thông báo</Text>
      <FlatList
        // data={showAll ? notifications : notifications.slice(0, 7)}
        data={notifications}
        renderItem={({ item }) =>
          <ItemNotification data={item} />
        }
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
