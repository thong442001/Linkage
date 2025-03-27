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
    addGroup,
} from '../../rtk/API';
import FriendAdd from '../../components/chat/FriendAdd';
import { useSocket } from '../../context/socketContext';
const { width, height } = Dimensions.get('window');

const CreateGroup = (props) => {// cần param
    const { route, navigation } = props;
    const { params } = route;

    const { socket } = useSocket();

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);
    const [nameGroup, setNameGroup] = useState(null);
    const [friends, setFriends] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([me._id]);// me phải trong nhóm 

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

        // Thêm listener để gọi lại API khi quay lại trang
        const focusListener = navigation.addListener('focus', () => {
            callGetAllFriendOfID_user();
        });

        // Cleanup listener khi component bị unmount
        return () => {
            focusListener();
        };
    }, [navigation]);

    //call api getAllFriendOfID_user
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

    //call api addGroup
    const callAddGroup = async (name, members) => {
        try {
            const paramsAPI = {
                name: name,
                members: members,
            }
            await dispatch(addGroup(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log("ID_group: " + response.group._id)
                    // Emit sự kiện "new_group" để cập nhật danh sách nhóm
                    socket.emit("new_group", { group: response.group, members: members });


                    // Chuyển sang màn hình chat của nhóm vừa tạo
                    navigation.navigate("Chat", { ID_group: response.group._id })
                })
                .catch((error) => {
                    console.log('Error1 addGroup:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }
    // Xử lý tạo group
    const taogGroup = () => {
        if (selectedUsers.length > 0) {
            callAddGroup(nameGroup, selectedUsers)
        } else {
            return;
        }

    };

    return (
        <View style={styles.containerAll}>
            <View style={styles.container}>
                {/* header */}
                <View
                    style={styles.vHeader}
                >
                    {/* Nút quay lại */}
                    <TouchableOpacity onPress={() => navigation.navigate("HomeChat")}>
                        <Text style={styles.txtHuy}>Hủy</Text>
                    </TouchableOpacity>
                    <Text style={styles.header}>Tạo nhóm</Text>
                    {/* Nút tạo group */}
                    <TouchableOpacity
                        onPress={taogGroup}
                        disabled={selectedUsers.length < 3}
                    >
                        <Text style={[styles.txtTao, selectedUsers.length > 2 && { color: "blue" }]}>Tạo</Text>
                    </TouchableOpacity>
                </View>
                {/* ten nhóm */}
                <Text style={styles.txtGrey}>Tên nhóm (không bắt buộc)</Text>
                <TextInput
                    style={styles.searchBox}
                    placeholder="Nhập tên nhóm..."
                    value={nameGroup}
                    onChangeText={setNameGroup}
                />

                {/* <TextInput style={styles.searchBox} placeholder="Tìm kiếm" /> */}
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
                            membersGroup={[]}
                        />
                    )}
                />
            </View >
        </View>
    )
}

export default CreateGroup

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
    txtHuy: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "blue",
        textAlign: 'center',
    },
    txtTao: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "grey",
        textAlign: 'center',
    },
    searchBox: {
        backgroundColor: '#eee',
        borderRadius: width * 0.025, // 2.5% chiều rộng màn hình
        padding: height * 0.018, // 1.8% chiều cao màn hình
        marginBottom: height * 0.018, // 1.8% chiều cao màn hình
    },
    vHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.018, // 1.8% chiều cao màn hình
        alignItems: "center",
    },
    txtGrey: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "#797979",
        marginBottom: height * 0.012, // 1.2% chiều cao màn hình
    },
});