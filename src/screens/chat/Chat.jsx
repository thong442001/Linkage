import React, { useState, useEffect, useRef } from 'react';
import {
    ToastAndroid,
    Platform,
    PermissionsAndroid,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Keyboard,
    Pressable, // bàn phím
} from 'react-native';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
//import { socket } from "../../utils/index";
import Icon from 'react-native-vector-icons/Ionicons';
import Messagecomponent from "../../components/chat/Messagecomponent";
import {
    getGroupID,
    getMessagesGroup,
} from '../../rtk/API';
import ChatHeader from '../../components/chat/ChatHeader';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
const Chat = (props) => {// cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);
    const [groupAvatar, setGroupAvatar] = useState(null); // Ảnh đại diện nhóm
    const [groupName, setGroupName] = useState(null); // Tên nhóm

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState(null);

    const flatListRef = useRef(null); // Tạo ref cho FlatList

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);


    // Hàm yêu cầu quyền camera
    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('✅ Quyền camera đã được cấp!');
                return true;
            } else if (granted === PermissionsAndroid.RESULTS.DENIED) {
                console.log('❌ Người dùng từ chối quyền camera.');
                return false;
            } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
                console.log('🚫 Người dùng đã chặn quyền camera.');
                Alert.alert(
                    'Quyền bị từ chối',
                    'Bạn cần cấp quyền camera trong Cài đặt để tiếp tục sử dụng.',
                    [{ text: 'Mở Cài đặt', onPress: () => Linking.openSettings() }]
                );
                return false;
            }
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    //up lên cloudiary
    const uploadFile = async (file) => {
        try {
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.jpg'),
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post('https://api.cloudinary.com/v1_1/ddbolgs7p/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);
        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("lỗi khi tải file")
        }
    };

    //mở thư viện
    const onOpenGallery = async () => {
        try {
            const options = {
                mediaType: 'mixed',
                quality: 1,
            };

            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log("đã hủy")
                } else if (response.errorMessage) {
                    console.log("lỗi khi mở thư viện")
                } else {
                    const selectedFile = response.assets[0];
                    console.log('📂 File đã chọn:', selectedFile.uri);

                    await uploadFile(selectedFile);
                }
            });
        } catch (error) {
            console.log('onOpenGallery -> ', error);
        }
    };

    //mở camera
    const onOpenCamera = async () => {
        const permissionGranted = await requestCameraPermission();
        if (!permissionGranted) return;

        try {
            const options = {
                mediaType: 'mixed', // Cho phép chụp ảnh hoặc quay video
                quality: 1,
                cameraType: 'back', // Dùng camera sau
                saveToPhotos: true, // Lưu vào thư viện
            };

            launchCamera(options, async (response) => {
                if (response.didCancel) {
                    console.log("đã hủy")
                } else if (response.errorMessage) {
                    console.log("lỗi khi mở camera")
                } else {
                    const capturedFile = response.assets[0];
                    console.log('📷 File đã chụp/quay:', capturedFile.uri);

                    await uploadFile(capturedFile);
                }
            });
        } catch (error) {
            console.log('onOpenCamera -> ', error);
        }
    };




    useEffect(() => {
        // lấy name vs avt
        getInforGroup(params?.ID_group);
        // lấy messages old
        getMessagesOld(params?.ID_group);

        // Kết nối tới server

        const newSocket = io('https://linkage.id.vn', {
            transports: ['websocket', 'polling'],
            reconnection: true,   // Cho phép tự động kết nối lại
            reconnectionAttempts: 5, // Thử kết nối lại tối đa 5 lần
            timeout: 5000, // Chờ tối đa 5 giây trước khi báo lỗi
        });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Kết nối thành công:', newSocket.id);
            newSocket.emit("joinGroup", params?.ID_group);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Lỗi kết nối:', err.message);
        });
        newSocket.on('disconnect', () => {
            console.log('Mất kết nối với server');
        });

        // Lắng nghe tin nhắn từ server
        newSocket.on('receive_message', (data) => {
            console.log(data);
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    _id: data._id,
                    ID_group: data.ID_group,
                    sender: {
                        _id: data.sender,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        //displayName: data.displayName, // Lấy tên hiển thị từ sender
                        avatar: data.avatar            // Lấy avatar từ sender
                    },
                    content: data.content,
                    type: data.type,
                    ID_message_reply: data.ID_message_reply
                        ? {
                            _id: data.ID_message_reply._id,
                            content: data.ID_message_reply.content || "Tin nhắn không tồn tại",
                        }
                        : null,
                    message_reactionList: [],
                    updatedAt: data.updatedAt,
                    createdAt: data.createdAt,
                    _destroy: data._destroy
                }
            ]);
        });

        // Lắng nghe tin nhắn từ server bị thu hồi
        newSocket.on('message_revoked', (data) => {
            //console.log("🔥 Đã nhận được message_revoked:");
            setMessages(prevMessages => {
                const updatedMessages = prevMessages?.map(msg =>
                    msg._id === data.ID_message ? { ...msg, _destroy: true } : msg
                );
                //console.log("📌 Danh sách tin nhắn sau khi thu hồi:", updatedMessages);
                return updatedMessages;
            });
        });

        // Lắng nghe tin nhắn từ server biểu cảm
        newSocket.on('receive_message_reation', (data) => {
            //console.log("🔥 Đã nhận được receive_message_reation:" + data);
            setMessages(prevMessages => {
                return prevMessages?.map((msg) => {
                    if (msg._id === data.ID_message) {
                        // Copy danh sách cũ
                        let updatedReactions = [...msg.message_reactionList];
                        //msg.message_reactionList.map()
                        // Kiểm tra xem đã có message_reaction có tồn tại chưa
                        const reactionIndex = updatedReactions.findIndex(
                            (reaction) => reaction._id === data._id
                        );
                        if (reactionIndex !== -1) {
                            // Nếu reaction đã tồn tại, tăng quantity
                            updatedReactions[reactionIndex] = {
                                ...updatedReactions[reactionIndex],
                                quantity: updatedReactions[reactionIndex].quantity + 1
                            };
                        } else {
                            // Nếu reaction chưa có, thêm mới vào danh sách
                            updatedReactions.push({
                                _id: data._id,
                                ID_message: data.ID_message,
                                ID_user: {
                                    _id: data.ID_user._id,
                                    first_name: data.ID_user.first_name,
                                    last_name: data.ID_user.last_name,
                                    //displayName: data.ID_user.displayName,
                                    avatar: data.ID_user.avatar,
                                },
                                ID_reaction: {
                                    _id: data.ID_reaction._id,
                                    name: data.ID_reaction.name,
                                    icon: data.ID_reaction.icon,
                                },
                                quantity: data.quantity,
                                updatedAt: data.updatedAt,
                                createdAt: data.createdAt,
                                _destroy: data._destroy,
                            });
                            console.log(data.ID_reaction.icon,);
                        }

                        return {
                            ...msg,
                            message_reactionList: updatedReactions
                        };
                    }
                    return msg; // Nếu không phải message cần cập nhật, giữ nguyên
                });
            });
        });

        //bàn phím
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardHeight(e.endCoordinates.height);
            setKeyboardVisible(true);
        });
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardHeight(0);
            setKeyboardVisible(false);
        });

        return () => {
            console.log('Ngắt kết nối socket');
            newSocket.disconnect();
            // bàn phím
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [params?.ID_group]);

    //infor group
    const getInforGroup = async (ID_group) => {
        try {
            await dispatch(getGroupID({ ID_group: ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    setGroup(response.group)
                    if (response.group.isPrivate == true) {
                        // chat private
                        //console.log(response.group.members);
                        const otherUser = response.group.members.find(user => user._id !== me._id);
                        if (otherUser) {
                            setGroupName((otherUser.first_name + " " + otherUser.last_name));
                            //setGroupName(otherUser.displayName);
                            setGroupAvatar(otherUser.avatar);
                        } else {
                            console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
                        }
                    } else {
                        // group 
                        if (response.group.avatar == null) {
                            setGroupAvatar('https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Anlene%2Flogo.png?alt=media&token=f98a4e03-1a8e-4a78-8d0e-c952b7cf94b4');
                        } else {
                            setGroupAvatar(response.group.avatar);
                        }
                        if (response.group.name == null) {
                            const names = response.group.members
                                .filter(user => user._id !== me._id)
                                .map(user => `${user.first_name} ${user.last_name}`)
                                .join(", ");
                            // Cập nhật state một lần duy nhất
                            setGroupName(names);
                        } else {
                            setGroupName(response.group.name);
                        }
                    }
                })
                .catch((error) => {
                    console.log('Error1:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api getMessagesGroupID
    const getMessagesOld = async (ID_group) => {
        try {
            await dispatch(getMessagesGroup({ ID_group: ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    console.log(response.messages)
                    setMessages(response.messages);
                })
                .catch((error) => {
                    console.log('Error2:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // gửi tin nhắn
    const sendMessage = () => {
        if (socket && message) {
            const payload = {
                ID_group: params.ID_group,
                sender: me._id,
                content: message,
                type: 'text',
                ID_message_reply: reply
                    ? {
                        _id: reply._id,
                        content: reply.content || "Tin nhắn không tồn tại", // Đảm bảo không bị undefined
                    }
                    : null,
            };
            socket.emit('send_message', payload);
            setMessage('');
            setReply(null); // Xóa tin nhắn trả lời sau khi gửi
            Keyboard.dismiss();// tắc bàn phím
        }
    };

    const goBack = () => {
        navigation.navigate("HomeChat");
    };

    const toSettingChat = () => {
        navigation.navigate("SettingChat", { ID_group: group._id });
    };

    useEffect(() => {
        // Cuộn xuống tin nhắn cuối cùng khi danh sách tin nhắn thay đổi
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 200);
    }, [messages]);

    // Xử lý thu hồi tin nhắn
    const revokeMessage = (ID_message) => {
        const payload = {
            ID_message: ID_message,
            ID_group: params.ID_group
        };
        socket.emit('revoke_message', payload);
        //console.log("Sự kiện thu hồi tin nhắn đã phát đi:", ID_message);
    };

    // Xử lý thả biểu cảm tin nhắn
    const iconMessage = (ID_message, ID_reaction) => {
        const payload = {
            ID_group: params.ID_group,
            ID_message: ID_message,
            ID_user: me._id,
            ID_reaction: ID_reaction,
        };
        socket.emit('send_message_reaction', payload);
    };

    return (
        <View style={[styles.container,
        {
            //paddingBottom: keyboardHeight
            paddingBottom: Dimensions.get('window').height * 0.1,
        }]}>
            {/* <FlatList
                data={messages}
                renderItem={({ item }) => (
                    <View style={styles.messageContainer}>
                        <Text style={styles.username}>{item.user}:</Text>
                        <Text style={styles.message}>{item.text}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            /> */}
            {
                (groupName != null
                    && groupAvatar != null)
                && < ChatHeader
                    name={groupName}
                    avatar={groupAvatar}
                    onGoBack={goBack}
                    isPrivate={group?.isPrivate}
                    onToSettingChat={toSettingChat}
                />
            }
            <FlatList
                ref={flatListRef} // Gán ref cho FlatList
                contentContainerStyle={{ flexGrow: 1 }}
                data={messages || []}
                renderItem={({ item }) => (
                    <Messagecomponent
                        message={item}
                        currentUserID={me._id}
                        onReply={() => setReply(item)}
                        onRevoke={revokeMessage}
                        onIcon={iconMessage}
                    />
                )}
                keyExtractor={(item) => item._id}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
            {/* bàn phím */}
            {
                keyboardVisible && (
                    <View style={styles.keyboardSpacer} />
                )
            }
            {/* <TextInput
                style={styles.input}
                placeholder="Type a message"
                value={message}
                onChangeText={setMessage}
            />
            <Button title="Send" onPress={sendMessage} /> */}


            {/* Hiển thị reply */}
            {
                reply && (
                    <View style={styles.replyPreview}>
                        <View>
                            <Text style={styles.replyTitle}>Đang trả lời: </Text>
                            <Text style={styles.replyContent}>{reply.content}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.replyRight}
                            onPress={() => setReply(null)}
                        >
                            <Text style={styles.replyTitle}>✖</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            <View style={styles.inputContainer}>
                {/* Thư Viện */}
                <View style={styles.librarySelect}>
                    <Pressable
                        onPress={onOpenGallery}>
                        <Icon name="image" size={25} />
                    </Pressable>


                    <Pressable
                        onPress={onOpenCamera}>
                        <Icon name="camera" size={25} />
                    </Pressable>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor={'grey'}
                    value={message}
                    onChangeText={setMessage}
                />
                <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity>
            </View>

        </View >
    )
}

export default Chat

const styles = StyleSheet.create({
    librarySelect: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    username: {
        fontWeight: 'bold',
        marginRight: 5,
        color: 'black',
    },
    message: {
        color: 'black',
        borderRadius: 5,
        padding: 10,
    },
    // bàn phím
    inputContainer: {
        height: Dimensions.get('window').height * 0.1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8f8f8',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        justifyContent: 'space-between',  // Chia đều khoảng cách giữa các phần

    },
    input: {
        flex: 0.95,
        borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        color: 'black',
        height: 40,
        borderColor: 'gray',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    sendButton: {
        marginLeft: 10,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 20,
    },
    sendText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    keyboardSpacer: {
        //backgroundColor: 'blue',
        height: Platform.OS === 'ios' ? 20 : 10, // Adjust spacer height based on platform
    },
    //reply
    replyPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: 'grey',
    },
    replyTitle: {
        color: 'black',
    },
    replyContent: {
        color: 'grey',
    },
    replyRight: {
        alignItems: 'flex-end',
    }
});
