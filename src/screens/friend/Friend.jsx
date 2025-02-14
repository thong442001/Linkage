import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ItemFriend from '../../components/items/ItemFriend';
import ItemNewFriend from '../../components/items/ItemNewFriend';
import styles from '../../styles/screens/friend/FriendNoti';
import FriendRequestItem from '../../components/items/FriendRequestItem';

import {useDispatch, useSelector} from 'react-redux';
import {
  getAllLoiMoiKetBan,
  chapNhanLoiMoiKetBan,
  huyLoiMoiKetBan,
} from '../../rtk/API';
import {Snackbar} from 'react-native-paper'; // thông báo (ios and android)

const Friend = props => {
  const {route, navigation} = props;
  const {params} = route;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [relationships, setRelationships] = useState([]);
  // dialog reLoad
  const [dialogReLoad, setDialogreload] = useState(false);

  useEffect(() => {
    // Call API khi lần đầu vào trang
    callGetAllLoiMoiKetBan();

    // Thêm listener để gọi lại API khi quay lại trang
    const focusListener = navigation.addListener('focus', () => {
      callGetAllLoiMoiKetBan();
    });

    // Cleanup listener khi component bị unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  //getAllLoiMoiKetBan
  const callGetAllLoiMoiKetBan = async () => {
    try {
      await dispatch(getAllLoiMoiKetBan({me: me._id, token: token}))
        .unwrap()
        .then(response => {
          //console.log(response);
          setRelationships(response.relationships);
          console.log(response.relationships);
        })
        .catch(error => {
          console.log('Error2 getAllLoiMoiKetBan:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //chapNhanLoiMoiKetBan
  const callChapNhanLoiMoiKetBan = async ID_relationship => {
    try {
      const paramsAPI = {
        ID_relationship: ID_relationship,
      };
      await dispatch(chapNhanLoiMoiKetBan(paramsAPI))
        .unwrap()
        .then(response => {
          console.log(response?.message);
          callGetAllLoiMoiKetBan();
        })
        .catch(error => {
          console.log('Error2 callChapNhanLoiMoiKetBan:', error);
          setDialogreload(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  //huyLoiMoiKetBan
  const callHuyLoiMoiKetBan = async ID_relationship => {
    try {
      const paramsAPI = {
        ID_relationship: ID_relationship,
      };
      await dispatch(huyLoiMoiKetBan(paramsAPI))
        .unwrap()
        .then(response => {
          console.log(response?.message);
          callGetAllLoiMoiKetBan();
        })
        .catch(error => {
          console.log('Error2 callHuyLoiMoiKetBan:', error);
          setDialogreload(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị Snackbar dưới cùng màn hình */}
      <Snackbar
        visible={dialogReLoad}
        onDismiss={() => {
          callGetAllLoiMoiKetBan();
          setDialogreload(false);
        }}
        duration={1000}>
        làm mới!
      </Snackbar>
      <View style={styles.HeaderWrap}>
        <Text style={[styles.title, {color: 'black'}]}> Bạn bè</Text>
        <Icon
          style={styles.findButton}
          name="search"
          size={25}
          color={'black'}
        />
      </View>
      <View style={styles.goiYWrap}>
        <Text
          style={[styles.goiY, {color: 'black'}, {backgroundColor: '#e2e5ec'}]}>
          {' '}
          Gợi ý
        </Text>
        <Text
          style={[styles.goiY, {color: 'black'}, {backgroundColor: '#e2e5ec'}]}>
          {' '}
          Bạn bè
        </Text>
      </View>

      <View style={styles.titleWrap}>
        <Text style={[styles.title2, {color: 'black'}]}> Lời mời kết bạn</Text>
      </View>

      {/* ALl Lời mời kết bạn */}
      <View>
        <FlatList
          data={relationships}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <FriendRequestItem
              data={item}
              me={me._id}
              onXacNhan={callChapNhanLoiMoiKetBan}
              onXoa={callHuyLoiMoiKetBan}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Friend;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     paddingHorizontal: 20,
//     marginTop: 20,
//     backgroundColor: 'white',
//   },
//   title: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   text_titel: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: 'black',
//   },
//   text_menu: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: 'black',
//   },
//   button_menu: {
//     borderColor: '#9C9C9C',
//     borderWidth: 1,
//     borderRadius: 28,
//     width: 75,
//     height: 42,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 11,
//   },
//   container_menu: {
//     marginTop: 16,
//     flexDirection: 'row',
//   },
//   search: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderRadius: 28,
//     borderColor: '#9C9C9C',
//     paddingHorizontal: 10,
//     marginTop: 13,
//   },
//   list_friend: {
//     marginTop: 16,
//   },
//   all_friend: {
//     width: '100%',
//     backgroundColor: '#A6A6A6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     height: 34,
//   },
//   text_all_friend: {
//     fontSize: 14,
//     color: 'white',
//     fontWeight: '600',
//   },
//   text_tile_newFriend: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'black',
//     marginVertical: 20,
//   },
// });

const data = [
  {
    id: 1,
    name: 'Jonathan',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    name: 'Jonathan',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'Jonathan',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 4,
    name: 'Jonathan',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 5,
    name: 'Jonathan',
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];
