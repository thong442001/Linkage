import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllFriendOfID_user,
    getGroupID,
    addMembers
} from '../../rtk/API';
import FriendAdd from '../../components/chat/FriendAdd';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import { useSocket } from '../../context/socketContext';

const AddFriendGroup = (props) => {// cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);
    const [membersGroup, setMembersGroup] = useState([]);
    const [friends, setFriends] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const toggleSelectUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((userId) => userId !== id)
                : [...prev, id]
        );
    };

    useEffect(() => {
        // Call API khi lần đầu vào trang
        callGetAllFriendOfID_user();
        callGetGroupID();

        // Thêm listener để gọi lại API khi quay lại trang
        const focusListener = navigation.addListener('focus', () => {
            callGetAllFriendOfID_user();
            callGetGroupID();
        });

        // Cleanup listener khi component bị unmount
        return () => {
            focusListener();
        };
    }, [navigation]);

    //call api getAllFriendOfID_user (lấy danh sách bạn bè)
    const callGetAllFriendOfID_user = async () => {
        try {
            await dispatch(getAllFriendOfID_user({ me: me._id, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response.groups)
                    setFriends(response.relationships);
                })
                .catch((error) => {
                    console.log('Error1 getAllFriendOfID_user:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api getGroupID (lấy danh sách thành viên đã trong nhóm)
    const callGetGroupID = async () => {
        try {
            await dispatch(getGroupID({ ID_group: params.ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response.groups)
                    setGroup(response.group);
                    setMembersGroup(response.group.members);
                })
                .catch((error) => {
                    console.log('Error1 getGroupID:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api addtMembers
    const callAddMembers = async (ID_group, new_members) => {
        try {
            const paramsAPI = {
                ID_group: ID_group,
                new_members: new_members,
            }
            await dispatch(addMembers(paramsAPI))
                .unwrap()
                .then((response) => {
                    //console.log(response?.message)
                    // Emit sự kiện "add_members" để cập nhật danh sách nhóm
                    socket.emit("add_members", { group: group, members: new_members });
                    // chuyển trang khi add thành công
                    navigation.navigate("Chat", { ID_group: ID_group })
                })
                .catch((error) => {
                    console.log('Error1 callAddMembers:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // Xử lý add ng
    const handleAddMembers = () => {
        if (selectedUsers.length > 0) {
            callAddMembers(params.ID_group, selectedUsers)
        } else {
            return;
        }
    };

    const toMembersGroup = () => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("SettingChat", { ID_group: params.ID_group });
    };

    return (
        <View style={styles.containerAll}>
            <View style={styles.container}>
                {/* header */}
                <View
                    style={styles.vHeader}
                >
                    {/* Nút quay lại */}
                    <TouchableOpacity
                        onPress={toMembersGroup}
                    >
                        <Text style={styles.headerBlue}>Hủy</Text>
                    </TouchableOpacity>
                    <Text style={styles.header}>Thêm người</Text>
                    {/* Nút add ng */}
                    <TouchableOpacity
                        onPress={handleAddMembers}
                    >
                        <Text style={styles.headerBlue}>Thêm</Text>
                    </TouchableOpacity>
                </View>
                {/* search friend */}
                <View style={styles.boxSearch}>
                    <View style={{ paddingLeft: 10 }}>
                        <Icon name="search-outline" size={25} color='black' />
                    </View>
                    <TextInput
                        style={styles.searchBox}
                        placeholder="Tìm kiếm"
                    // value={nameGroup}
                    // onChangeText={setNameGroup}
                    />
                </View>


                {/* gợi ý */}
                <Text style={styles.txtGrey}>Gợi ý</Text>
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item._id}
                    extraData={selectedUsers} // Cập nhật danh sách khi selectedUsers thay đổi
                    renderItem={({ item }) => (
                        <FriendAdd
                            item={item}
                            onToggle={toggleSelectUser}
                            selectedUsers={selectedUsers}
                            membersGroup={membersGroup}
                        />
                    )}
                />
            </View >
        </View>
    )
}

export default AddFriendGroup

const styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        marginHorizontal: width * 0.05, // 5% chiều rộng màn hình
    },
    header: {
        fontSize: width * 0.06, // 6% chiều rộng màn hình
        fontWeight: 'bold',
        color: "black",
        width: width * 0.5, // 50% chiều rộng màn hình
        textAlign: 'center',
    },
    headerBlue: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "blue",
        textAlign: 'center',
    },
    searchBox: {
        padding: height * 0.02, // 2% chiều cao màn hình
        flex: 1,
    },
    vHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.02, // 2% chiều cao màn hình
        alignItems: 'center',
    },
    txtGrey: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "#797979",
    },
    boxSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: height * 0.02, // 2% chiều cao màn hình
        backgroundColor: '#eee',
        borderRadius: width * 0.05, // 5% chiều rộng màn hình
    },
});