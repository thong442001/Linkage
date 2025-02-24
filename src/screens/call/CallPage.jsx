import {StyleSheet, Text, View,Image} from 'react-native';
import React, { useEffect,useState } from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { request, PERMISSIONS } from 'react-native-permissions';

const CallPage = props => {
  const {route, navigation} = props;
  const {params} = route;
console.log("avatar",params.MyAvatar);
  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const [cameraPermission, microphonePermission] = await Promise.all([
          request(PERMISSIONS.ANDROID.CAMERA),
          request(PERMISSIONS.ANDROID.RECORD_AUDIO)
        ]);
        
        if (cameraPermission === 'granted' && microphonePermission === 'granted') {
          console.log("Permissions granted");
        } else {
          console.error("Permissions not granted");
        }
      } catch (error) {
        console.error("Error requesting permissions: ", error);
      }
    };

    requestPermissions();
  }, []);

  try {
    return (
      <View style={styles.container}>
        <ZegoUIKitPrebuiltCall
          appID={1765636844}
          appSign={'af8071fe64fe73a7ae9dc9a4abb0787739588c433b2598d10804d983d65f319e'}
          userID={params?.id_user}
          userName={params?.MyUsername}
          callID={params?.ID_group}
          config={{
            // Bật camera & mic khi vào phòng
            turnOnCameraWhenJoining: params?.status,
            turnOnMicrophoneWhenJoining: true,
            useSpeakerWhenJoining:  params?.status,
        
            // Hiển thị avatar khi tắt camera
            showUserAvatarInAudioMode: true,
        
            // Hiển thị tên người dùng trên video
            showUserNameOnVideo: true,
        
            // Cấu hình thanh điều khiển
            topMenuBarConfig: {
              isVisible: true, // Hiển thị thanh menu trên
            },
            bottomMenuBarConfig: {
              isVisible: true, // Hiển thị thanh menu dưới
            },
            avatarBuilder: ({ userInfo }) => {
              // Kiểm tra nếu userID khớp với người dùng hiện tại
              if (userInfo.userID === params?.id_user) {
                return (
                  <View style={{ width: '100%', height: '100%' }}>
                    <Image
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                      source={{ uri: params?.MyAvatar }}
                    />
                  </View>
                );
              }
              // Trả về null nếu không có avatar tùy chỉnh
              return null;
            },
        
            // Khi cuộc gọi kết thúc, quay về màn hình chat
            onCallEnd: (callID, reason, duration) => {
              navigation.navigate("Chat", { ID_group: params.ID_group });
            },
          }}
        />
      </View>
    );
  } catch (error) {
    console.error('Error initializing ZegoUIKitPrebuiltCall: ', error);
    return null;
  }
};

export default CallPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});