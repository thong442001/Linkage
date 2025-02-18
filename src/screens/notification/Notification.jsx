import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemNotification from '../../components/items/ItemNotification';
const Notification = () => {
  const [showAll, setShowAll] = useState(false); // State kiểm soát số lượng item hiển thị
  const visibleData = showAll ? data : data.slice(0, 7);
  return (
    <View style={styles.container}>
      <View style={styles.container_title}>
        <Text style={styles.text_title}>Thông báo</Text>
        <Icon name="search" size={30} color="black" />
      </View>
      <Text style={styles.truocdo}>Trước đó</Text>
      <View style={styles.list_notification}>
        <FlatList
          data={visibleData}
          renderItem={({item}) => <ItemNotification data={item} />}
          keyExtractor={item => item.id}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={() => setShowAll(true)}>
        <Text style={styles.text_button}>Xem thống báo trước đó</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    paddingTop: 33,
  },
  container_title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  text_title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  truocdo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 11,
    paddingHorizontal: 20,
  },
  list_notification: {
    backgroundColor: '#EAF2FD',
    paddingVertical: 8,
    height: 580,
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
    fontWeight: 'medium',
    color: 'black',
  },
});

const data = [
  {
    id: 1,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 2,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 3,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 4,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 5,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 6,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 7,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 8,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
  {
    id: 9,
    name: 'canhphan',
    content: 'đã thêm tin của mình',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    time: '11 giờ',
  },
];
