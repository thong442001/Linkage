import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemListFriend from '../../components/items/ItemListFriend';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFriendOfID_user,
} from '../../rtk/API';
const { width, height } = Dimensions.get('window');
const ListFriend = (props) => {
  const { navigation, route } = props;
  const { params } = route;
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);
  const me = useSelector(state => state.app.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFriends, setFilteredFriends] = useState([]);

  useEffect(() => {
    callGetAllFriendOfID_user();
  }, [])

  // Lọc danh sách bạn bè khi searchQuery hoặc friends thay đổi
  //tách dấu
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Tách dấu ra khỏi chữ
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };
  //search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredFriends(friends || []);
    } else {
      const filteredFriends = friends.filter(user => {
        // Xác định ai là bạn bè của bạn
        const friend = user.ID_userA._id === me._id ? user.ID_userB : user.ID_userB._id === me._id ? user.ID_userA : null;

        // Nếu không tìm thấy bạn bè (myId không có trong cặp), bỏ qua
        if (!friend) return false;

        // Lấy tên đầy đủ của bạn bè để lọc
        const fullName = `${friend.first_name || ''} ${friend.last_name || ''}`.toLowerCase();
        return normalizeText(fullName).includes(normalizeText(searchQuery).toLowerCase());
      });
      setFilteredFriends(filteredFriends);
    }
  }, [searchQuery, friends]); // Thêm myId vào dependencies nếu nó có thể thay đổi

  //call api getAllFriendOfID_user
  const callGetAllFriendOfID_user = async () => {
    try {

      await dispatch(getAllFriendOfID_user({ me: params._id, token: token }))
        .unwrap()
        .then((response) => {
          //console.log(response.groups)
          setFriends(response.relationships);
          setFilteredFriends(response.relationships); // Khởi tạo danh sách lọc ban đầu
        })
        .catch((error) => {
          console.log('Error1 getAllFriendOfID_user:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.TextHeader}>Bạn bè</Text>
        <View></View>
        {/* <Icon name="add" size={25} color={'black'} /> */}
      </View>
      <View style={styles.containerInput}>
        <Icon name="search" size={25} color={'black'} />
        <TextInput
          placeholder='Tìm kiếm bạn bè'
          placeholderTextColor={'black'}
          color={'black'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* <Text style={styles.title}>Bạn bè</Text> */}
      <Text>{friends.length} người bạn</Text>
      <View>
        <View
          style={{ paddingBottom: width * 0.1 }}
        >
          <FlatList
            data={filteredFriends}
            renderItem={({ item }) =>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile', { _id: item.ID_userA._id == me._id ? item.ID_userB._id : item.ID_userA._id })}
              >
                <ItemListFriend item={item} _id={params._id} />
              </TouchableOpacity>
            }
            keyExtractor={(item) => item._id}
          />
        </View>
      </View>
    </View>
  );
};

export default ListFriend;

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
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 28,
    borderColor: '#D6D6D6',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'medium',
  }
});


const data = [
  {
    id: 1,
    img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    name: 'canhphan'
  }
]