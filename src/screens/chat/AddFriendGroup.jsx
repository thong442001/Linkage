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
    addtMembers
} from '../../rtk/API';
import FriendAdd from '../../components/chat/FriendAdd';


const AddFriendGroup = (props) => {// cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

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
    const callAddtMembers = async (ID_group, new_members) => {
        try {
            const paramsAPI = {
                ID_group: ID_group,
                new_members: new_members,
            }
            await dispatch(addtMembers(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log(response.message)
                    navigation.navigate("Chat", { ID_group: ID_group })
                })
                .catch((error) => {
                    console.log('Error1 addtMembers:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // Xử lý add ng
    const handleAddMembers = () => {
        if (selectedUsers.length > 0) {
            callAddtMembers(params.ID_group, selectedUsers)
        } else {
            return;
        }
    };

    const toMembersGroup = () => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("SettingChat", { ID_group: params.ID_group });
    };

    return (
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
                <Text style={styles.header}>Chọn người</Text>
                {/* Nút add ng */}
                <TouchableOpacity
                    onPress={handleAddMembers}
                >
                    <Text style={styles.headerBlue}>Thêm</Text>
                </TouchableOpacity>
            </View>
            {/* search friend */}
            <TextInput
                style={styles.searchBox}
                placeholder="Tìm kiếm"
            // value={nameGroup}
            // onChangeText={setNameGroup}
            />

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
    )
}

export default AddFriendGroup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "black",
        width: Dimensions.get('window').width * 0.5,
        textAlign: 'center',
    },
    headerBlue: {
        fontSize: 16,
        color: "blue",
        textAlign: 'center',
    },
    searchBox: {
        backgroundColor: '#eee',
        borderRadius: 20,
        padding: 10,
        marginBottom: 15,
    },
    vHeader: {
        flexDirection: 'row',
        //width: Dimensions.get('window').width,
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    txtGrey: {
        fontSize: 16,
        color: "#797979",
    },
});