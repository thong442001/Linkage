import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import {
  getAllReaction,
  checkBanUser,
  setNoti_token
} from '../rtk/API';
import { requestPermissions } from '../screens/service/MyFirebaseMessagingService';
import {
  setReactions,
  setFcmToken,
  logout,
} from '../rtk/Reducer';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useSocket } from '../context/socketContext';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../navigations/NavigationService';


const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const navigation = useNavigation(); // Lấy navigation
  const { onlineUsers } = useSocket(); // Lấy danh sách user online từ context


  const [isSplashVisible, setSplashVisible] = useState(true); // Trạng thái để kiểm soát màn hình chào
  //const reactions = useSelector(state => state.app.reactions)
  //console.log("****: " + reactions)
  const fcmToken = useSelector(state => state.app.fcmToken);
  console.log('📲 FCM Token từ Redux:', fcmToken);

  useEffect(() => {
    // check user có bị khóa ko
    callCheckBanUser();
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

  //call api getAllReaction
  const callCheckBanUser = async () => {
    try {
      await dispatch(checkBanUser({ ID_user: user._id, token: token }))
        .unwrap()
        .then(response => {
          console.log("status : " + response.status)
        })
        .catch(error => {
          console.log('Tài khoản đã bị khóa');
          // quay về trang login
          onLogout();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const onLogout = () => {
    dispatch(setNoti_token({ ID_user: user._id, fcmToken: fcmToken }))
      .unwrap()
      .then((response) => {
        //console.log(response);
        // xóa user trong redux
        dispatch(logout())
      })
      .catch((error) => {
        console.log(error);
      });
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
              return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã đăng bài post mới'}`;
            }
          }
          if (
            notification?.type === "Bạn có 1 cuộc gọi đến" &&
            notification?.ID_group
          ) {
            // Điều hướng đến màn hình nhận cuộc gọi
            navigate("IncomingCallScreen", { group: notification.ID_group, type: false });
            const { members, isPrivate, name } = notification.ID_group;
            if (isPrivate == true) {
              const sender = members.find(member => member._id !== user._id);
              return `${sender.first_name || ''} ${sender.last_name || ''} đang gọi cho bạn`;
            } else {
              if (name == null) {
                const names = members
                  .filter(memders => memders._id !== user._id)
                  .map(user => `${user.first_name} ${user.last_name}`)
                  .join(", ");
                return `${names} đang gọi cho bạn`;
              } else {
                return `${name} đang gọi cho bạn`;
              }
            }

          }
          if (
            notification?.type === "Bạn có 1 cuộc gọi video đến" &&
            notification?.ID_group
          ) {
            navigate("IncomingCallScreen", { group: notification.ID_group, type: true });
            const { members, isPrivate, name } = notification.ID_group;
            if (isPrivate == true) {
              const sender = members.find(member => member._id !== user._id);
              return `${sender.first_name || ''} ${sender.last_name || ''} đang gọi video call cho bạn`;
            } else {
              if (name == null) {
                const names = members
                  .filter(memders => memders._id !== user._id)
                  .map(user => `${user.first_name} ${user.last_name}`)
                  .join(", ");
                return `Tham gia cuộc gọi video call ${names}`;
              } else {
                return `Tham gia cuộc gọi video call ${name}`;
              }
            }

          }
          // game 3 la
          if (
            notification?.type === "Mời chơi game 3 lá" &&
            notification?.ID_group
          ) {
            navigate("NguoiDuocMoi", { group: notification.ID_group });
            const { members, isPrivate } = notification.ID_group;
            if (isPrivate == true) {
              const sender = members.find(member => member._id !== user._id);
              return `${sender.first_name || ''} ${sender.last_name || ''} đang mời bạn chơi game 3 lá`;
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

  return isSplashVisible ? <Welcome /> : user ? <HomeNavigation /> : <UserNavigation />;
};

export default AppNavigation;