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
import { setReactions, setFcmToken, logout } from '../rtk/Reducer';
import database from '@react-native-firebase/database';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useSocket } from '../context/socketContext';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../navigations/NavigationService';
import { getNotificationPreference } from '../noti/notificationHelper';
import { io } from 'socket.io-client';
import { Linking } from 'react-native';
import { parseQueryString } from '../utils/deeplink/queryParser';

const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const navigation = useNavigation(); // Lấy navigation
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // Lưu danh sách user online
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

  // deeplink
  useEffect(() => {
    const handleDeepLink = async () => {
      // const url = await Linking.getInitialURL();
      // console.log("link1: " + url)
      // if (url) {
      //   const params = new URLSearchParams(url.split('?')[1]);
      //   const ID_post = params.get('ID_post');
      //   if (ID_post) {
      //     console.log(`Chuyển hướng đến màn hình ID_post: ${ID_post}`);
      //   }
      // }
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          //console.log('🌐 Deeplink:', url);
          // Parse deeplink: linkage://post-chi-tiet?ID_post=124
          const [path, queryString] = url.split('?');
          if (path.includes('post-chi-tiet')) {
            const params = parseQueryString(queryString);
            const ID_post = params.ID_post;
            if (ID_post) {
              //console.log(`Chuyển hướng đến màn hình ID_post: ${ID_post}`);
              // Navigate to PostScreen
              navigation.navigate("PostDetail", { ID_post: ID_post, typeClick: "comment" });
            } else {
              console.error('❌ Thiếu ID_post trong deeplink');
            }
          }

        }
      } catch (error) {
        console.error('❌ Lỗi khi xử lý deeplink:', error);
      }
    };

    handleDeepLink();
    // Lắng nghe deeplink khi ứng dụng đang chạy
    const subscription = Linking.addEventListener('url', ({ url }) => {
      //console.log('🌐 Nhận deeplink:', url);
      const [path, queryString] = url.split('?');
      if (path.includes('post-chi-tiet')) {
        const params = parseQueryString(queryString);
        const ID_post = params.ID_post;
        if (ID_post) {
          //console.log(`Chuyển hướng đến màn hình ID_post: ${ID_post}`);
          navigation.navigate("PostDetail", { ID_post: ID_post, typeClick: "comment" });
        } else {
          console.error('❌ Thiếu ID_post trong deeplink');
        }
      }
    });
    return () => subscription.remove();

  }, []);


  useEffect(() => {
    // Kết nối tới server
    const newSocket = io('https://linkage.id.vn', {
      transports: ['websocket', 'polling'],
      reconnection: true, // Cho phép tự động kết nối lại
      reconnectionAttempts: 5, // Thử kết nối lại tối đa 5 lần
      timeout: 5000, // Chờ tối đa 5 giây trước khi báo lỗi
    });
    setSocket(newSocket);
    if (user && socket) {
      newSocket.emit('user_online', user._id); // Gửi ID user lên server khi đăng nhập
    }

    newSocket.on('online_users', userList => {
      setOnlineUsers(userList);
      console.log('🟢 Danh sách user online:', userList);
    });
    console.log('OnlineUsers: ' + onlineUsers);

    return () => {
      newSocket.off('online_users');
    };
  }, [user]);



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
          console.log('status : ' + response.status);
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

  const onLogoutAndNavigate = () => {
    dispatch(setNoti_token({ ID_user: user._id, fcmToken: fcmToken }))
      .unwrap()
      .then(response => {
        console.log('✅ Đã gửi token thông báo trước khi logout:', response);
        dispatch(logout()); // Xóa user trong Redux
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Điều hướng về màn hình Login
        });
      })
      .catch(error => {
        console.log('❌ Lỗi khi gửi token thông báo:', error);
        dispatch(logout()); // Vẫn logout dù có lỗi
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], // Điều hướng về màn hình Login
        });
      });
  };

  const onLogout = () => {
    dispatch(setNoti_token({ ID_user: user._id, fcmToken: fcmToken }))
      .unwrap()
      .then(response => {
        //console.log(response);
        // xóa user trong redux
        dispatch(logout());
      })
      .catch(error => {
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
        name: 'Mặc định',
        importance: AndroidImportance.MAX,
      });

      await notifee.createChannel({
        id: 'message-channel',
        name: 'Tin nhắn',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'friend-request-channel',
        name: 'Lời mời kết bạn',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'friend-confirmation-channel',
        name: 'Xác nhận kết bạn',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'group-invite-channel',
        name: 'Lời mời tham gia nhóm',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'story-channel',
        name: 'Story mới',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'post-channel',
        name: 'Bài viết mới',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'call-channel',
        name: 'Cuộc gọi',
        importance: AndroidImportance.HIGH,
        sound: 'ringtone', // Âm thanh riêng cho cuộc gọi
      });

      await notifee.createChannel({
        id: 'livestream-channel',
        name: 'Livestream',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'game-invite-channel',
        name: 'Lời mời chơi game',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'post-share-channel',
        name: 'Chia sẻ bài viết',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'comment-channel',
        name: 'Bình luận',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'account-ban-channel',
        name: 'Thông báo khóa tài khoản',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'tagged-post-channel',
        name: 'Gắn thẻ trong bài viết',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'post-like-channel',
        name: 'Lượt thích bài viết',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'comment-like-channel',
        name: 'Lượt thích bình luận',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'mention-comment-channel',
        name: 'Nhắc đến trong bình luận',
        importance: AndroidImportance.HIGH,
      });

      await notifee.createChannel({
        id: 'event-channel',
        name: 'Sự kiện mới',
        importance: AndroidImportance.HIGH,
      });
    }
  }


  const generateNotificationContent = (notification, user) => {
    if (!notification) {
      console.error("❌ Lỗi: notification không hợp lệ.");
      return "Bạn có một thông báo mới";
    }
    // 1. Thông báo lời mời kết bạn
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

    // 2. Thông báo đã thành bạn bè
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

    // 3. Thông báo tin nhắn mới
    if (
      notification?.type === 'Tin nhắn mới' &&
      notification?.ID_message
    ) {
      const { sender, content } = notification.ID_message;
      if (notification.ID_message.type === 'text') {
        return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã gửi một tin nhắn'
          }`;
      } else {
        return `${sender.first_name || ''} ${sender.last_name || ''
          }: Đã gửi một ảnh mới`;
      }
    }

    // 4. Thông báo được mời vào nhóm mới
    if (
      notification?.type === 'Bạn đã được mời vào nhóm mới' &&
      notification?.ID_group
    ) {
      return 'Bạn đã được mời vào nhóm mới';
    }

    // 5. Thông báo có story mới
    if (
      notification?.type === 'Đã đăng story mới' &&
      notification?.ID_post
    ) {
      const { ID_user: postOwner, caption } = notification.ID_post;
      return `${postOwner?.first_name || ''} ${postOwner?.last_name || ''
        } đã đăng story mới ${caption ? `: ${caption}` : ''}`;
    }

    // 6. Thông báo có bài đăng mới
    if (notification?.type === 'Đã đăng bài mới' && notification?.ID_post) {
      const { ID_user, content } = notification.ID_post; // Lấy ID_user thay vì sender
      return ID_user
        ? `${ID_user.first_name || ''} ${ID_user.last_name || ''}: ${content || 'Đã đăng bài post mới'}`
        : 'Có một bài đăng mới';
    }
    // 7. Thông báo cuộc gọi thoại đến
    if (
      notification?.type === 'Bạn có 1 cuộc gọi đến' &&
      notification?.ID_group
    ) {
      navigate('IncomingCallScreen', {
        group: notification.ID_group,
        type: false,
      });
      const { members, isPrivate, name } = notification.ID_group;
      if (isPrivate) {
        const sender = members.find(member => member._id !== user._id);
        return `${sender.first_name || ''} ${sender.last_name || ''
          } đang gọi cho bạn`;
      } else {
        return name
          ? `${name} đang gọi cho bạn`
          : `${members
            .map(m => `${m.first_name} ${m.last_name}`)
            .join(', ')} đang gọi cho bạn`;
      }
    }

    // 8. Thông báo cuộc gọi video đến
    if (
      notification?.type === 'Bạn có 1 cuộc gọi video đến' &&
      notification?.ID_group
    ) {
      navigate('IncomingCallScreen', {
        group: notification.ID_group,
        type: true,
      });
      const { members, isPrivate, name } = notification.ID_group;
      if (isPrivate) {
        const sender = members.find(member => member._id !== user._id);
        return `${sender.first_name || ''} ${sender.last_name || ''
          } đang gọi video call cho bạn`;
      } else {
        return name
          ? `Tham gia cuộc gọi video call ${name}`
          : `Tham gia cuộc gọi video call với ${members
            .map(m => `${m.first_name} ${m.last_name}`)
            .join(', ')}`;
      }
    }

    // 9. Thông báo livestream
    if (
      notification?.type === 'Đang livestream' &&
      notification?.ID_user &&
      notification?.content
    ) {
      const sender = notification.ID_relationship;
      if (sender.ID_userA._id === user._id) {
        return `${sender.ID_userB.first_name || ''} ${sender.ID_userB.last_name || ''} ${'đang phát trực tiếp'}`;
      } else {
        return `${sender.ID_userA.first_name || ''} ${sender.ID_userA.last_name || ''} ${'đang phát trực tiếp'}`;
      }
    }

    // 10. Thông báo mời chơi game 3 lá
    if (
      notification?.type === 'Mời chơi game 3 lá' &&
      notification?.ID_group
    ) {
      const { members, isPrivate } = notification.ID_group;
      if (isPrivate) {
        const sender = members.find(member => member._id !== user._id);
        return `${sender.first_name || ''} ${sender.last_name || ''
          } đang mời bạn chơi game 3 lá`;
      }
    }

    // 11. Thông báo bài viết của bạn đã được chia sẻ
    if (
      notification?.type === 'Bạn đã được chia sẻ bài viết của bạn' &&
      notification?.ID_post
    ) {
      return 'Bài viết của bạn đã được chia sẻ';
    }

    // 12. Thông báo có bình luận mới
    if (notification?.type === 'Đã bình luận vào bài viết của bạn' && notification?.ID_comment) {
      const { ID_user, content } = notification.ID_comment || {};
      return `${ID_user?.first_name || ''} ${ID_user?.last_name || ''
        } đã bình luận: ${content || 'Bạn có bình luận mới'}`;
    }

    // 13. Thông báo tài khoản bị khóa
    if (notification?.type === 'Tài khoản bị khóa') {
      return 'Tài khoản của bạn đã bị khóa';
    }

    // 15. Thông báo tài khoản bị khóa
    if (notification?.type === 'Tài khoản bị khóa') {
      return 'Tài khoản của bạn đã bị khóa';
    }

    // 16. Thông báo mặc định nếu không khớp loại nào
    return 'Bạn có một thông báo mới';
  };


  const getChannelId = (notificationType) => {
    switch (notificationType) {
      case 'Tin nhắn mới':
        return 'message-channel';

      case 'Lời mời kết bạn':
        return 'friend-request-channel';

      case 'Đã thành bạn bè của bạn':
        return 'friend-confirmation-channel';

      case 'Bạn đã được mời vào nhóm mới':
        return 'group-invite-channel';

      case 'Đã đăng story mới':
        return 'story-channel';

      case 'Đã đăng bài mới':
        return 'post-channel';

      case 'Bạn có 1 cuộc gọi đến':
      case 'Bạn có 1 cuộc gọi video đến':
        return 'call-channel';

      case 'Đang livestream':
        return 'livestream-channel';

      case 'Mời chơi game 3 lá':
        return 'game-invite-channel';

      case 'Bạn đã được chia sẻ bài viết của bạn':
        return 'post-share-channel';

      case 'Bình luận':
        return 'comment-channel';

      case 'Tài khoản bị khóa':
        return 'account-ban-channel';

      case 'Mời tham gia nhóm':
        return 'group-invite-channel';

      case 'Được tag vào bài viết':
        return 'tagged-post-channel';

      case 'Nhận được like trên bài viết':
        return 'post-like-channel';

      case 'Nhận được like trên bình luận':
        return 'comment-like-channel';

      case 'Có người chia sẻ bài viết':
        return 'post-share-channel';

      case 'Được nhắc đến trong bình luận':
        return 'mention-comment-channel';

      case 'Tham gia sự kiện mới':
        return 'event-channel';

      default:
        return 'default-channel';
    }
  };
  //chuyển trang khi ấn vào thông báo
  const navigateToScreen = (notification) => {
    if (!notification || !notification.type) {
      console.warn("⚠ Không có thông tin điều hướng từ thông báo");
      return;
    }

    switch (notification.type) {
      case 'Tin nhắn mới':
        navigation.navigate('Chat', { ID_group: notification?.ID_message?.ID_group?._id });
        break;

      case 'Lời mời kết bạn':
        navigation.navigate('Friend');
        break;

      case 'Đã thành bạn bè của bạn':
        navigation.navigate('ListFriend');
        break;

      case 'Bạn đã được mời vào nhóm mới':
        navigation.navigate('HomeChat');
        break;

      case 'Mời chơi game 3 lá':
        navigation.navigate('Chat', { ID_group: notification?.ID_group?._id });
        break;

      // case 'Đã đăng bài mới':
      //   navigation.navigate('PostDetailScreen', { postId: notification?.ID_post?._id });
      //   break;

      // case 'Đang livestream':
      //   navigation.navigate('LivestreamScreen', { livestreamId: notification?.ID_user?._id });
      //   break;

      // case 'Bình luận':
      //   navigation.navigate('CommentScreen', { postId: notification?.ID_comment?.postId });
      //   break;

      default:
        console.warn("⚠ Không tìm thấy màn hình phù hợp với loại thông báo:", notification.type);
        break;
    }
  };
  const showNotification = async (notification) => {
    try {
      const channelId = getChannelId(notification?.type);
      const isEnabled = await getNotificationPreference(channelId);

      if (!isEnabled) {
        console.log(`🔕 Thông báo bị tắt cho channel: ${channelId}`);
        return;
      }

      const formattedData = {};
      Object.keys(notification).forEach(key => {
        formattedData[key] = typeof notification[key] === 'string'
          ? notification[key]
          : JSON.stringify(notification[key]);
      });

      await notifee.displayNotification({
        title: notification?.title || 'Thông báo',
        body: generateNotificationContent(notification, user),
        data: formattedData,
        android: {
          channelId: getChannelId(notification?.type),
          smallIcon: 'ic_launcher',
        },
      });

    } catch (error) {
      console.error('❌ Lỗi khi hiển thị thông báo:', error);
    }
  };

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

        let notification;
        try {
          notification = JSON.parse(remoteMessage.data.notification);
        } catch (error) {
          console.error('❌ Lỗi khi parse JSON notification:', error);
          return;
        }

        console.log('✅ Đã parse notification:', notification);

        // Nếu thông báo là "Tài khoản bị khóa"
        if (notification?.type === 'Tài khoản bị khóa') {
          console.log('🔒 Tài khoản bị khóa - Đăng xuất và chuyển về trang login');
          onLogoutAndNavigate();
          return;
        }

        // Hiển thị thông báo cho các loại khác
        await showNotification(notification);

      } catch (error) {
        console.error('❌ Lỗi khi xử lý thông báo:', error);
      }
    });
    // Khi app chạy nền và người dùng nhấn vào thông báo
    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log('🔔 Người dùng nhấn vào thông báo khi app chạy nền:', remoteMessage);
        if (remoteMessage?.data?.notification) {
          let notification;
          try {
            notification = JSON.parse(remoteMessage.data.notification);
            if (notification?.type === 'Tài khoản bị khóa') {
              console.log('🔒 Tài khoản bị khóa khi nhấn thông báo - Đăng xuất');
              onLogout();
            }
          } catch (error) {
            console.error('❌ Lỗi khi parse JSON notification:', error);
          }
        }
      },
    );
    // Khi app bị kill và mở từ thông báo
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage?.data?.notification) {
        let notification;
        try {
          notification = JSON.parse(remoteMessage.data.notification);
          console.log('🔔 App được mở từ thông báo khi bị kill:', notification);
          if (notification?.type === 'Tài khoản bị khóa') {
            console.log('🔒 Tài khoản bị khóa khi mở app - Đăng xuất');
            onLogout();
          }
        } catch (error) {
          console.error('❌ Lỗi khi parse JSON notification:', error);
        }
      }
    });

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('🔔 Người dùng đã nhấn vào thông báo:', detail.notification);

        let notificationData = detail.notification?.data;

        Object.keys(notificationData).forEach(key => {
          try {
            notificationData[key] = JSON.parse(notificationData[key]); // ✅ Chuyển về object
          } catch (e) {
            // Nếu lỗi thì giữ nguyên, vì có thể nó đã là string
          }
        });

        navigateToScreen(notificationData);
      }
    });


    return () => {
      unsubscribeOpenedApp();
      unsubscribeNotifee();
      unsubscribeForeground();
      // initialNotification();
    };
  }, [onLogoutAndNavigate]);

  return isSplashVisible ? (
    <Welcome />
  ) : user ? (
    <HomeNavigation />
  ) : (
    <UserNavigation />
  );
};

export default AppNavigation;