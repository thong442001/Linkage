import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import {
  getAllReaction,
  checkBanUser,
  setNoti_token,
  getAllPostsInHome,
} from '../rtk/API';
import { requestPermissions } from '../screens/service/MyFirebaseMessagingService';
import { setReactions, setFcmToken, logout } from '../rtk/Reducer';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { useNavigation } from '@react-navigation/native';
import { navigate } from '../navigations/NavigationService';
import { getNotificationPreference } from '../noti/notificationHelper';
import { Linking, AppState } from 'react-native';
import { parseQueryString } from '../utils/deeplink/queryParser';

const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const navigation = useNavigation();
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [stories, setStories] = useState([]);
  const fcmToken = useSelector(state => state.app.fcmToken);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (user?._id) {
      callCheckBanUser();
      callGetAllReaction();
      callGetAllPostsInHome(user._id);
    }

    const handleAppStateChange = nextAppState => {
      if (nextAppState === 'active' && user?._id) {
        console.log('App is in foreground, re-running logic...');
        callCheckBanUser();
        callGetAllReaction();
        callGetAllPostsInHome(user._id);
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, [user?._id]);

  useEffect(() => {
    const handleDeepLink = async () => {
      try {
        const url = await Linking.getInitialURL();
        if (url) {
          const [path, queryString] = url.split('?');
          if (path.includes('post-chi-tiet')) {
            const params = parseQueryString(queryString);
            const ID_post = params.ID_post;
            if (ID_post) {
              navigation.navigate('PostDetail', {
                ID_post: ID_post,
                typeClick: 'comment',
              });
            } else {
              console.error('❌ Thiếu ID_post trong deeplink');
            }
          }
          if (path.includes('profile')) {
            const params = parseQueryString(queryString);
            const ID_user = params.ID_user;
            if (ID_user) {
              navigation.navigate('Profile', { _id: ID_user });
            } else {
              console.error('❌ Thiếu ID_user trong deeplink');
            }
          }
        }
      } catch (error) {
        console.error('❌ Lỗi khi xử lý deeplink:', error);
      }
    };

    handleDeepLink();
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const [path, queryString] = url.split('?');
      if (path.includes('post-chi-tiet')) {
        const params = parseQueryString(queryString);
        const ID_post = params.ID_post;
        if (ID_post) {
          navigation.navigate('PostDetail', {
            ID_post: ID_post,
            typeClick: 'comment',
          });
        } else {
          console.error('❌ Thiếu ID_post trong deeplink');
        }
      }
      if (path.includes('profile')) {
        const params = parseQueryString(queryString);
        const ID_user = params.ID_user;
        if (ID_user) {
          navigation.navigate('Profile', { _id: ID_user });
        } else {
          console.error('❌ Thiếu ID_user trong deeplink');
        }
      }
    });
    return () => subscription.remove();
  }, []);

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

  const callCheckBanUser = async () => {
    try {
      await dispatch(checkBanUser({ ID_user: user._id, token: token }))
        .unwrap()
        .then(response => {
          console.log('status : ' + response.status);
        })
        .catch(error => {
          console.log('Tài khoản đã bị khóa');
          onLogoutAndNavigate();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const callGetAllPostsInHome = async (ID_user, showLoading = false) => {
    try {
      await dispatch(
        getAllPostsInHome({ me: ID_user, token, timestamp: Date.now() }),
      )
        .unwrap()
        .then(response => {
          setStories(response.stories || []);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:', error);
          setStories([]);
        });
    } catch (error) {
      console.log('Error in callGetAllPostsInHome:', error);
    }
  };

  const onLogoutAndNavigate = () => {
    dispatch(setNoti_token({ ID_user: user._id, fcmToken: fcmToken }))
      .unwrap()
      .then(response => {
        console.log('✅ Đã gửi token thông báo trước khi logout:', response);
        dispatch(logout());
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch(error => {
        console.log('❌ Lỗi khi gửi token thông báo:', error);
        dispatch(logout());
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
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
        sound: 'ringtone',
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
      await notifee.createChannel({
        id: 'reaction-channel',
        name: 'Đã thả biểu cảm vào story của bạn',
        importance: AndroidImportance.HIGH,
      });
    }
  }

  const generateNotificationContent = (notification, user) => {
    if (!notification) {
      console.error('❌ Lỗi: notification không hợp lệ.');
      return 'Bạn có một thông báo mới';
    }
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
    if (notification?.type === 'Tin nhắn mới' && notification?.ID_message) {
      const { sender, content } = notification.ID_message;
      if (notification.ID_message.type === 'text') {
        return `${sender.first_name || ''} ${sender.last_name || ''}: ${content || 'Đã gửi một tin nhắn'
          }`;
      } else {
        return `${sender.first_name || ''} ${sender.last_name || ''
          }: Đã gửi một ảnh mới`;
      }
    }
    if (
      notification?.type === 'Bạn đã được mời vào nhóm mới' &&
      notification?.ID_group
    ) {
      return 'Bạn đã được mời vào nhóm mới';
    }
    if (notification?.type === 'Đã đăng story mới' && notification?.ID_post) {
      const { ID_user: postOwner, caption } = notification.ID_post;
      return `${postOwner?.first_name || ''} ${postOwner?.last_name || ''
        } đã đăng story mới ${caption ? `: ${caption}` : ''}`;
    }
    if (notification?.type === 'Đã đăng bài mới' && notification?.ID_post) {
      const { ID_user, content } = notification.ID_post;
      return ID_user
        ? `${ID_user.first_name || ''} ${ID_user.last_name || ''}: ${content || 'Đã đăng bài post mới'
        }`
        : 'Có một bài đăng mới';
    }
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
    if (
      notification?.type === 'Đang livestream' &&
      notification?.ID_user &&
      notification?.content
    ) {
      const sender = notification.ID_relationship;
      if (sender.ID_userA._id === user._id) {
        return `${sender.ID_userB.first_name || ''} ${sender.ID_userB.last_name || ''
          } đang phát trực tiếp`;
      } else {
        return `${sender.ID_userA.first_name || ''} ${sender.ID_userA.last_name || ''
          } đang phát trực tiếp`;
      }
    }
    if (notification?.type === 'Mời chơi game 3 lá' && notification?.ID_group) {
      const { members, isPrivate } = notification.ID_group;
      if (isPrivate) {
        const sender = members.find(member => member._id !== user._id);
        return `${sender.first_name || ''} ${sender.last_name || ''
          } đang mời bạn chơi game 3 lá`;
      }
    }
    if (
      notification?.type === 'Bạn đã được chia sẻ bài viết của bạn' &&
      notification?.ID_post
    ) {
      return 'Bài viết của bạn đã được chia sẻ';
    }
    if (
      notification?.type === 'Đã bình luận vào bài viết của bạn' &&
      notification?.ID_comment
    ) {
      const { ID_user, content } = notification.ID_comment || {};
      return `${ID_user?.first_name || ''} ${ID_user?.last_name || ''
        } đã bình luận: ${content || 'Bạn có bình luận mới'}`;
    }
    if (notification?.type === 'Tài khoản bị khóa') {
      return 'Tài khoản của bạn đã bị khóa';
    }
    if (notification?.type === 'Đã thả biểu cảm vào story của bạn') {
      const { ID_user } = notification.ID_post || {};
      return `${ID_user?.first_name || ''} ${ID_user?.last_name || ''
        } đã thả biểu cảm vào story của bạn`;
    }
    return 'Bạn có một thông báo mới';
  };

  const getChannelId = notificationType => {
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
      case 'Đã thả biểu cảm vào story của bạn':
        return 'reaction-channel';
      default:
        return 'default-channel';
    }
  };

  const navigateToScreen = notification => {
    if (!notification || !notification.type) {
      console.warn('⚠ Không có thông tin điều hướng từ thông báo');
      return;
    }

    switch (notification.type) {
      case 'Tin nhắn mới':
        navigation.navigate('Chat', {
          ID_group: notification?.ID_message?.ID_group?._id,
        });
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
      case 'Đã thả biểu cảm vào story của bạn':
      case 'Đã đăng story mới':
        console.log('Thông báo ID_post:', notification?.ID_post);
        const userStories = stories.find(
          story => story.user._id === notification?.ID_post?.ID_user?._id,
        );
        if (userStories) {
          navigation.navigate('StoryViewer', {
            StoryView: userStories,
            currentUserId: user._id,
          });
        } else {
          // Dự phòng: điều hướng đến Profile nếu không tìm thấy story
          console.warn('⚠ Không tìm thấy userStories, chuyển đến Profile');
          navigation.navigate('Profile', {
            _id: notification?.ID_post?.ID_user?._id,
          });
        }
        break;
      case 'Đã đăng bài mới':
        navigation.navigate('PostDetail', {
          ID_post: notification?.ID_post?._id,
        });
        break;
      case 'Bình luận':
        navigation.navigate('PostDetail', {
          ID_post: notification?.ID_comment?.postId,
        });
        break;
      default:
        console.warn(
          '⚠ Không tìm thấy màn hình phù hợp với loại thông báo:',
          notification.type,
        );
        break;
    }
  };

  const showNotification = async notification => {
    try {
      const channelId = getChannelId(notification?.type);
      const isEnabled = await getNotificationPreference(channelId);
      if (!isEnabled) {
        console.log(`🔕 Thông báo bị tắt cho channel: ${channelId}`);
        return;
      }
      const formattedData = {};
      Object.keys(notification).forEach(key => {
        formattedData[key] =
          typeof notification[key] === 'string'
            ? notification[key]
            : JSON.stringify(notification[key]);
      });
      await notifee.displayNotification({
        title: notification?.title || 'Thông báo',
        body: generateNotificationContent(notification, user),
        data: formattedData,
        android: {
          channelId: getChannelId(notification?.type),
          smallIcon: 'logo_linkage',
        },
      });
    } catch (error) {
      console.error('❌ Lỗi khi hiển thị thông báo:', error);
    }
  };

  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('🔥 FCM Token:', token);
        if (token) {
          dispatch(setFcmToken(token));
        }
      } catch (error) {
        console.log('❌ Lỗi khi lấy FCM Token:', error);
      }
    };
    getFCMToken();
  }, []);

  useEffect(() => {
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
        if (notification?.type === 'Tài khoản bị khóa') {
          console.log(
            '🔒 Tài khoản bị khóa - Đăng xuất và chuyển về trang login',
          );
          onLogoutAndNavigate();
          return;
        }
        await showNotification(notification);
      } catch (error) {
        console.error('❌ Lỗi khi xử lý thông báo:', error);
      }
    });

    const unsubscribeOpenedApp = messaging().onNotificationOpenedApp(
      remoteMessage => {
        console.log(
          '🔔 Người dùng nhấn vào thông báo khi app chạy nền:',
          remoteMessage,
        );
        if (remoteMessage?.data?.notification) {
          let notification;
          try {
            notification = JSON.parse(remoteMessage.data.notification);
            if (notification?.type === 'Tài khoản bị khóa') {
              console.log(
                '🔒 Tài khoản bị khóa khi nhấn thông báo - Đăng xuất',
              );
              onLogoutAndNavigate();
            } else {
              navigateToScreen(notification);
            }
          } catch (error) {
            console.error('❌ Lỗi khi parse JSON notification:', error);
          }
        }
      },
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage?.data?.notification) {
          let notification;
          try {
            notification = JSON.parse(remoteMessage.data.notification);
            console.log(
              '🔔 App được mở từ thông báo khi bị kill:',
              notification,
            );
            if (notification?.type === 'Tài khoản bị khóa') {
              console.log('🔒 Tài khoản bị khóa khi mở app - Đăng xuất');
              navigation.navigate('Login');
            } else {
              navigateToScreen(notification);
            }
          } catch (error) {
            console.error('❌ Lỗi khi parse JSON notification:', error);
          }
        }
      });

    const unsubscribeNotifee = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log(
          '🔔 Người dùng đã nhấn vào thông báo:',
          detail.notification,
        );
        let notificationData = detail.notification?.data;
        Object.keys(notificationData).forEach(key => {
          try {
            notificationData[key] = JSON.parse(notificationData[key]);
          } catch (e) {
            // Giữ nguyên nếu không parse được
          }
        });
        navigateToScreen(notificationData);
      }
    });

    return () => {
      unsubscribeOpenedApp();
      unsubscribeNotifee();
      unsubscribeForeground();
    };
  }, [onLogoutAndNavigate, stories]); // Thêm stories vào dependencies

  return isSplashVisible ? (
    <Welcome />
  ) : user ? (
    <HomeNavigation />
  ) : (
    <UserNavigation />
  );
};

export default AppNavigation;
