import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Switch } from 'react-native-gesture-handler';
import {
  setNotificationPreference,
  getNotificationPreference,
} from '../../noti/notificationHelper'; // Đảm bảo đường dẫn đúng
const { width, height } = Dimensions.get('window'); // Lấy kích thước màn hình
const SwitchNoti = () => {
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
  const toggleNotification = async (channelId) => {
    const newStatus = !preferences[channelId];
    setPreferences({ ...preferences, [channelId]: newStatus });
    await setNotificationPreference(channelId, newStatus);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Cài đặt thông báo</Text>
      {channels.map((item) => (
        <TouchableOpacity key={item.id} style={styles.optionContainer}>
          <Text style={styles.icon}>🔔</Text>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>Bật/tắt thông báo cho {item.name}</Text>
          </View>
          <Switch
            style={styles.switch}
            value={preferences[item.id]}
            onValueChange={() => toggleNotification(item.id)}
            trackColor={{ false: '#D9D9D9', true: '#81b0ff' }} // Đường dẫn: xám khi tắt, xanh khi bật
            thumbColor={'#0064E0'} // Nút: xanh khi bật
            ios_backgroundColor="#3e3e3e" // Nền iOS khi tắt
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
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginVertical: 6,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
    color: '#3498db',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    borderRadius: 5,
  },
});