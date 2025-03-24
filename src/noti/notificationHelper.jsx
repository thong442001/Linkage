import AsyncStorage from '@react-native-async-storage/async-storage';

// Lưu trạng thái thông báo
const setNotificationPreference = async (channelId, isEnabled) => {
  try {
    const preferences = await AsyncStorage.getItem('notificationPreferences');
    const updatedPreferences = preferences ? JSON.parse(preferences) : {};
    updatedPreferences[channelId] = isEnabled;
    await AsyncStorage.setItem('notificationPreferences', JSON.stringify(updatedPreferences));
  } catch (error) {
    console.error('Lỗi khi lưu trạng thái thông báo:', error);
  }
};

// Lấy trạng thái thông báo của một channel
const getNotificationPreference = async (channelId) => {
  try {
    const preferences = await AsyncStorage.getItem('notificationPreferences');
    const parsedPreferences = preferences ? JSON.parse(preferences) : {};
    return parsedPreferences[channelId] ?? true; // Mặc định là bật
  } catch (error) {
    console.error('Lỗi khi lấy trạng thái thông báo:', error);
    return true;
  }
};

export { setNotificationPreference, getNotificationPreference };
