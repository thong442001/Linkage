import { Image, StyleSheet, Text, View, ImageBackground, TouchableHighlight, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSocket } from '../../context/socketContext'; // socket context của bạn


const Ringing = ({ route, navigation }) => {
  const { group, type } = route.params;
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const me = useSelector((state) => state.app.user);
  const { socket } = useSocket();
  const ringtoneRef = useRef(null); // Thêm useRef
  console.log('canhphan', group);
  useEffect(() => {
    if (!group || !me) return;

    socket.emit("joinGroup", group._id);

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

    socket.on("lang-nghe-chap-nhan-call", () => {
      console.log('lang-nghe-chap-nhan-call');
      // onCall();
      navigation.replace('CallPage', {
        ID_group: group._id,
        id_user: me._id,
        MyUsername: me.last_name + ' ' + me.first_name,
        status: type,
        MyAvatar: me.avatar,
        members: group.members,
      });
    });

    socket.on("lang-nghe-tu-choi-call", () => {
      console.log(`lang-nghe-tu-choi-call`);
      navigation.goBack();
    });

    return () => {
      socket.off("lang-nghe-chap-nhan-call");
      socket.off("lang-nghe-tu-choi-call");
    };

  }, [group, me]);


  // Xử lý khi chấp nhận cuộc gọi
  const handlCancelCall = () => {
    socket.emit('tu-choi-call', { ID_group: group._id });
  };

  return (
    <ImageBackground
      source={{ uri: avatar }}
      style={styles.container}
      blurRadius={10}>
      <View style={styles.title}>
        <Image source={{ uri: avatar }} style={styles.groupAvatar} />
        <Text style={styles.groupName}>{name}</Text>
        <Text>Đang gọi...</Text>
      </View>
      <TouchableOpacity onPress={() => handlCancelCall()} style={styles.declineButton}>
        <Ionicons name="call" size={40} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Ringing;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  groupAvatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
  },
  groupName: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  title: {
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: 'red',
    padding: 20,
    borderRadius: 50,
  },
});
