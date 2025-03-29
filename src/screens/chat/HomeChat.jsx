import React, { useState, useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllFriendOfID_user,
  getAllGroupOfUser,
} from '../../rtk/API';
import Groupcomponent from '../../components/chat/Groupcomponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatHomeLoading from '../../utils/skeleton_loading/ChatHomeLoading';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemFriendHomeChat from '../../components/items/ItemFriendHomeChat';
import { useSocket } from '../../context/socketContext';

const { width, height } = Dimensions.get('window');

const HomeChat = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState(null);
  const [friends, setFriends] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredGroups, setFilteredGroups] = useState([]);
  const { socket, onlineUsers } = useSocket();

  // Chuẩn hóa văn bản cho tìm kiếm
  const normalizeText = text => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Lọc nhóm chat dựa trên tìm kiếm
  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredGroups(groups || []);
    } else {
      const lowerSearch = normalizeText(searchText);
      const filtered = (groups || []).filter(group => {
        if (group.isPrivate) {
          const otherUser = group.members.find(user => user._id !== me._id);
          if (otherUser) {
            const fullName = `${otherUser.first_name} ${otherUser.last_name}`;
            return normalizeText(fullName).includes(lowerSearch);
          }
          return false;
        }
        const groupName = group.name || '';
        if (normalizeText(groupName).includes(lowerSearch)) return true;
        const memberNames = group.members
          .filter(user => user._id !== me._id)
          .map(user => `${user.first_name} ${user.last_name}`);
        return memberNames.some(name => normalizeText(name).includes(lowerSearch));
      });
      setFilteredGroups(filtered);
    }
  }, [searchText, groups]);

  // Kiểm tra bạn bè online
  useEffect(() => {
    if (!onlineUsers || onlineUsers.length === 0) {
      console.log('🚫 Không có user nào online.');
      return;
    }
    const onlineFriends = friends.filter(
      friend =>
        onlineUsers.includes(friend.ID_userA._id) ||
        onlineUsers.includes(friend.ID_userB._id),
    );
    console.log('✅ Danh sách bạn bè đang online:', onlineFriends);
  }, [onlineUsers, friends]);

  // Gọi API và xử lý Socket.IO
  useEffect(() => {
    callGetAllFriendOfID_user(me._id);
    callGetAllGroupOfUser(me._id);

    const focusListener = navigation.addListener('focus', () => {
      callGetAllGroupOfUser(me._id);
    });

    // Socket.IO events
    socket.on('new_group', ({ group }) => {
      setGroups(prevGroups => {
        if (!prevGroups) return [group];
        if (!prevGroups.some(g => g._id === group._id)) {
          return [group, ...prevGroups];
        }
        return prevGroups;
      });
    });

    socket.on('new_message', ({ ID_group, message }) => {
      setGroups(prevGroups => {
        return prevGroups
          .map(group => {
            if (group._id === ID_group) {
              return {
                ...group,
                messageLatest: {
                  ID_message: message._id,
                  sender: message.sender,
                  content: message.content,
                  createdAt: message.createdAt,
                  _destroy: message._destroy,
                },
              };
            }
            return group;
          })
          .sort((a, b) => {
            const timeA = a.messageLatest
              ? new Date(a.messageLatest.createdAt).getTime()
              : new Date(a.createdAt).getTime();
            const timeB = b.messageLatest
              ? new Date(b.messageLatest.createdAt).getTime()
              : new Date(b.createdAt).getTime();
            return timeB - timeA;
          });
      });
    });

    socket.on('group_deleted', ({ ID_group }) => {
      setGroups(prevGroups => (prevGroups ? prevGroups.filter(group => group._id !== ID_group) : []));
    });

    socket.on('kicked_from_group', ({ ID_group }) => {
      setGroups(prevGroups => prevGroups.filter(group => group._id !== ID_group));
    });

    return () => {
      socket.off('new_group');
      socket.off('new_message');
      socket.off('group_deleted');
      socket.off('kicked_from_group');
      focusListener();
    };
  }, [navigation]);

  const callGetAllFriendOfID_user = async ID_user => {
    try {
      await dispatch(getAllFriendOfID_user({ me: ID_user, token }))
        .unwrap()
        .then(response => setFriends(response.relationships))
        .catch(error => console.log('Error1 getAllFriendOfID_user:', error));
    } catch (error) {
      console.log(error);
    }
  };

  const callGetAllGroupOfUser = async ID_user => {
    try {
      await dispatch(getAllGroupOfUser({ ID_user, token }))
        .unwrap()
        .then(response => {
          setGroups(response.groups);
          setLoading(false);
        })
        .catch(error => console.log('Error:', error));
    } catch (error) {
      console.log(error);
    }
  };

  const onChat = ID_group => {
    ID_group ? navigation.navigate('Chat', { ID_group }) : console.log('ID_group: ' + ID_group);
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
          <TouchableOpacity onPress={() => navigation.navigate('QRSannerAddGroup')}>
            <Icon name="scan-circle-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('CreateGroup')}>
            <MaterialIcons name="group-add" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputSearch}>
        <Icon name="search-outline" size={25} color="black" style={{ marginLeft: 10 }} />
        <TextInput
          style={styles.search}
          placeholder="Tìm kiếm đoạn chat"
          placeholderTextColor="#ADB5BD"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {loading ? (
        <ChatHomeLoading />
      ) : (
        <View>
          <FlatList
            data={friends}
            renderItem={({ item }) => {
              const friendID = item.ID_userA._id === me._id ? item.ID_userB._id : item.ID_userA._id;
              const isOnline = onlineUsers.includes(friendID);
              return (
                <ItemFriendHomeChat item={item} navigation={navigation} isOnline={isOnline} />
              );
            }}
            keyExtractor={item => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />

                
          <FlatList
            data={filteredGroups}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                <Groupcomponent item={item} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Bạn chưa có cuộc trò chuyện nào.</Text>
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05,
      },
      header: {
        fontSize: width * 0.06,
        fontWeight: 'bold',
        color: 'black',
        textAlign: 'center',
        flex: 1,
      },
      headerIcons: {
        flexDirection: 'row',
        gap: width * 0.04,
      },
      vHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: height * 0.025,
      },
      inputSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7FC',
        borderRadius: width * 0.08,
        paddingVertical: height * 0.008,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.025,
      },
      search: {
        flex: 1,
        color: 'black',
        fontSize: width * 0.04,
      },
      container_item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: height * 0.02,
        paddingHorizontal: width * 0.03,
        backgroundColor: '#F0F0F5',
        borderRadius: width * 0.03,
        marginBottom: height * 0.02,
      },
      text_name_AI: {
        fontSize: width * 0.045,
        fontWeight: '500',
        marginLeft: width * 0.04,
        color: 'black',
      },
      img: {
        width: width * 0.12,
        height: width * 0.12,
        borderRadius: width * 0.06,
      },
      emptyText: {
        textAlign: 'center',
        color: 'gray',
        marginTop: height * 0.03,
        fontSize: width * 0.04,
      },
    });

export default HomeChat;