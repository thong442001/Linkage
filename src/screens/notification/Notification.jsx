import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  LayoutAnimation,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import ItemNotification from '../../components/items/ItemNotification';
import { getAllNotificationOfUser } from '../../rtk/API';
import Icon from 'react-native-vector-icons/Ionicons';
import { oStackHome } from '../../navigations/HomeNavigation';

const {width, height} = Dimensions.get('window')

const Notification = (props) => {
  const { navigation, route } = props;
  const dispatch = useDispatch();
  const me = useSelector((state) => state.app.user);
  const token = useSelector((state) => state.app.token);
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Thêm Animated và ref để xử lý sự kiện cuộn
  const scrollY = useRef(new Animated.Value(0)).current;
  const previousScrollY = useRef(0);

  const callGetAllNotificationOfUser = async () => {
    try {
      await dispatch(getAllNotificationOfUser({ me: me._id, token: token }))
        .unwrap()
        .then((response) => {
          setNotifications(response.notifications);
        })
        .catch((error) => {
          console.log('Error getAllNotificationOfUser: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      callGetAllNotificationOfUser();
      // Hiển thị bottom tab khi màn hình được focus
      route.params?.handleScroll?.(true);
    }, [route.params?.handleScroll])
  );

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  // Hàm xử lý sự kiện cuộn
  const handleScrollEvent = (event) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    if (currentScrollY < 50) {
      route.params?.handleScroll?.(true); // Hiển thị bottom tab khi ở gần đầu
    } else {
      if (currentScrollY - previousScrollY.current > 0) {
        route.params?.handleScroll?.(false); // Ẩn bottom tab khi cuộn xuống
      } else if (currentScrollY - previousScrollY.current < 0) {
        route.params?.handleScroll?.(true); // Hiển thị bottom tab khi cuộn lên
      }
    }
    previousScrollY.current = currentScrollY;
  };

  return (
    <Animated.ScrollView
      style={styles.container}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        {
          useNativeDriver: true,
          listener: handleScrollEvent,
        }
      )}
      scrollEventThrottle={16}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Thông báo</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(oStackHome.Search.name)}
        >
          <Icon name="search-outline" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={isExpanded ? notifications : notifications.slice(0, 7)}
          renderItem={({ item }) => <ItemNotification data={item} />}
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
    </Animated.ScrollView>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: height * 0.01,
    paddingHorizontal: 20,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});