import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles/screens/friend/FriendNoti';
import FriendRequestItem from '../../components/items/FriendRequestItem';
import { oStackHome } from '../../navigations/HomeNavigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllLoiMoiKetBan,
  chapNhanLoiMoiKetBan,
  huyLoiMoiKetBan,
} from '../../rtk/API';
import { Snackbar } from 'react-native-paper';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import { useFocusEffect } from '@react-navigation/native'; // Thêm import này
import NothingFriend from '../../utils/animation/friendAni/NothingFriend';

const Friend = ({ route, navigation }) => {
  const { params } = route;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [relationships, setRelationships] = useState([]);
  const [dialogReLoad, setDialogreload] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failedModalVisible, setFailedModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  //time now
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [nothingFriend, setNothingFriend] = useState(false)
  const callGetAllLoiMoiKetBan = async () => {
    try {
      setRefreshing(true);
      await dispatch(getAllLoiMoiKetBan({ me: me._id, token }))
        .unwrap()
        .then(response => {
          setRelationships(response.relationships);
          console.log(response.relationships);
        })
        .catch(error => {
          console.log('Error2 getAllLoiMoiKetBan:', error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  // Sử dụng useFocusEffect để gọi API khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      callGetAllLoiMoiKetBan();
      // Cleanup (nếu cần) khi màn hình mất focus
      return () => {
        // Có thể thêm logic cleanup nếu cần
      };
    }, [me._id, token]) // Dependency để đảm bảo gọi lại nếu me._id hoặc token thay đổi
  );

  const callChapNhanLoiMoiKetBan = async ID_relationship => {
    try {
      const paramsAPI = { ID_relationship };
      await dispatch(chapNhanLoiMoiKetBan(paramsAPI))
        .unwrap()
        .then(response => {
          console.log(response?.message);
          callGetAllLoiMoiKetBan();
          setModalMessage('Đã chấp nhận lời mời kết bạn!');
          setSuccessModalVisible(true);
          setTimeout(() => setSuccessModalVisible(false), 2000);
        })
        .catch(error => {
          console.log('Error2 callChapNhanLoiMoiKetBan:', error);
          setModalMessage('Chấp nhận lời mời thất bại!');
          setFailedModalVisible(true);
          setTimeout(() => setFailedModalVisible(false), 2000);
        });
    } catch (error) {
      console.log(error);
      setModalMessage('Có lỗi xảy ra. Vui lòng thử lại!');
      setFailedModalVisible(true);
      setTimeout(() => setFailedModalVisible(false), 2000);
    }
  };

  const callHuyLoiMoiKetBan = async ID_relationship => {
    try {
      const paramsAPI = { ID_relationship };
      await dispatch(huyLoiMoiKetBan(paramsAPI))
        .unwrap()
        .then(response => {
          console.log(response?.message);
          callGetAllLoiMoiKetBan();
          setModalMessage('Đã xóa lời mời kết bạn!');
          setSuccessModalVisible(true);
          setTimeout(() => setSuccessModalVisible(false), 2000);
        })
        .catch(error => {
          console.log('Error2 callHuyLoiMoiKetBan:', error);
          setModalMessage('Xóa lời mời thất bại!');
          setFailedModalVisible(true);
          setTimeout(() => setFailedModalVisible(false), 2000);
        });
    } catch (error) {
      console.log(error);
      setModalMessage('Có lỗi xảy ra. Vui lòng thử lại!');
      setFailedModalVisible(true);
      setTimeout(() => setFailedModalVisible(false), 2000);
    }
  };

  const onProfile = item => {
    if (item.ID_userA._id === me._id) {
      navigation.navigate('TabHome', {
        screen: 'Profile',
        params: { _id: item.ID_userB._id },
      });
    } else {
      navigation.navigate('TabHome', {
        screen: 'Profile',
        params: { _id: item.ID_userA._id },
      });
    }
  };

  const onRefresh = () => {
    callGetAllLoiMoiKetBan();
    setCurrentTime(Date.now());
  };

  return (
    <View style={styles.container}>
      <Snackbar
        visible={dialogReLoad}
        onDismiss={() => {
          callGetAllLoiMoiKetBan();
          setDialogreload(false);
        }}
        duration={1000}>
        Làm mới!
      </Snackbar>
      <View style={styles.HeaderWrap}>
        <Text style={[styles.title, { color: 'black' }]}>Bạn bè</Text>
        <TouchableOpacity onPress={() => navigation.navigate(oStackHome.Search.name)}>
          <Icon style={styles.findButton} name="search" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <View style={styles.goiYWrap}>
        <TouchableOpacity onPress={() => navigation.navigate('ListGoiY', { _id: me._id })}>
          <Text style={[styles.goiY, { color: 'black', backgroundColor: '#e2e5ec' }]}>
            Gợi ý
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ListFriend', { _id: me._id })}>
          <Text style={[styles.goiY, { color: 'black', backgroundColor: '#e2e5ec' }]}>
            Bạn bè
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleWrap}>
        <Text style={[styles.title2, { color: 'black' }]}>Lời mời kết bạn</Text>
      </View>
      <FlatList
        data={relationships}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onProfile(item)}>
            <FriendRequestItem
              data={item}
              me={me._id}
              onXacNhan={callChapNhanLoiMoiKetBan}
              onXoa={callHuyLoiMoiKetBan}
              currentTime={currentTime}
            />
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={<NothingFriend message={"Không có lời mời nào"}/>}
      />

      <SuccessModal visible={successModalVisible} message={modalMessage} />
      <FailedModal visible={failedModalVisible} message={modalMessage} />
    </View>
  );
};

export default Friend;