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
    paddingTop: height * 0.03, // Giảm paddingTop để gần trên cùng hơn
  },
  header: {
    flexDirection: 'row', // Xếp nút Back và tiêu đề ngang nhau
    alignItems: 'center',
    justifyContent: 'flex-start', // Căn trái để nút Back sát mép
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
    marginLeft: width * 0.03, // Khoảng cách giữa nút Back và tiêu đề
  },
  optionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginVertical: height * 0.015,
    padding: width * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    fontSize: width * 0.065,
    marginRight: width * 0.04,
    color: '#007BFF',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: '600',
    color: '#333',
  },
  subtitle: {
    fontSize: width * 0.035,
    color: '#999',
    marginTop: height * 0.005,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
});