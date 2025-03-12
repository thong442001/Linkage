import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import { getAllReaction } from '../rtk/API';
import { requestPermissions } from '../screens/service/MyFirebaseMessagingService';
import { setReactions, setFcmToken } from '../rtk/Reducer';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useSocket } from '../context/socketContext';

const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const { onlineUsers } = useSocket();

  const [isSplashVisible, setSplashVisible] = useState(true); // Trạng thái để kiểm soát màn hình chào
  //const reactions = useSelector(state => state.app.reactions)
  //console.log("****: " + reactions)
  const fcmToken = useSelector(state => state.app.fcmToken);
  console.log('📲 FCM Token từ Redux:', fcmToken);

  useEffect(() => {
    //reactions
    callGetAllReaction();
    // Hiển thị màn hình chào trong 2 giây
    const timeout = setTimeout(() => {
      setSplashVisible(false); // Ẩn màn hình chào sau 2 giây
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    console.log('🔵 Danh sách user online: ', onlineUsers);
  }, [onlineUsers]);

  //call api getAllReaction
  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then(response => {
          //console.log("****: " + response)
          dispatch(setReactions(response.reactions));
        })
        .catch(error => {
          console.log('Error:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    requestPermissions();
    createNotificationChannel();
  }, []);

  async function createNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'default-channel',
        name: 'Default Channel',
        importance: AndroidImportance.MAX,
      });
    }
  }
  // tạo token nè
  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('🔥 FCM Token:', token);
        if (token) {
          dispatch(setFcmToken(token)); // Lưu vào Redux
          //if(user )
        }
      } catch (error) {
        console.log('❌ Lỗi khi lấy FCM Token:', error);
      }
    };

    getFCMToken();
  }, []);

  useEffect(() => {
    // Khi app đang mở
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      try {
        console.log('📩 Nhận thông báo khi app đang mở:', remoteMessage);

        if (!remoteMessage?.data?.notification) {
          console.warn('⚠ Không có dữ liệu notification');
          return;
        }

        // Kiểm tra JSON hợp lệ trước khi parse
        let notification;
        try {
          notification = JSON.parse(remoteMessage.data.notification);
        } catch (error) {
          console.error('❌ Lỗi khi parse JSON notification:', error);
          return;
        }

        console.log('✅ Đã parse notification:', notification);

        const contentne = () => {
          if (
            notification?.type === 'Lời mời kết bạn' &&
            notification?.ID_relationship
          ) {
            const { ID_userA, ID_userB } = notification.ID_relationship;

            if (user?._id?.toString() === ID_userA?._id?.toString()) {
              return `${ID_userB?.first_name || ''} ${ID_userB?.last_name || ''
                } đã gửi lời mời kết bạn với bạn`;
            } else {
              return `${ID_userA?.first_name || ''} ${ID_userA?.last_name || ''
                } đã gửi lời mời kết bạn với bạn`;
            }
          }

          if (
            notification?.type === 'Đã thành bạn bè của bạn' &&
            notification?.ID_relationship
          ) {
            const { ID_userA, ID_userB } = notification.ID_relationship;

            if (user?._id?.toString() === ID_userA?._id?.toString()) {
              return `${ID_userB?.first_name || ''} ${ID_userB?.last_name || ''
                } với bạn đã thành bạn bè`;
            } else {
              return `${ID_userA?.first_name || ''} ${ID_userA?.last_name || ''
                } với bạn đã thành bạn bè`;
            }
          }

          if (
            notification?.type === 'Tin nhắn mới' &&
            notification?.ID_message
          ) {
            const { sender, content } = notification.ID_message;

            if (notification.ID_message.type === "text") {
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã gửi một tin nhắn'
                }`;
            } else {
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${'Đã gửi một ảnh mới'
                }`;
            }
          }

          if (
            notification?.type === 'Bạn đã được mời vào nhóm mới' &&
            notification?.ID_group
          ) {
            return `Bạn đã được mời vào nhóm mới`;
          }


          if (
            notification?.type === "Đã đăng story mới" &&
            notification?.ID_post
          ) {
            const { sender, content } = notification.ID_post;

            if (sender) {
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã đăng story mới'
                }`;
            }
          }

          if (
            notification?.type === 'Bạn đã được mời vào nhóm mới' &&
            notification?.ID_group
          ) {
            return `Bạn đã được mời vào nhóm mới`;
          }

          if (
            notification?.type === "Đã đăng bài mới" &&
            notification?.ID_post
          ) {
            const { sender, content } = notification.ID_post;

            if (sender) {
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã đăng bài post mới'
                }`;
            }
          }


          if (
            notification?.type === "Đang livestream"
            && notification?.content
          ) {
            const sender = notification.ID_relationship.ID_userA._id == user._id
              ? notification.ID_relationship.ID_userB
              : notification.ID_relationship.ID_userA;
            const content = notification.content;

            console.log("sender id: " + sender._id)


            if (sender) {
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đang phát trực tiếp'
                }`;
            }

          }





          return 'Bạn có một thông báo mới'; // Nội dung mặc định
        };

        // Hiển thị thông báo bằng Notifee
        await notifee.displayNotification({
          title: remoteMessage.notification?.title ?? 'Thông báo',
          body: contentne(),
          android: {
            channelId: 'default-channel', // Đảm bảo channelId tồn tại
            smallIcon: 'ic_launcher', // Đổi icon nếu cần
          },
        });
      } catch (error) {
        console.error('❌ Lỗi khi xử lý thông báo:', error);
      }
    });

    // Khi app chạy nền và người dùng nhấn vào thông báo
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          '🔔 Người dùng nhấn vào thông báo khi app chạy nền:',
          remoteMessage,
        );
      },
    );

    // Khi app bị kill và mở từ thông báo
    const initialNotification = messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            '🔔 App được mở từ thông báo khi bị kill:',
            remoteMessage,
          );
        }
      });

    // Khi người dùng nhấn vào thông báo từ notifee
    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log(
          '🔔 Người dùng đã nhấn vào thông báo:',
          detail.notification,
        );
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeOpenedApp();
      unsubscribeNotifee();
      // initialNotification();
    };
  }, []);

  return (
    <NavigationContainer>
      {isSplashVisible ? (
        <Welcome /> // Hiển thị màn hình chào trước
      ) : user ? (
        <HomeNavigation />
      ) : (
        <UserNavigation />
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;