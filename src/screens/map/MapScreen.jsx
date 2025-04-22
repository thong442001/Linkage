import React, { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MapScreen(props) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const {ID_group, externalLocation, isGui,Avatar } = route.params || {};
  console.log('avatar', Avatar);

  // Hàm yêu cầu quyền truy cập vị trí
  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Quyền truy cập vị trí',
          message: 'Ứng dụng cần quyền để lấy vị trí của bạn.',
          buttonNeutral: 'Hỏi lại sau',
          buttonNegative: 'Hủy',
          buttonPositive: 'Cho phép',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn('Lỗi khi xin quyền:', err);
      return false;
    }
  };

  // Hàm lấy vị trí, ưu tiên Wi-Fi trước, sau đó thử GPS nếu thất bại
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError('Bạn cần cấp quyền truy cập vị trí để tiếp tục.');
      setLoading(false);
      return;
    }
  
    setLoading(true);
  
    const tryGetLocation = (highAccuracy, timeout) => {
      return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          position => resolve(position),
          error => reject(error),
          { enableHighAccuracy: highAccuracy, timeout: timeout, maximumAge: 10000 },
        );
      });
    };
  
    try {
      console.log('📡 Thử lấy vị trí bằng Wi-Fi/mạng di động...');
      const position = await tryGetLocation(false, 10000); // 10s timeout for Wi-Fi
      const { latitude, longitude, accuracy } = position.coords;
      console.log('📍 Vị trí từ Wi-Fi/mạng:', { latitude, longitude, accuracy });
      if (accuracy > 100) throw new Error('Độ chính xác thấp'); // Fallback if accuracy is poor
      setLocation({ latitude, longitude });
      setLoading(false);
    } catch (wifiError) {
      console.log('❌ Lỗi Wi-Fi/mạng:', wifiError);
      try {
        console.log('📍 Thử lấy vị trí bằng GPS...');
        const position = await tryGetLocation(true, 15000); // 15s timeout for GPS
        const { latitude, longitude, accuracy } = position.coords;
        console.log('📍 Vị trí từ GPS:', { latitude, longitude, accuracy });
        setLocation({ latitude, longitude });
        setLoading(false);
      } catch (gpsError) {
        console.log('❌ Lỗi GPS:', gpsError);
        setError('Không thể lấy vị trí. Vui lòng kiểm tra kết nối hoặc bật GPS.');
        setLoading(false);
      }
    }
  };
  // Lấy vị trí khi component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSendLocation = () => {
    if (location) {
      console.log('Vị trí đã gửi:', location);
      navigation.navigate('Chat', {
        ID_group:ID_group,
        locationMessage: `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      });
    } else {
      console.log('⚠️ Không có vị trí để gửi');
    }
  };

  // Hiển thị loading khi đang lấy vị trí
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Đang lấy vị trí...</Text>
      </View>
    );
  }

  // Hiển thị lỗi nếu không lấy được vị trí
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => {
          getCurrentLocation()
          navigation.goBack()
        }}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Hiển thị bản đồ khi có vị trí
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <MaterialIcons name="arrow-back-ios-new" size={15} color="white" />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: externalLocation ? externalLocation.latitude : location.latitude,
          longitude: externalLocation ? externalLocation.longitude : location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        <Marker
          coordinate={{
            latitude: externalLocation ? externalLocation.latitude : location.latitude,
            longitude: externalLocation ? externalLocation.longitude : location.longitude,
          }}
          title={externalLocation ? 'Vị trí được chia sẻ' : 'Vị trí của bạn'}
        >
           {/* Sử dụng hình ảnh avatar thay cho chấm đỏ mặc định */}
           <Image
            source={{ uri: Avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </Marker>

      </MapView>
      {isGui && (
        <TouchableOpacity style={styles.button} onPress={handleSendLocation}>
          <Text style={styles.buttonText}>Gửi vị trí</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    borderRadius: 30,
    zIndex: 10,
  },
  button: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#2196F3',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatar: {
    width: 50, // Kích thước avatar
    height: 50,
    borderRadius: 20, // Làm tròn để giống avatar
    borderWidth: 2,
    borderColor: '#fff', // Viền trắng để nổi bật
  },
});