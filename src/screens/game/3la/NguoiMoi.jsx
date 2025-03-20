import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';
import { useSocket } from '../../context/socketContext';

const NguoiMoi = ({ route, navigation }) => {
  const { group, type } = route.params;
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const me = useSelector((state) => state.app.user);

  const ringtoneRef = useRef(null); // Thêm useRef

  const { socket } = useSocket();

  useEffect(() => {
    if (!group || !me) return;

    socket.emit("joinGroup", group?.id);

    if (group.isPrivate) {
      const otherUser = group.members?.find((user) => user._id !== me._id);
      setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người mời chơi game 3 lá');
      setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
    }

    socket.on("lang-nghe-chap-nhan-choi-game-3-la", ({ ID_group }) => {
      console.log(`Bạn đã được chấp nhận chơi game 3 lá`);
      handleAccept();
    });

    socket.on("lang-nghe-tu-choi-choi-game-3-la", ({ ID_group }) => {
      console.log(`Bạn đã bị từ chối chơi game 3 lá`);
      navigation.goBack();
    });

    return () => {
      socket.off("lang-nghe-chap-nhan-choi-game-3-la");
      socket.off("lang-nghe-tu-choi-choi-game-3-la");
    };

  }, [group, me]);

  // Phát nhạc chuông khi nhận cuộc gọi
  useEffect(() => {
    const ringtone = new Sound(
      'incoming_call',
      Sound.ANDROID_RESOURCE,
      (error) => {
        if (error) {
          console.log('Lỗi khi tải file nhạc:', error);
          return;
        }
        ringtone.setNumberOfLoops(-1);
        ringtone.play();
        ringtoneRef.current = ringtone; // Lưu vào useRef
      }
    );

    return () => {
      if (ringtoneRef.current) {
        ringtoneRef.current.stop();
        ringtoneRef.current.release();
      }
    };
  }, []);

  // Xử lý khi chấp nhận cuộc gọi
  const handleAccept = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
      ringtoneRef.current.release();
    }

    navigation.navigate('InGame3La');
  };

  // Xử lý khi chấp nhận cuộc gọi
  const handleCancel = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
      ringtoneRef.current.release();
    }
    const payload = {
      ID_group: group._id,
    }
    socket.emit('tu-choi-choi-game-3-la', payload);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.backgroundImage} blurRadius={10} />
      <View style={styles.overlay}>
        <View style={styles.title}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.name}>{name || 'Người mời chơi game 3 lá'}</Text>
          <Text style={styles.callingText}>Đang mời chơi game 3 lá...</Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity onPress={handleAcceptCall} style={styles.acceptButton}>
            <Ionicons name="call" size={40} color="#fff" />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() =>
              handleCancel()
            }
            style={styles.declineButton}>
            <Ionicons name="call" size={40} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 50,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  callingText: {
    color: '#ccc',
    fontSize: 18,
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  acceptButton: {
    backgroundColor: 'green',
    padding: 20,
    borderRadius: 50,
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 50,
  },
  title: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NguoiMoi;
