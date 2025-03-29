import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  GROUP_VIDEO_CALL_CONFIG
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { request, PERMISSIONS } from 'react-native-permissions';

const CallGroup = props => {
  const { route, navigation } = props;
  const { params } = route;
  console.log(params);
  useEffect(() => {
    // Yêu cầu quyền truy cập camera và microphone
    const requestPermissions = async () => {
      try {
        const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
        const microphonePermission = await request(PERMISSIONS.ANDROID.RECORD_AUDIO);

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
          appID={471819427}
          appSign={'e2e7c8d2bcaf34b0276a4a2f7d6e2064d82539e7c3c9fc940443f3fbd0ab732b'}
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
            onCallEnd: (callID, reason, duration) => {
              navigation.navigate("Chat", { ID_group: params.ID_group })
            },
          }}
        />
      </View>
    );
  } catch (error) {
    console.error('Error initializing ZegoUIKitPrebuiltCall: ', error);
  }
};

export default CallGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
