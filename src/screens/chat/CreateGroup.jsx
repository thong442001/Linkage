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


const CreateGroup = (props) => {// cần param
    const { route, navigation } = props;
    const { params } = route;

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
                    //console.log(response.groups)
                    navigation.navigate("Chat", { ID_group: response.ID_group })
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
        <View style={styles.container}>
            {/* header */}
            <View
                style={styles.vHeader}
            >
                {/* Nút quay lại */}
                <TouchableOpacity onPress={() => navigation.navigate("HomeChat")}>
                    <Text style={styles.headerBlue}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.header}>Tạo nhóm</Text>
                {/* Nút tạo group */}
                <TouchableOpacity onPress={taogGroup}>
                    <Text style={styles.headerBlue}>Tạo</Text>
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
    )
}

export default CreateGroup

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