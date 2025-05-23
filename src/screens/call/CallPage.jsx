import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState,useRef } from 'react';
import ZegoUIKitPrebuiltCallService, {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  GROUP_VIDEO_CALL_CONFIG,
  GROUP_VOICE_CALL_CONFIG,
  ZegoMenuBarButtonName,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import KeyCenter from "./KeyCenter";
const CallPage = props => {
  const { route, navigation } = props;
  const { params } = route;
  const prebuiltRef = useRef();
console.log('params', params);
  const callConfig =
    params?.members?.length > 2
      ? params.status === true
        ? GROUP_VIDEO_CALL_CONFIG
        : GROUP_VOICE_CALL_CONFIG
      : params.status === true
      ? ONE_ON_ONE_VIDEO_CALL_CONFIG
      : ONE_ON_ONE_VOICE_CALL_CONFIG;
    return (
      <View style={styles.container}>
        <ZegoUIKitPrebuiltCall
                ref={prebuiltRef}
                appID={KeyCenter.appID}
                appSign={KeyCenter.appSign}
                userID={params?.id_user}
                userName={params?.MyUsername}
                callID={params?.ID_group}
                
                config={{
                    // ...ONE_ON_ONE_VOICE_CALL_CONFIG,
                    ...callConfig,
                    avatarBuilder: ({userInfo}) => {
                      // Chỉ hiển thị avatar cho cuộc gọi 1-1 (video hoặc voice)
                    if (
                      callConfig === ONE_ON_ONE_VIDEO_CALL_CONFIG ||
                      callConfig === ONE_ON_ONE_VOICE_CALL_CONFIG
                    ) {
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
                    // Trả về null nếu không phải cuộc gọi 1-1 (nhóm)
                    return null;
                    },
                    onCallEnd: (callID, reason, duration) => {
                        console.log('########CallPage onCallEnd');
                        navigation.replace("Chat", { ID_group: params.ID_group })
                    },
                    timingConfig: {
                      isDurationVisible: true,
                      onDurationUpdate: (duration) => {
                        console.log('########CallWithInvitation onDurationUpdate', duration);
                        if (duration === 10 * 60) {
                          ZegoUIKitPrebuiltCallService.hangUp();
                        }
                      }
                    },
                    topMenuBarConfig: {
                        buttons: [
                            ZegoMenuBarButtonName.minimizingButton,
                        ],
                    },
                    onWindowMinimized: () => {
                        console.log('[Demo]CallPage onWindowMinimized');
                        navigation.navigate("Chat", { ID_group: params.ID_group })
                    },
                    onWindowMaximized: () => {
                        console.log('[Demo]CallPage onWindowMaximized');
                        props.navigation.navigate('CallPage', {
                            userID: userID,
                            userName: userName,
                            callID: 'rn12345678',
                        });
                    },
                }}
            />
      </View>
    );
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