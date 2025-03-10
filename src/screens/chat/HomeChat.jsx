import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFriendOfID_user, getAllGroupOfUser} from '../../rtk/API';
import Groupcomponent from '../../components/chat/Groupcomponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatHomeLoading from '../../utils/skeleton_loading/ChatHomeLoading';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemListFriend from '../../components/items/ItemListFriend';
import ItemFriendHomeChat from '../../components/items/ItemFriendHomeChat';

const {width, height} = Dimensions.get('window');

const HomeChat = ({route, navigation}) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [groups, setGroups] = useState(null);
  const [friends, setFriends] = useState([]);
  useEffect(() => {
    callGetAllGroupOfUser(me._id);
    const focusListener = navigation.addListener('focus', () => {
      callGetAllGroupOfUser(me._id);
    });
    callGetAllFriendOfID_user(me._id);

    return () => focusListener;
  }, [navigation]);
  // lấy danh sách bạn bè
  const callGetAllFriendOfID_user = async ID_user => {
    try {
      await dispatch(getAllFriendOfID_user({me: ID_user, token: token}))
        .unwrap()
        .then(response => {
          //   console.log("ban be:",response)
          setFriends(response.relationships);
        })
        .catch(error => {
          console.log('Error1 getAllFriendOfID_user:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const callGetAllGroupOfUser = async ID_user => {
    try {
      await dispatch(getAllGroupOfUser({ID_user, token}))
        .unwrap()
        .then(response => {
          setGroups(response.groups);
          setLoading(false);
          //   console.log(response)
        })
        .catch(error => console.log('Error:', error));
    } catch (error) {
      console.log(error);
    }
  };

  const onChat = ID_group => {
    ID_group
      ? navigation.navigate('Chat', {ID_group})
      : console.log('ID_group: ' + ID_group);
  };

  return (
    <View style={styles.container}>
      <View style={styles.vHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('TabHome')}>
          <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.header}>Đoạn chat</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatBot')}>
          <Icon name="chatbubbles-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('QRSannerAddGroup')}>
            <Icon name="scan-circle-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
            <MaterialIcons name="group-add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputSearch}>
        <Icon
          name="search-outline"
          size={25}
          color="black"
          style={{marginLeft: 10}}
        />
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm đoạn chat"
          placeholderTextColor={'#ADB5BD'}
        />
      </View>

      {loading ? (
        <ChatHomeLoading />
      ) : (
        <View>
          <FlatList
            data={friends}
            renderItem={({item}) => (
              <ItemFriendHomeChat item={item} navigation={navigation} />
            )}
            keyExtractor={item => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

          <FlatList
            data={groups}
            keyExtractor={item => item._id}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                <Groupcomponent item={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                Bạn chưa có cuộc trò chuyện nào.
              </Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default HomeChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  vHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  inputSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7FC',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  search: {
    flex: 1,
    marginLeft: 10,
  },
  container_item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F5',
    borderRadius: 10,
    marginBottom: 15,
  },
  text_name_AI: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 15,
    color: 'black',
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  emptyText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 16,
  },
});
