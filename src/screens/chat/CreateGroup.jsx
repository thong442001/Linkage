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
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
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
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);
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
                    setSuccessModalVisible(true);
                    setTimeout(() => setSuccessModalVisible(false), 2000);
                    console.log("ID_group: " + response.group._id)
                    // Emit sự kiện "new_group" để cập nhật danh sách nhóm
                    socket.emit("new_group", { group: response.group, members: members });
                    // Chuyển sang màn hình chat của nhóm vừa tạo
                    navigation.navigate("Chat", { ID_group: response.group._id })
                })
                .catch((error) => {
                    setFailedModalVisible(true);
                    setTimeout(() => setFailedModalVisible(false), 2000);
                    console.log('Error1 addGroup:', error);
                });

        } catch (error) {
            setFailedModalVisible(true);
            setTimeout(() => setFailedModalVisible(false), 2000);
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
            <SuccessModal visible={successModalVisible} message={'Tạo nhóm thành công'}/>
            <FailedModal visible={failedModalVisible} message={'Tạo nhóm thất bại'}/>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate("HomeChat")}>
                    <Text style={styles.cancelText}>Hủy</Text>
                </TouchableOpacity>
                <Text style={styles.headerText}>Tạo nhóm</Text>
                <TouchableOpacity
                    onPress={taogGroup}
                    disabled={selectedUsers.length < 3}
                    style={[
                        styles.createButton,
                        selectedUsers.length < 3 && styles.createButtonDisabled
                    ]}
                >
                    <Text style={[
                        styles.createText,
                        selectedUsers.length >= 3 && { color: '#0064E0' }
                    ]}>Tạo</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.labelText}>Tên nhóm (không bắt buộc)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tên nhóm..."
                    placeholderTextColor="#8C96A2"
                    value={nameGroup}
                    onChangeText={setNameGroup}
                />

                <Text style={styles.labelText}>Gợi ý</Text>
                <FlatList
                    data={friends}
                    keyExtractor={(item) => item._id}
                    extraData={selectedUsers}
                    renderItem={({ item }) => (
                        <FriendAdd
                            item={item}
                            onToggle={toggleSelectUser}
                            selectedUsers={selectedUsers}
                            membersGroup={[]}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    containerAll: {
        flex: 1,
        backgroundColor: '#fff', // Màu nền chính
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: height * 0.005,
        paddingHorizontal: width * 0.05,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        elevation: 2, 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    headerText: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        flex: 1,
    },
    cancelText: {
        fontSize: width * 0.041,
        color: '#0064E0', // Màu xanh đậm
        fontWeight: '500',
    },
    createButton: {
        fontSize: width * 0.041,
        paddingHorizontal: width * 0.03,
        paddingVertical: height * 0.01,
        borderRadius: width * 0.02,
    },
    createButtonDisabled: {
        opacity: 0.5,
    },
    createText: {
        fontSize: width * 0.041,
        color: '#999', // Màu xám khi chưa đủ điều kiện
        fontWeight: '500',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.02,
    },
    labelText: {
        fontSize: width * 0.04,
        color: '#666',
        marginBottom: height * 0.015,
        fontWeight: '500',
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: width * 0.1,
        padding: height * 0.018,
        marginBottom: height * 0.025,
        fontSize: width * 0.04,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
});

export default CreateGroup;