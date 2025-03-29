import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Modal } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getGroupID,
    deleteMember,
    deleteGroup,
} from '../../rtk/API';
import QRCode from 'react-native-qrcode-svg';
const { width, height } = Dimensions.get('window');
import { useSocket } from '../../context/socketContext';

const SettingChat = (props) => { // cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;

    const { socket } = useSocket();
    // console.log('Setting: ', params.ID_group);
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);
    const [qrVisible, setQrVisible] = useState(false); // 🔥 State để hiển thị modal QR


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
                    // Emit sự kiện "delete_group" để cập nhật danh sách nhóm
                    socket.emit("delete_group", { ID_group: params.ID_group });
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
                        <Icon name="arrow-back" size={24} color="black" />
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
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={styles.addMemberButton}
                                onPress={toAddFriendGroup}
                            >
                                <View style={styles.boxIconAdd}>
                                    <Icon name="person-add" size={23} color="black" />
                                </View>
                                <Text style={styles.addMemberText}>Thêm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setQrVisible(true)}>
                                <Icon name="qr-code-outline" size={22} color="black" />
                            </TouchableOpacity>
                        </View>

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
            {
                group != null && (
                    <Modal
                        visible={qrVisible}
                        transparent
                        onRequestClose={() => setQrVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                {/* Name group */}
                                {
                                    group.name == null
                                        ? (
                                            <Text style={styles.modalTitle}>Nhóm chưa có tên</Text>
                                        ) : (
                                            <Text style={styles.modalTitle}>Nhóm: {group.name}</Text>
                                        )
                                }
                                <QRCode
                                    value={`linkage://addgroup/${params.ID_group}`}
                                    size={200}
                                />
                                <TouchableOpacity
                                    onPress={() => setQrVisible(false)}
                                    style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Đóng</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                )
            }

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
        padding: width * 0.05, // 5% chiều rộng màn hình
    },
    backButton: {
        position: "absolute",
        top: height * 0.03, // 3% chiều cao màn hình
        left: width * 0.02, // 2% chiều rộng màn hình
        padding: width * 0.025, // 2.5% chiều rộng màn hình
    },
    groupAvatarContainer: {
        alignItems: "center",
        marginTop: height * 0.07, // 7% chiều cao màn hình
    },
    avatar: {
        width: width * 0.25, // 25% chiều rộng màn hình
        height: width * 0.25, // 25% chiều rộng màn hình
        borderRadius: width * 0.125, // 12.5% chiều rộng màn hình
    },
    groupName: {
        fontSize: width * 0.045, // 4.5% chiều rộng màn hình
        fontWeight: "bold",
        marginTop: height * 0.015, // 1.5% chiều cao màn hình
        color: 'black',
    },
    changeGroupInfo: {
        color: "blue",
        marginTop: height * 0.01, // 1% chiều cao màn hình
    },
    addMemberButton: {
        alignItems: "center",
        marginVertical: height * 0.025, // 2.5% chiều cao màn hình
    },
    addMemberText: {
        fontSize: width * 0.035, // 3.5% chiều rộng màn hình
        color: "black",
        marginTop: height * 0.007, // 0.7% chiều cao màn hình
    },
    chatInfoContainer: {
        marginTop: height * 0.04, // 4% chiều cao màn hình
        backgroundColor: "white",
        borderRadius: width * 0.025, // 2.5% chiều rộng màn hình
        padding: width * 0.03, // 3% chiều rộng màn hình
    },
    infoItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: height * 0.02, // 2% chiều cao màn hình
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    infoText: {
        flex: 1,
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        marginLeft: width * 0.03, // 3% chiều rộng màn hình
        color: 'black',
    },
    leaveChatButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: height * 0.02, // 2% chiều cao màn hình
    },
    leaveChatText: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        color: "red",
        marginLeft: width * 0.03, // 3% chiều rộng màn hình
    },
    boxIconAdd: {
        backgroundColor: '#d9d9d960',
        padding: width * 0.03, // 3% chiều rộng màn hình
        borderRadius: width * 0.2, // 20% chiều rộng màn hình
    },
    //modal qr
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    modalTitle: { fontSize: 18, fontWeight: 'medium', marginBottom: 10, color: 'black' },
    closeButton: {
        marginTop: 10,
        paddingHorizontal: 80,
        paddingVertical: 5,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButtonText: { color: 'white', fontSize: 16 },
});

export default SettingChat
