import messaging from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native';
import { Alert } from 'react-native';

export async function requestPermissions() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    Alert.alert('Thông báo', 'Bạn cần cấp quyền để nhận thông báo');
  }

  // Kiểm tra quyền của notifee
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === 0) {
    Alert.alert('Thông báo', 'Ứng dụng chưa có quyền gửi thông báo.');
  }
}
