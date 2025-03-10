import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ItemNotification from '../../components/items/ItemNotification';
import {getAllNotificationOfUser} from '../../rtk/API';

const Notification = () => {
  const [notifications, setNotifications] = useState([]); // State chứa danh sách thông báo
  const [expandedGroups, setExpandedGroups] = useState({}); // Trạng thái mở rộng từng nhóm

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

    
  const callGetAllNotificationOfUser = async () => {
    try {
      await dispatch(getAllNotificationOfUser({me: me._id, token: token}))
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
      callGetAllNotificationOfUser();
    }, []),
  );

  // Nhóm thông báo theo loại
  const groupedNotifications = notifications.reduce((acc, item) => {
    const type = item.type || 'Khác';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  // Hàm mở rộng nhóm thông báo

  const toggleExpand = (type) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedGroups(prevState => ({
      ...prevState,
      [type]: !prevState[type]
    }));
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      {Object.keys(groupedNotifications).map((type, index) => (
        <View key={index} style={styles.categoryContainer}>
          <Text style={styles.categoryTitle}>{type}</Text>
          <FlatList
            data={
              expandedGroups[type]
                ? groupedNotifications[type]
                : groupedNotifications[type].slice(0, 4)
            }
            renderItem={({item}) => <ItemNotification data={item} />}
            keyExtractor={(item, index) => index.toString()}
            scrollEnabled={false} // ⚡ Ngăn FlatList cuộn, chỉ ScrollView cuộn
          />
          {groupedNotifications[type].length > 4 && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => toggleExpand(type)}>
              <Text style={styles.text_button}>
                {expandedGroups[type] ? 'Ẩn bớt' : 'Xem thêm thông báo'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
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
  categoryContainer: {
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
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