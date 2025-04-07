import { SafeAreaView, StyleSheet, BackHandler, Alert, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import Keycenter from './Keycenter';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';
import { notiLiveStream } from '../../rtk/API';

const { width, height } = Dimensions.get('window');

const HostLive = (props) => {
  const { route, navigation } = props;
  const { userID, avatar, userName, liveID } = route.params;
  const dispatch = useDispatch();
  console.log("Avatar URL:", avatar);
  console.log("User ID:", userID);

  // Hàm xử lý khi bấm live
  const handleStartLive = () => {
    if (liveID) {
      const liveData = {
        userID: userID,
        userName: userName,
        liveID: liveID,
        avatar: avatar,
        isHostOnline: true,
      };

      const notiData = {
        ID_livestream: liveID,
        ID_user: userID,
      };

      dispatch(notiLiveStream(notiData))
        .unwrap()
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });

      database()
        .ref(`/liveSessions/${liveID}`)
        .set(liveData)
        .then(() => {
          console.log('Phiên live đã được thêm vào database');
        })
        .catch((error) => {
          console.error('Lỗi:', error);
        });
    }
  };

  // Hàm xử lý khi rời phiên live
  const handleLeaveLive = () => {
    database()
      .ref(`/liveSessions/${liveID}`)
      .remove()
      .then(() => {
        console.log('Xóa phiên live thành công');
        navigation.goBack();
      })
      .catch((error) => {
        console.error('Lỗi xóa live:', error);
      });
  };

  // Xử lý sự kiện khi người dùng bấm nút back trên thiết bị
  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        Alert.alert(
          'Thoát livestream',
          'Bạn có chắc chắn muốn rời khỏi phiên live?',
          [
            { text: 'Hủy', style: 'cancel' },
            { text: 'OK', onPress: () => handleLeaveLive() },
          ]
        );
        return true; // Ngăn không cho thoát app ngay lập tức
      };
      const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

      return () => {
        backHandler.remove();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ZegoUIKitPrebuiltLiveStreaming
        appID={Keycenter.appID}
        appSign={Keycenter.appSign}
        userID={userID}
        liveID={liveID}
        userName={userName}
        config={{
          ...HOST_DEFAULT_CONFIG,
          onStartLiveButtonPressed: handleStartLive,
          onLeaveLiveStreaming: handleLeaveLive,
        }}
      />
    </SafeAreaView>
  );
};

export default HostLive;

// StyleSheet với kích thước tương đối dựa trên Dimensions
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width, 
    height: height, 
  },
  startButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.06, 
    borderRadius: width * 0.02, 
    alignSelf: 'center',
    marginBottom: height * 0.03,
    width: width * 0.5, 
  },
  startButtonText: {
    color: '#fff',
    fontSize: width * 0.04, 
    fontWeight: 'bold',
    textAlign: 'center',
  },
});