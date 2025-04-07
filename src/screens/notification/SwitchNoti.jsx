import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import {
  setNotificationPreference,
  getNotificationPreference,
} from '../../noti/notificationHelper'; // Đảm bảo đường dẫn đúng
import Icon from 'react-native-vector-icons/FontAwesome';

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

const SwitchNoti = () => {
  const navigation = useNavigation();
  const [preferences, setPreferences] = useState({});

  // Danh sách các kênh thông báo
  const channels = [
    { id: 'message-channel', name: 'Tắt thông báo tin nhắn' },
    { id: 'call-channel', name: 'Tắt thông báo cuộc gọi' },
    { id: 'post-channel', name: 'Tắt thông báo bài viết mới của bạn bè' },
  ];

  // Tải trạng thái thông báo khi component được mount
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

  // Hàm bật/tắt thông báo
  const toggleNotification = async channelId => {
    const newStatus = !preferences[channelId];
    setPreferences({ ...preferences, [channelId]: newStatus });
    await setNotificationPreference(channelId, newStatus);
  };

  return (
    <View style={styles.container}>
      {/* Header với nút Back và tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="angle-left"
            size={width * 0.08}
            color="black"
            style={styles.iconBack}
          />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cài đặt thông báo</Text>
      </View>

      {/* Danh sách tùy chọn thông báo */}
      {channels.map(item => (
        <TouchableOpacity key={item.id} style={styles.optionContainer}>
          <Text style={styles.icon}>🔔</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>
              Bật/tắt thông báo cho {item.name}
            </Text>
          </View>
          <Switch
            style={styles.switch}
            value={preferences[item.id]}
            onValueChange={() => toggleNotification(item.id)}
            trackColor={{ false: '#D9D9D9', true: '#81b0ff' }}
            thumbColor={'#0064E0'}
            ios_backgroundColor="#3e3e3e"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SwitchNoti;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.03,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: height * 0.04,
  },
  iconBack: {
    padding: width * 0.02,
  },
  headerText: {
    fontSize: width * 0.065,
    fontWeight: '700',
    color: '#1E1E1E',
    marginLeft: width * 0.03,
  },
  optionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20, // Bo góc mềm mại hơn
    marginVertical: height * 0.015,
    paddingVertical: height * 0.025, // Tăng padding dọc để nút cao hơn
    paddingHorizontal: width * 0.05, // Padding ngang rộng hơn
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    borderWidth: 1, // Thêm viền nhẹ
    borderColor: '#E8ECEF', // Màu viền nhạt
  },
  icon: {
    fontSize: width * 0.07, // Tăng kích thước icon
    marginRight: width * 0.04,
    color: '#007BFF', // Màu xanh nổi bật
    backgroundColor: '#E6F0FF', // Nền nhạt phía sau icon
    padding: width * 0.02, // Thêm padding cho icon
    borderRadius: 10, // Bo tròn nền icon
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', // Căn giữa nội dung văn bản
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#2C3E50', // Màu chữ đậm và hiện đại hơn
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#7F8C8D', // Màu xám nhẹ nhàng
    marginTop: height * 0.005,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }], // Tăng kích thước switch
    marginLeft: width * 0.03, // Khoảng cách với văn bản
    trackColor: { false: '#BDC3C7', true: '#3498DB' }, // Màu track tinh tế hơn
  },
});