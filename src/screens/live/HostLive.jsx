import { SafeAreaView, StyleSheet, BackHandler, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ZegoUIKitPrebuiltLiveStreaming, { HOST_DEFAULT_CONFIG } from '@zegocloud/zego-uikit-prebuilt-live-streaming-rn';
import Keycenter from './Keycenter';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';
import { notiLiveStream } from '../../rtk/API';
const HostLive = (props) => {
  const { route, navigation } = props;
  const { userID, avatar, userName, liveID } = route.params;
  const dispatch =  useDispatch()
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
      };

      const notiData = {
        ID_livestream: liveID,
        ID_user: userID
      }

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
          console.log('phien live da duoc them vao database');
        })
        .catch(error => {
          console.error('loi:', error);
        });
    }
  };

  //hàm xử lí khi rời phiên live 
  const handleLeaveLive = () => {
    // Xóa phiên live khỏi Firebase khi thoát
    database()
      .ref(`/liveSessions/${liveID}`)
      .remove()
      .then(() => {
        console.log('Xóa phiên live thành công');
        navigation.goBack();
      })
      .catch(error => {
        console.error('Lỗi xóa live:', error);
      });
  };


  //xử lí sự kiện user dùng nút back trên thiết bị của họ
    useFocusEffect(
      React.useCallback(() => {

    const backAction = () => {
      Alert.alert(
        'Thoát livestream',
        'Bạn có chắc chắn muốn rời khỏi phiên live?',
        [
          {text: 'Hủy' , style: 'cancel'},
          {text: 'OK' , onPress: () => handleLeaveLive()}
        ]
      )
      return true; // Ngăn không cho thoát app ngay lập tức
    }
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
  
    return () => {
        backHandler.remove();
    }
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
          onLeaveLiveStreaming: handleLeaveLive
        }}
      />
    </SafeAreaView>
  );
};

export default HostLive;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
