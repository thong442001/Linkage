import {Image, StyleSheet, Text, View, ImageBackground, TouchableHighlight, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getGroupID} from '../../rtk/API';
import {useDispatch, useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Ringing = props => {
  const {route, navigation} = props;
  const {params} = route;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [group, setGroup] = useState(null);
  const [groupAvatar, setGroupAvatar] = useState(null); // Ảnh đại diện nhóm
  const [groupName, setGroupName] = useState(null); // Tên nhóm
  const [ID_user, setID_user] = useState(null);
  const [myUsername, setmyUsername] = useState(null);
  const [myAvatar, setmyAvatar] = useState(null);
  //hàm vào cuộc gọi
    const onCall =() => {
        if (!group) return;
        if (group.isPrivate ==true){
            navigation.navigate("CallPage", { ID_group: group._id, id_user: ID_user, MyUsername: myUsername, status: params.status, MyAvatar: myAvatar });
        }else{
            navigation.navigate("CallGroup", { ID_group: group._id, id_user: ID_user, MyUsername: myUsername, status: params.status, MyAvatar: myAvatar });
        }
    };
  useEffect(() => {
    getInforGroup(params.ID_group);
  }, [navigation]);

  //infor groupF
  const getInforGroup = async ID_group => {
    try {
      await dispatch(getGroupID({ID_group: ID_group, token: token}))
        .unwrap()
        .then(response => {
          //console.log("thong show data: ", response);
          setGroup(response.group);
          if (response.group.isPrivate == true) {
            // lấy tên của mình
            const myUser = response.group.members.find(
              user => user._id === me._id,
            );
            //console.log(response.group.members);
            if (myUser) {
              setID_user(myUser._id);
              setmyUsername(myUser.first_name + ' ' + myUser.last_name);
              setmyAvatar(myUser.avatar);
            } else {
              console.log('⚠️ Không tìm thấy người dùng');
            }
            // chat private
            const otherUser = response.group.members.find(
              user => user._id !== me._id,
            );

            if (otherUser) {
              setGroupName(otherUser.first_name + ' ' + otherUser.last_name);
              //setGroupName(otherUser.displayName);

              setGroupAvatar(otherUser.avatar);
            } else {
              console.log('⚠️ Không tìm thấy thành viên khác trong nhóm!');
            }
          } else {
            // group
            // lấy tên của mình
            const myUser = response.group.members.find(
              user => user._id === me._id,
            );
            if (myUser) {
              setID_user(myUser._id);
              setmyUsername(myUser.first_name + ' ' + myUser.last_name);
              setmyAvatar(myUser.avatar);
            } else {
              console.log('⚠️ Không tìm thấy người dùng');
            }
            if (response.group.avatar == null) {
              setGroupAvatar(
                'https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Anlene%2Flogo.png?alt=media&token=f98a4e03-1a8e-4a78-8d0e-c952b7cf94b4',
              );
            } else {
              setGroupAvatar(response.group.avatar);
            }
            if (response.group.name == null) {
              const names = response.group.members
                .filter(user => user._id !== me._id)
                .map(user => `${user.first_name} ${user.last_name}`)
                .join(', ');
              // Cập nhật state một lần duy nhất
              setGroupName(names);
            } else {
              setGroupName(response.group.name);
            }
          }
        })
        .catch(error => {
          console.log('Error1:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      source={{uri: myAvatar}}
      style={styles.container}
      blurRadius={10}>
      <View style={styles.title}>
        <Image source={{uri: groupAvatar}} style={styles.groupAvatar} />
        <Text style={styles.groupName}>{groupName}</Text>
        <Text>Đang gọi...</Text>
      </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.declineButton}>
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
