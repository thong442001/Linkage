import {StyleSheet, Text, View} from 'react-native';
import React, { useEffect } from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  GROUP_VIDEO_CALL_CONFIG
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { request, PERMISSIONS } from 'react-native-permissions';

const callGroup = props => {
  const {route, navigation} = props;
  const {params} = route;
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
          appID={1765636844}
          appSign={'af8071fe64fe73a7ae9dc9a4abb0787739588c433b2598d10804d983d65f319e'}
          userID={params?.id_user}
          userName={params?.MyUsername}
          callID={params?.ID_group}
          config={{
            ...GROUP_VIDEO_CALL_CONFIG,
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

export default callGroup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
});
