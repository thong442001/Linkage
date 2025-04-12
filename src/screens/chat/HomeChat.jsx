import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
import { getAllFriendOfID_user, getAllGroupOfUser } from '../../rtk/API';
import { useSocket } from '../../context/socketContext';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemFriendHomeChat from '../../components/items/ItemFriendHomeChat';
import Groupcomponent from '../../components/chat/Groupcomponent';
import ChatHomeLoading from '../../utils/skeleton_loading/ChatHomeLoading';

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

    const normalizeText = text =>
        text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');

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

    // Tính toán danh sách bạn bè đã sắp xếp với useMemo
    const sortedFriends = useMemo(() => {
        if (!onlineUsers || onlineUsers.length === 0 || friends.length === 0) return friends;

        return [...friends].sort((a, b) => {
            const friendA_ID = a.ID_userA._id === me._id ? a.ID_userB._id : a.ID_userA._id;
            const friendB_ID = b.ID_userA._id === me._id ? b.ID_userB._id : b.ID_userA._id;
            const isOnlineA = onlineUsers.includes(friendA_ID);
            const isOnlineB = onlineUsers.includes(friendB_ID);
            return isOnlineB - isOnlineA;
        });
    }, [onlineUsers, friends, me._id]);

    useFocusEffect(
        useCallback(() => {
            if (!friends.length) {
                callGetAllFriendOfID_user(me._id);
            }
            if (!groups) {
                callGetAllGroupOfUser(me._id);
            }
        }, [me._id, friends.length, groups])
    );

    useEffect(() => {
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
                                    type: message.type,
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
        };
    }, [socket]);

    const callGetAllFriendOfID_user = async ID_user => {
        try {
            await dispatch(getAllFriendOfID_user({ me: ID_user, token }))
                .unwrap()
                .then(response => setFriends(response.relationships));
        } catch (error) {
            console.log('Error1 getAllFriendOfID_user:', error);
        }
    };

    const callGetAllGroupOfUser = async ID_user => {
        try {
            await dispatch(getAllGroupOfUser({ ID_user, token }))
                .unwrap()
                .then(response => {
                    setGroups(response.groups);
                    setLoading(false);
                });
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const onChat = ID_group => {
        ID_group ? navigation.navigate('Chat', { ID_group }) : console.log('ID_group: ' + ID_group);
    };

    const headerOnline = () => {
        if (!onlineUsers) return null; // Không render nếu onlineUsers chưa sẵn sàng

        return (
            <View>
                <FlatList
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                    data={sortedFriends}
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
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.vHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('TabHome')} style={{ marginRight: width * 0.03 }}>
                        <Icon name="chevron-back-outline" size={25} color="black" />
                    </TouchableOpacity>
                    <View style={styles.logo}>
                        <Image style={{ width: 15, height: 22 }} source={require('../../../assets/images/LK.png')} />
                        <Text style={styles.title}>inkageChat</Text>
                    </View>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ChatBot')}>
                        <Icon name="chatbubbles-outline" size={25} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('QRSannerAddGroup')}>
                        <Icon name="scan-circle-outline" size={25} color="#333" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('CreateGroup')}>
                        <Icon name="create-outline" size={24} color="#333" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.inputSearch}>
                <Icon name="search-outline" size={25} color="black" style={{ marginLeft: 10 }} />
                <TextInput
                    style={styles.search}
                    placeholder="Tìm kiếm đoạn chat"
                    placeholderTextColor="black"
                    value={searchText}
                    onChangeText={setSearchText}
                    color="black"
                />
            </View>

            {loading ? (
                <ChatHomeLoading />
            ) : (
                <FlatList
                    contentContainerStyle={{ paddingBottom: height * 0.02 }}
                    ListHeaderComponent={headerOnline}
                    data={filteredGroups}
                    keyExtractor={item => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                            <Groupcomponent item={item} />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Bạn chưa có cuộc trò chuyện nào.</Text>}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

// Styles giữ nguyên
const styles = StyleSheet.create({
    logo: { flexDirection: 'row', alignItems: 'center' },
    title: {
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: width * 0.05,
        color: '#0064E0',
        fontWeight: 'bold',
        top: height * 0.004,
    },
    container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: width * 0.01 },
    vHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: width * 0.025,
    },
    headerIcons: { flexDirection: 'row', gap: width * 0.02 },
    iconButton: {
        width: width * 0.1,
        height: width * 0.1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: width * 0.05,
        backgroundColor: '#dbf3f7',
    },
    inputSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dddfe1',
        borderRadius: width * 0.08,
        paddingVertical: height * 0.002,
        paddingHorizontal: width * 0.04,
        marginBottom: height * 0.025,
        marginHorizontal: width * 0.015,
    },
    search: { flex: 1, color: 'black', fontSize: width * 0.04 },
    emptyText: { textAlign: 'center', color: 'gray', marginTop: height * 0.03, fontSize: width * 0.04 },
});

export default HomeChat;