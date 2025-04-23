import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import FriendGoiYLoading from '../../utils/skeleton_loading/FriendGoiYLoading';
import { useDispatch, useSelector } from 'react-redux';
import { getGoiYBanBe, getRelationshipAvsB, guiLoiMoiKetBan } from '../../rtk/API';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import ItemListGoiY from '../../components/items/ItemListGoiY';
import NothingFriend from '../../utils/animation/friendAni/NothingFriend';
const { width, height } = Dimensions.get('window');

const ListGoiY = ({ navigation, route }) => {
  const { params } = route;
  const [listGoiY, setListGoiY] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);
  const [loading, setLoading] = useState(false);
  const me = useSelector(state => state.app.user);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failedModalVisible, setFailedModalVisible] = useState(false);

  useEffect(() => {
    callGetAllFriendOfID_user();
  }, []);

  const callGetAllFriendOfID_user = async () => {
    try {
      setLoading(true);
      await dispatch(getGoiYBanBe({ me: params._id, token }))
        .unwrap()
        .then(response => {
          setListGoiY(response.data);
        })
        .catch(error => {
          console.log('Error1 getAllFriendOfID_user:', error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemBanBe = async (ID_user) => {
    // Optimistic update: Ẩn user khỏi danh sách ngay lập tức
    const userToRemove = listGoiY.find(item => item.user._id === ID_user);
    setListGoiY(prev => prev.filter(item => item.user._id !== ID_user));

    try {
      // Gọi hai API tuần tự (vì guiLoiMoiKetBan cần ID_relationship)
      const relationshipResponse = await dispatch(getRelationshipAvsB({ ID_user, me: me._id })).unwrap();
      const ID_relationship = relationshipResponse.relationship._id;
      await dispatch(guiLoiMoiKetBan({ ID_relationship, me: me._id })).unwrap();

      console.log('Gửi lời mời kết bạn thành công:', ID_user);
      // Hiển thị modal thành công
      setSuccessModalVisible(true);
      setTimeout(() => setSuccessModalVisible(false), 2000); // Ẩn sau 2 giây
    } catch (error) {
      // Nếu lỗi, thêm lại user vào danh sách
      console.log('❌ Lỗi khi gửi lời mời kết bạn:', error);
      setListGoiY(prev =>
        [...prev, userToRemove].sort((a, b) => a.user._id.localeCompare(b.user._id))
      );
      // Hiển thị modal thất bại
      setFailedModalVisible(true);
      setTimeout(() => setFailedModalVisible(false), 2000); // Ẩn sau 2 giây
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.TextHeader}>Gợi ý</Text>
        <View></View>
      </View>
      {loading ? (
        <FriendGoiYLoading />
      ) : (
        <View style={{ paddingBottom: width * 0.1 }}>
          <FlatList
            data={listGoiY}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile', { _id: item.user._id })}
              >
                <ItemListGoiY
                  item={item}
                  _id={params._id}
                  onThemBanBe={handleThemBanBe}
                />
              </TouchableOpacity>
            )}
            keyExtractor={item => item.user._id}
            ListEmptyComponent={<NothingFriend message={"Không có gợi ý"}/>}
          />
        </View>
      )}
      {/* Modal thông báo */}
      <SuccessModal visible={successModalVisible} message="Gửi lời mời kết bạn thành công!" />
      <FailedModal visible={failedModalVisible} message="Gửi lời mời thất bại. Vui lòng thử lại!" />
    </View>
  );
};

export default ListGoiY;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});