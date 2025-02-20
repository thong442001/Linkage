import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import {
    getGroupID,
    deleteMember,
    deleteGroup,
} from '../../rtk/API';
const SettingChat = (props) => { // cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;

    //console.log('Setting: ', params.group);
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);

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
                    //console.log(response.groups)
                    setGroup(response.group);
                })
                .catch((error) => {
                    console.log('Error1 getGroupID:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api deleteMember
    const callDeleteMember = async () => {
        try {
            const paramsAPI = {
                ID_group: params.ID_group,
                ID_user: me._id,
            }
            await dispatch(deleteMember(paramsAPI))
                .unwrap()
                .then((response) => {
                    // bakc HomeChat
                    navigation.navigate("HomeChat");
                })
                .catch((error) => {
                    console.log('Error1 deleteMember:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api deleteGroup
    const callDeleteGroup = async () => {
        try {
            const paramsAPI = {
                ID_group: params.ID_group,
            }
            await dispatch(deleteGroup(paramsAPI))
                .unwrap()
                .then((response) => {
                    // bakc HomeChat
                    navigation.navigate("HomeChat");
                })
                .catch((error) => {
                    console.log('Error1 deleteMember:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    const goBack = () => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("Chat", { ID_group: params.ID_group })
    };

    const toMembersGroup = () => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("MembersGroup", { ID_group: params.ID_group })
    };

    const toAddFriendGroup = () => {
        navigation.navigate("AddFriendGroup", { ID_group: params.ID_group });
    };

    const toAvtNameGroup = () => {
        navigation.navigate("AvtNameGroup", { ID_group: params.ID_group });
    };

    const handleRoiNhom = () => {
        callDeleteMember();
    };

    const handleGiaiTan = () => {
        callDeleteGroup();
    };

    return (
        <View style={styles.container}>

            {/* Nút Back */}
            {
                group != null
                && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={goBack}
                    >
                        <FontAwesome name="chevron-left" size={24} color="black" />
                    </TouchableOpacity>
                )
            }
            {/* Ảnh đại diện nhóm */}
            {
                group != null
                && (
                    <View style={styles.groupAvatarContainer}>
                        <Image source={{ uri: group.avatar }} style={styles.avatar} />
                        {/* Name group */}
                        {
                            group.name == null
                                ? (
                                    <Text
                                        style={styles.groupName}
                                    >
                                        Nhóm chưa có tên
                                    </Text>
                                ) : (
                                    <Text
                                        style={styles.groupName}
                                    >
                                        {group.name}
                                    </Text>
                                )
                        }
                        {/* đổi name vs avt group */}
                        {
                            group.members[0]._id == me._id
                            && (
                                <TouchableOpacity
                                    onPress={toAvtNameGroup}
                                >
                                    <Text style={styles.changeGroupInfo}>Đổi tên hoặc ảnh</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                )
            }


            {/* Nút Thêm thành viên */}
            {
                group != null
                && (
                    group.members[0]._id == me._id
                    && (
                        <TouchableOpacity
                            style={styles.addMemberButton}
                            onPress={toAddFriendGroup}
                        >
                            <FontAwesome name="user-plus" size={30} color="black" />
                            <Text style={styles.addMemberText}>Thêm</Text>
                        </TouchableOpacity>
                    )
                )
            }

            {/* Thông tin về đoạn chat */}
            {
                group != null
                && (
                    <View style={styles.chatInfoContainer}>

                        <TouchableOpacity
                            style={styles.infoItem}
                            onPress={toMembersGroup}
                        >
                            <Text style={styles.infoText}>Xem thành viên trong nhóm chat</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.leaveChatButton}
                            onPress={handleRoiNhom}
                        >
                            <Text style={styles.leaveChatText}>Rời khỏi nhóm chat</Text>
                        </TouchableOpacity>

                        {
                            group.members[0]._id == me._id
                            && (
                                <TouchableOpacity
                                    style={styles.leaveChatButton}
                                    onPress={handleGiaiTan}
                                >
                                    <Text style={styles.leaveChatText}>Giải tán nhóm chat</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                )
            }


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: 20,
    },
    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
        padding: 10,
    },
    groupAvatarContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    changeGroupInfo: {
        color: "blue",
        marginTop: 5,
    },
    addMemberButton: {
        alignItems: "center",
        marginTop: 20,
    },
    addMemberText: {
        fontSize: 14,
        color: "black",
        marginTop: 5,
    },
    chatInfoContainer: {
        marginTop: 30,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    infoText: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    leaveChatButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    leaveChatText: {
        fontSize: 16,
        color: "red",
        marginLeft: 10,
    },
});

export default SettingChat
