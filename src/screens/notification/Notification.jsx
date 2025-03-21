import {useFocusEffect} from '@react-navigation/native';
import React, {useState, useCallback} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, LayoutAnimation} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ItemNotification from '../../components/items/ItemNotification';
import {getAllNotificationOfUser} from '../../rtk/API';
import Icon from 'react-native-vector-icons/Ionicons'
import { oStackHome } from '../../navigations/HomeNavigation';

const Notification = (props) => {
  const [notifications, setNotifications] = useState([]); 
  const [isExpanded, setIsExpanded] = useState(false); // ✅ Thêm state mở rộng
 
  const {navigation} = props;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const callGetAllNotificationOfUser = async () => {
    try {
      await dispatch(getAllNotificationOfUser({me: me._id, token: token}))
        .unwrap()
        .then(response => {
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

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); // animation smooth
    setIsExpanded(!isExpanded);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <TouchableOpacity  onPress={() => navigation.navigate(oStackHome.Search.name)}>
        <Icon name="search-outline" size={30} color='black' />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={isExpanded ? notifications : notifications.slice(0, 7)} // 👈 Toggle số lượng hiển thị
          renderItem={({item}) => <ItemNotification data={item} />}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
        {notifications.length > 7 && (
          <TouchableOpacity style={styles.button} onPress={toggleExpand}>
            <Text style={styles.text_button}>
              {isExpanded ? 'Ẩn bớt' : 'Xem thêm thông báo'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};


export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 30,
    paddingHorizontal:20
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 10,
  },
  categoryContainer: {
    marginBottom: 50,
  },
  categoryTitle: {
    fontSize: 16,
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
  header:{
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems:'center'
  }
});