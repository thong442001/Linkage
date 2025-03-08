import React, { useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import ZegoUIKitPrebuiltLiveStreaming, { AUDIENCE_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import Keycenter from './Keycenter';
import { useNavigation } from '@react-navigation/native';

export default function AudienceScreen(props) {
  const { route } = props;
  const { params } = route;
  const { liveID, userName, userID } = route.params;
  const navigation = useNavigation();
  const prebuiltRef = useRef();

  
  
  return (
    <View style={styles.container}>
      <ZegoUIKitPrebuiltLiveStreaming
        ref={prebuiltRef}
        userID={userID}
        appID={Keycenter.appID}
        appSign={Keycenter.appSign}
        userName={userName}
        liveID={liveID}
        config={{
          ...AUDIENCE_DEFAULT_CONFIG,
          onLeaveLiveStreaming: () => {
            navigation.navigate('TabHome');
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});