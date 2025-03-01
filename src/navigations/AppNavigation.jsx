import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import { getAllReaction } from '../rtk/API';
import { setReactions, setFcmToken } from '../rtk/Reducer';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { requestPermissions } from '../screens/service/MyFirebaseMessagingService';

const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const [isSplashVisible, setSplashVisible] = useState(true);
  const reactions = useSelector(state => state.app.reactions);
  const fcmToken = useSelector(state => state.app.fcmToken);

  useEffect(() => {
    requestPermissions(); // Yêu cầu quyền thông báo
    createNotificationChannel(); // Tạo kênh thông báo Android
    setupNotificationListeners(); // Thiết lập lắng nghe thông báo
  }, []);

  // 🛑 Tạo kênh thông báo trên Android
  async function createNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default-channel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });
    }
  }

  // 🛑 Hiển thị thông báo
  async function displayNotification(title, body, data) {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default-channel',
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
          launchActivity: 'default', // Mở app khi nhấn vào
        },
      },
      data,
    });
  }

  // 🛑 Lắng nghe thông báo từ FCM
  function setupNotificationListeners() {
    // Khi app đang mở
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('📩 Nhận thông báo khi app đang mở:', JSON.stringify(remoteMessage, null, 2));
      displayNotification(
        remoteMessage.notification?.title ?? 'Thông báo',
        remoteMessage.notification?.body ?? 'Bạn có một tin nhắn mới.',
        remoteMessage.data ?? {}
      );
    });

    // Khi người dùng nhấn vào thông báo từ background
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('🔔 Người dùng nhấn vào thông báo khi app chạy nền:', remoteMessage);
    });

    // Khi app bị tắt và mở lên từ thông báo
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('🔔 App mở từ thông báo:', remoteMessage);
        }
      });

    // Xử lý sự kiện Foreground Notification Click
    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Người dùng đã nhấn vào thông báo:', detail.notification);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
    };
  }

  useEffect(() => {
    if (!fcmToken) {
      getFcmToken();
    } else {
      console.log('✅ FCM Token đã có:', fcmToken);
    }

    if (!reactions) {
      callGetAllReaction();
    }

    // Hiển thị màn hình chào trong 2 giây
    const timeout = setTimeout(() => setSplashVisible(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  const getFcmToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log('🔑 FCM Token:', token);
      if (token) {
        dispatch(setFcmToken(token));
        if (user?._id) {
          await database().ref(`users/${user._id}`).update({ fcmToken: token });
        }
      }
    } catch (error) {
      console.log('❌ Lỗi lấy FCM Token:', error);
    }
  };

  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then(response => {
          dispatch(setReactions(response.reactions));
        })
        .catch(error => {
          console.log('Error:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavigationContainer>
      {isSplashVisible ? <Welcome /> : user ? <HomeNavigation /> : <UserNavigation />}
    </NavigationContainer>
  );
};

export default AppNavigation;
