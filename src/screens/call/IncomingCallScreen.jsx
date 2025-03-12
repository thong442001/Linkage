import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sound from 'react-native-sound';

const IncomingCallScreen = ({ route, navigation }) => {
  const { group, type } = route.params;
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const me = useSelector((state) => state.app.user);
  
  const ringtoneRef = useRef(null); // Thêm useRef

  useEffect(() => {
    if (!group || !me) return;

    if (group.isPrivate) {
      const otherUser = group.members?.find((user) => user._id !== me._id);
      setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người gọi');
      setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
    } else {
      setName(
        group.name ||
          group.members
            ?.filter((user) => user._id !== me._id)
            .map((user) => `${user.first_name} ${user.last_name}`)
            .join(', ')
      );
      setAvatar(group.avatar || 'https://example.com/default-group-avatar.png');
    }
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
  const handleAcceptCall = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current.stop();
      ringtoneRef.current.release();
    }

    navigation.navigate('CallPage', {
      ID_group: group._id,
      id_user: me._id,
      MyUsername: me.last_name,
      status: type,
      MyAvatar: me.avatar,
    });
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: avatar }} style={styles.backgroundImage} blurRadius={10} />
      <View style={styles.overlay}>
        <View style={styles.title}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.name}>{name || 'Người gọi'}</Text>
          <Text style={styles.callingText}>Đang gọi...</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleAcceptCall} style={styles.acceptButton}>
            <Ionicons name="call" size={40} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.declineButton}>
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

export default IncomingCallScreen;
