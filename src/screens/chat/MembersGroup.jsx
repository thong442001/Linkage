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
import ItemFriendInGroup from '../../components/chat/ItemFriendInGroup';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
    getGroupID,
    deleteMember,
    passKey,
} from '../../rtk/API';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSocket } from '../../context/socketContext';
const { width, height } = Dimensions.get('window');
const MembersGroup = (props) => {// cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;
    const { socket } = useSocket();
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [membersGroup, setMembersGroup] = useState(null);

    useEffect(() => {
        // Call API khi lần đầu vào trang
        callGetGroupID();

        // Thêm listener để gọi lại API khi quay lại trang
        const focusListener = navigation.addListener('focus', () => {
            callGetGroupID();
        });

        // Cleanup listener khi component bị unmount
        return () => {
            focusListener();
        };
    }, [navigation]);

    //call api getGroupID
    const callGetGroupID = async () => {
        try {
            await dispatch(getGroupID({ ID_group: params.ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    console.log(response.group.members)
                    setMembersGroup(response.group.members);
                })
                .catch((error) => {
                    console.log('Error1 getGroupID:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api deleteMember
    const callDeleteMember = async (ID_user) => {
        try {
            const paramsAPI = {
                ID_group: params.ID_group,
                ID_user: ID_user,
            }
            await dispatch(deleteMember(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log(ID_user)
                    // Emit sự kiện "kick_user" để cập nhật danh sách nhóm
                    socket.emit("kick_user", { ID_group: params.ID_group, ID_user: ID_user });
                    // load lại 
                    callGetGroupID();
                })
                .catch((error) => {
                    console.log('Error1 deleteMember:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api passKey
    const callPassKey = async (oldAdmin, newAdmin) => {
        try {
            const paramsAPI = {
                ID_group: params.ID_group,
                oldAdmin: oldAdmin,
                newAdmin: newAdmin,
            }
            await dispatch(passKey(paramsAPI))
                .unwrap()
                .then((response) => {
                    //console.log(response.message)
                    // load lại 
                    callGetGroupID();
                })
                .catch((error) => {
                    console.log('Error1 passKey:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    const toSettingChat = () => {
        navigation.navigate("SettingChat", { ID_group: params.ID_group });
    };

    const toAddFriendGroup = () => {
        navigation.navigate("AddFriendGroup", { ID_group: params.ID_group });
    };

    const toProfile = (ID_user) => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("TabHome", { screen: "Profile", params: { _id: ID_user } })
    };

    const handleXoa = (ID_user) => {
        callDeleteMember(ID_user);
    };

    const handlePassKey = (newAdmin) => {
        callPassKey(me._id, newAdmin);
    };

    const shortenName = (name) => {
        if (!name) return '';
        if (name.length > 15) {
            return name.substring(0, 12) + '...';
        }
        return name;
    };

    return (
        <View style={styles.container}>
            {/* header */}
            <View
                style={styles.vHeader}
            >
                {/* Nút quay lại */}
                <TouchableOpacity
                    onPress={toSettingChat}
                >
                    <Icon name="arrow-back" size={23} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Thành viên</Text>
                {/* Nút add new member  */}
                {
                    (membersGroup != null)
                        &&
                        membersGroup[0]?._id == me._id
                        ? (
                            <TouchableOpacity
                                onPress={toAddFriendGroup}
                            >
                                <Icon name="person-add" size={23} color="black" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity>
                                <Text
                                    style={{ width: 24 }}
                                ></Text>
                            </TouchableOpacity>
                        )
                }
            </View>

            <View style={{ marginHorizontal: 20 }}>
                <Text style={styles.txtGrey}>Tất cả</Text>
                <FlatList
                    data={membersGroup}
                    keyExtractor={(item) => item._id}
                    extraData={membersGroup}
                    renderItem={({ item }) => (
                        <ItemFriendInGroup
                            item={item}
                            ID_admin={membersGroup[0]._id}
                            toProfile={toProfile}
                            handleXoa={handleXoa}
                            handlePassKey={handlePassKey}
                        />
                    )}
                />
            </View>

        </View >
    )
}

export default MembersGroup

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // padding: width * 0.05, // Nếu cần padding
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
        backgroundColor: '#eee',
        borderRadius: width * 0.05, // 5% chiều rộng màn hình
        padding: width * 0.025, // 2.5% chiều rộng màn hình
        marginBottom: height * 0.02, // 2% chiều cao màn hình
    },
    vHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: height * 0.025, // 2.5% chiều cao màn hình
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Tác dụng trên Android
        paddingVertical: height * 0.02, // 2% chiều cao màn hình
        paddingHorizontal: width * 0.04, // 4% chiều rộng màn hình
    },
    txtGrey: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "#797979",
        marginBottom: height * 0.015, // 1.5% chiều cao màn hình
    }
});