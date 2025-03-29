import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import ZegoUIKitPrebuiltLiveStreaming, { AUDIENCE_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import Keycenter from './Keycenter';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AudienceScreen(props) {
  const { route } = props;
  const { liveID, userName, userID } = route.params;
  const navigation = useNavigation();
  const prebuiltRef = useRef();
  const [isHostOnline, setIsHostOnline] = useState(false);


  console.log("du lieu nguoi xem:" + "liveID: "+ liveID + "userName" + userName + "userID" + userID)
  useEffect(() => {
    const liveRef = database().ref(`/liveSessions/${liveID}`);
    liveRef.on('value', snapshot => {
      const sessionData = snapshot.val();
      console.log('Firebase data for liveID', liveID, ':', sessionData);
      if (sessionData && sessionData.isHostOnline) {
        setIsHostOnline(true);
      } else {
        setIsHostOnline(false);
      }
    });
    return () => liveRef.off();
  }, [liveID]);

  // Hiển thị dialog xác nhận thoát
  const handleExit = () => {
    Alert.alert(
      "Thoát phiên live",
      "Bạn có chắc chắn muốn thoát khỏi phiên live?",
      [
        {
          text: "Hủy",
          style: "cancel"
        },
        {
          text: "Thoát",
          onPress: () => navigation.goBack() // Điều hướng về Home
        }
      ]
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      // Xử lý khi người dùng nhấn nút back vật lý
      const backAction = () => {
        handleExit(); // Hiển thị dialog khi nhấn nút back vật lý
        return true; // Chặn hành động back mặc định
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove(); // Xóa listener khi component bị unmount hoặc mất focus
    }, [])
  );

  return (
    <View style={styles.container}>
      {/* Thanh Header bên ngoài màn hình live */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleExit} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phát trực tiếp</Text>
      </View>

      {/* Màn hình Live Streaming của Zego */}
      <View style={styles.liveContainer}>
        {isHostOnline ? (
          <ZegoUIKitPrebuiltLiveStreaming
            ref={prebuiltRef}
            userID={userID}
            appID={Keycenter.appID}
            appSign={Keycenter.appSign}
            userName={userName}
            liveID={liveID}
            config={AUDIENCE_DEFAULT_CONFIG}
          />
        ) : (
          <View style={styles.overlay}>
            <Text style={styles.liveEndedText}>Host chưa online hoặc phiên live đã kết thúc</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Màu nền cho phù hợp với giao diện live
  },
  header: {
    height: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Làm tối header nhưng không che toàn bộ
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    marginLeft: 10,
  },
  liveContainer: {
    flex: 1, 
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  liveEndedText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
