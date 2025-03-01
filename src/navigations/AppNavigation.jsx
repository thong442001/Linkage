import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import {
  getAllReaction,
} from '../rtk/API';
import { requestPermissions } from '../screens/service/MyFirebaseMessagingService';


import { setReactions, setFcmToken } from '../rtk/Reducer';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';


const AppNavigation = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const [isSplashVisible, setSplashVisible] = useState(true);  // Trạng thái để kiểm soát màn hình chào
  //const reactions = useSelector(state => state.app.reactions)
  //console.log("****: " + reactions)
  const fcmToken = useSelector(state => state.app.fcmToken);
  console.log("📲 FCM Token từ Redux:", fcmToken);


  useEffect(() => {
    //reactions
    callGetAllReaction()

    // Hiển thị màn hình chào trong 2 giây
    const timeout = setTimeout(() => {
      setSplashVisible(false);  // Ẩn màn hình chào sau 2 giây
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);


  //call api getAllReaction
  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then((response) => {
          //console.log("****: " + response)
          dispatch(setReactions(response.reactions));
        })
        .catch((error) => {
          console.log('Error:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    requestPermissions();
    createNotificationChannel();
  }, []);

  async function createNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default-channel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  }
  // tạo token nè
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log("🔥 FCM Token:", token);
        if (token) {
          dispatch(setFcmToken(token)); // Lưu vào Redux
        }
      } catch (error) {
        console.log("❌ Lỗi khi lấy FCM Token:", error);
      }
    };

    getFCMToken();
  }, []);


  useEffect(() => {
    // Khi app đang mở
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📩 Nhận thông báo khi app đang mở:', remoteMessage);
      displayNotification(
        remoteMessage.notification?.title ?? 'Thông báo',
        remoteMessage.notification?.body ?? 'Bạn có một tin nhắn mới.',
        remoteMessage.data ?? {}
      );
    });

    // Khi app chạy nền và người dùng nhấn vào thông báo
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔔 Người dùng nhấn vào thông báo khi app chạy nền:', remoteMessage);
    });

    // Khi app bị kill và mở từ thông báo
    const initialNotification = messaging().getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🔔 App được mở từ thông báo khi bị kill:', remoteMessage);
        }
      });

    // Khi người dùng nhấn vào thông báo từ notifee
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Người dùng đã nhấn vào thông báo:', detail.notification);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
      unsubscribeNotifee();
    };
  }, []);



  return (
    <NavigationContainer>
      {
        isSplashVisible
          ? <Welcome />  // Hiển thị màn hình chào trước
          : (user ? <HomeNavigation /> : <UserNavigation />)

      }

    </NavigationContainer>
  );
}

export default AppNavigation;