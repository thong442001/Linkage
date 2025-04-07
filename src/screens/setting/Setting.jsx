import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../rtk/Reducer';
import QRCode from 'react-native-qrcode-svg';
import { setNoti_token } from '../../rtk/API';
import {
  setNotificationPreference,
  getNotificationPreference,
} from '../../noti/notificationHelper';
import { FlatList, Switch } from 'react-native-gesture-handler';
import { useBottomSheet } from '../../context/BottomSheetContext'; // Điều chỉnh đường dẫn import

const { width, height } = Dimensions.get('window');

const Setting = props => {
  const { route, navigation } = props;
  const { params } = route;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const fcmToken = useSelector(state => state.app.fcmToken);
  const [qrVisible, setQrVisible] = useState(false); // 🔥 State để hiển thị modal QR

  const [preferences, setPreferences] = useState({});
  const [showNotificationList, setShowNotificationList] = useState(false); // Trạng thái mở/đóng danh sách thông báo

  const onLogout = () => {
    dispatch(setNoti_token({ ID_user: me._id, fcmToken: fcmToken }))
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

  const channels = [
    { id: 'message-channel', name: 'Tắt thông báo tin nhắn' },
    // { id: 'friend-request-channel', name: 'Lời mời kết bạn' },
    { id: 'call-channel', name: 'Tắt thông báo cuộc gọi' },
    // { id: 'livestream-channel', name: 'Livestream' },
    // { id: 'comment-channel', name: 'Đã bình luận vào bài viết của bạn' },
    { id: 'post-channel', name: 'Tắt thông báo bài viết mới của bạn bè' },
  ];

  const settingsOptions = [
    {
      id: '1',
      title: 'Thay đổi tên',
      screen: 'ChangeDisplayName',
      icon: 'person',
    },
    {
      id: '2',
      title: 'Thay đổi mật khẩu',
      screen: 'ChangePassWord',
      icon: 'lock-closed',
    },
    { id: '3', title: 'Thùng rác', screen: 'Trash', icon: 'trash' },
    { id: '4', title: 'Game', screen: 'pokemon', icon: 'game-controller' },
    {
      id: '5',
      title: 'Thông báo',
      screen: 'SwitchNoti',
      icon: 'notifications',
    },
    {
      id: '6',
      title: 'Đăng xuất',
      action: onLogout,
      icon: 'exit-outline',
      color: 'red',
    },

  ];

  //tắt thông báo
  useEffect(() => {
    const loadPreferences = async () => {
      const prefs = {};
      for (const channel of channels) {
        prefs[channel.id] = await getNotificationPreference(channel.id);
      }
      setPreferences(prefs);
    };
    loadPreferences();
  }, []);

  const toggleNotification = async channelId => {
    const newStatus = !preferences[channelId];
    setPreferences({ ...preferences, [channelId]: newStatus });
    await setNotificationPreference(channelId, newStatus);
    setPreferences({ ...preferences, [channelId]: newStatus }); // Cập nhật state sau khi lưu
  };

  // const toggleNotificationList = () => {
  //   if (showNotificationList) {
  //     closeBottomSheet(); // Đóng Bottom Sheet
  //     setShowNotificationList(false);
  //   } else {
  //     openBottomSheet(70, renderNotificationContent(), () => setShowNotificationList(false)); // Mở Bottom Sheet với chiều cao 70%
  //     setShowNotificationList(true);
  //   }
  // };

  // const renderNotificationContent = () => (
  //   <View>
  //     {channels.map((item) => (
  //       <TouchableOpacity key={item.id} style={styles.optionContainer}>
  //         <Text style={styles.icon}>🔔</Text>
  //         <View style={styles.textContainer}>
  //           <Text style={styles.title}>{item.name}</Text>
  //           <Text style={styles.subtitle}>
  //             Bật/tắt thông báo cho {item.name}
  //           </Text>
  //         </View>
  //         <Switch
  //           style={styles.switch}
  //           value={preferences[item.id]}
  //           onValueChange={() => toggleNotification(item.id)}
  //           trackColor={{ false: '#D9D9D9', true: '#81b0ff' }} // Màu đường dẫn: xám khi tắt, xanh khi bật
  //           thumbColor={'#0064E0'} // Màu nút: xanh khi bật
  //           ios_backgroundColor="#3e3e3e" // Màu nền trên iOS khi tắt
  //         />
  //       </TouchableOpacity>
  //     ))}
  //   </View>
  // );

  const Option = ({ icon, title, subtitle, color = 'black' }) => (
    <View style={styles.option}>
      <Icon name={icon} size={20} color={color} />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.textSetting}>Cài đặt</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.profile}>
            <Pressable>
              <Image
                source={{
                  uri: me.avatar,
                }}
                style={styles.avatar}
              />
            </Pressable>
            <View style={styles.profileInfo}>
              <Text style={styles.name}>
                {me.first_name} {me.last_name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setQrVisible(true)}>
              <Icon name="qr-code-outline" size={22} color="black" />
            </TouchableOpacity>
            {/* 🔥 Modal hiển thị QR Code */}
            <Modal
              visible={qrVisible}
              transparent
              onRequestClose={() => setQrVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Mã QR của bạn</Text>
                  <QRCode value={`chatapp://chat/${me._id}`} size={200} />
                  <TouchableOpacity
                    onPress={() => setQrVisible(false)}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
  

      {/* Danh sách các tùy chọn cài đặt khác */}
      {settingsOptions.map((item) => (
        <TouchableOpacity
          key={item.id}
          onPress={() =>
            item.screen ? navigation.navigate(item.screen) : item.action()
          }
        >
          <Option
            icon={item.icon}
            title={item.title}
            color={item.color}
          />
        </TouchableOpacity>
      ))}
    </View>
        {/* canhphan */}
      </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  header: {
    alignItems: 'center',
    padding: height * 0.06,
    backgroundColor: '#E4E4E4',
  },
  body: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    flex: 1,
  },
  textSetting: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'black',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: 'white',
    marginVertical: height * 0.01,
    borderRadius: width * 0.03,
  },
  optionIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: width * 0.04,
  },
  optionTitle: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  optionTitle1: {
    color: 'red',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    color: 'gray',
    fontSize: width * 0.03,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: width * 0.05,
    borderBottomRightRadius: width * 0.05,
    padding: width * 0.03,
    marginVertical: height * 0.02,
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  profileInfo: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  name: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  status: {
    color: 'gray',
    fontSize: width * 0.035,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  closeButtonText: { color: 'white', fontSize: 16 },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  text: { fontSize: 16 },
  optionContainer: {
    backgroundColor: '#ffffff', // Màu nền trắng
    borderRadius: 10, // Bo góc
    marginVertical: 6, // Khoảng cách giữa các mục
    marginHorizontal: 15, // Lề hai bên
    padding: 12, // Khoảng cách nội dung bên trong
    flexDirection: 'row', // Hiển thị ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    shadowColor: '#000', // Đổ bóng
    shadowOffset: { width: 0, height: 2 }, // Vị trí bóng
    shadowOpacity: 0.1, // Độ trong suốt của bóng
    shadowRadius: 4, // Độ mờ của bóng
    elevation: 3, // Bóng cho Android
  },
  icon: {
    fontSize: 24, // Kích thước icon lớn hơn
    marginRight: 12, // Khoảng cách với text
    color: '#3498db', // Màu xanh dương
  },
  textContainer: {
    flex: 1, // Cho phép text mở rộng
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold', // In đậm
    color: '#333', // Màu chữ tối hơn
  },
  subtitle: {
    fontSize: 14,
    color: '#777', // Màu chữ xám nhạt hơn
    marginTop: 2, // Khoảng cách với title
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }], // Tăng kích thước Switch
  },
  switchON: {
    color: 'blue'
  }
});
