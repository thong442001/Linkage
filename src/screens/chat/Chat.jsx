import React, { useState, useEffect, useRef } from 'react';
import {
    Platform,
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
import { useSocket } from '../../context/socketContext';
import { useDispatch, useSelector } from 'react-redux';
//import { socket } from "../../utils/index";
import Icon from 'react-native-vector-icons/Ionicons';
import Messagecomponent from "../../components/chat/Messagecomponent";
import {
    getGroupID,
    getMessagesGroup,
    notiCallVideo,
} from '../../rtk/API';
import ChatHeader from '../../components/chat/ChatHeader';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useBottomSheet } from '../../context/BottomSheetContext';
import LottieView from 'lottie-react-native';
const Chat = (props) => {// cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [group, setGroup] = useState(null);
    const [groupAvatar, setGroupAvatar] = useState(null); // Ảnh đại diện nhóm
    const [groupName, setGroupName] = useState(null); // Tên nhóm
    const [ID_user, setID_user] = useState(null);
    const [myUsername, setmyUsername] = useState(null);
    const [myAvatar, setmyAvatar] = useState(null);

    const { socket, onlineUsers } = useSocket();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [reply, setReply] = useState(null);

    const flatListRef = useRef(null); // Tạo ref cho FlatList

    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [status, setstatus] = useState(false);
    const [sendingFiles, setSendingFiles] = useState({});
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    // Thong
    // đang soạn tin nhắn
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const typingUsersInfo = group?.members?.filter(member => typingUsers.includes(member._id));
    const [validateGame, setValidateGame] = useState(true);
    const hasSentLocation = useRef(false); // Biến ref để theo dõi trạng thái gửi
    const [isActive, setIsActive] = useState(false)
    const [isMessNew, setIsMessNew] = useState(false)
    //loading
    const [isGameing, setIsGameing] = useState(false);

    // //gửi vị trí
    useEffect(() => {
        if (params?.locationMessage && !hasSentLocation.current) {
            sendLocationMessage(params?.locationMessage);
            hasSentLocation.current = true; // Đánh dấu đã gửi
        }
    }, [params?.locationMessage]);

    const sendLocationMessage = async (message) => {
        await sendMessage('text', message);
    };
    //call API noti call
    const callNotiCall = async (ID_group, ID_user, isCallVideo) => {
        try {
            await dispatch(notiCallVideo({ ID_group: ID_group, ID_user: ID_user, isCallVideo: isCallVideo }))
                .unwrap()
                .then((response) => {
                    console.log(response.message)
                })
                .catch((error) => {
                    console.log('Error:', error.message);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // call video
    const onCallvieo = () => {
        if (!group) return;
        callNotiCall(group._id, me._id, true);
        //navigation.navigate("Ringing",{ID_group:params?.ID_group,status:true});
        navigation.navigate('Ringing', {
            group: group,
            type: true,
        });
    };
    // call audio
    const onCallAudio = () => {
        console.log('1234')
        if (!group) return;
        console.log('123')
        callNotiCall(group._id, me._id, false);
        //navigation.navigate("Ringing",{ID_group:params?.ID_group,status:false});
        navigation.navigate('Ringing', {
            group: group,
            type: false,
        });
    };

    //up lên cloudiary
    const uploadFile = async (file) => {
        const tempId = Date.now().toString(); // ID tạm thời cho tin nhắn
        setSendingFiles(prev => ({ ...prev, [tempId]: true }));

        // Thêm tin nhắn tạm thời vào danh sách
        setMessages(prev => [
            {
                _id: tempId,
                ID_group: params.ID_group,
                sender: { _id: me._id, first_name: me.first_name, last_name: me.last_name, avatar: me.avatar },
                content: file.uri, // URI tạm thời
                type: file.type.startsWith('image/') ? 'image' : 'video',
                isLoading: true, // Đánh dấu tin nhắn đang tải
                createdAt: new Date().toISOString(),
                message_reactionList: [],
                _destroy: false,
            },
            ...prev,
        ]);
        try {
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.png'),
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post('https://api.cloudinary.com/v1_1/ddbolgs7p/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            //console.log(file.type.type);
            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);

            if (file.type.startsWith('image/')) {
                console.log("image");
                sendMessage('image', fileUrl)
            }
            if (file.type.startsWith('video/')) {
                console.log("video");
                sendMessage('video', fileUrl)
            }

            setSendingFiles(prev => {
                const newState = { ...prev };
                delete newState[tempId];
                return newState;
            });

        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("lỗi khi tải file")
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
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
                //console.log(response);
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

    // Lấy thông tin nhóm và tin nhắn cũ khi component mount
    useEffect(() => {
        const fetchInitialData = async () => {
            if (params?.ID_group) {
                await getInforGroup(params.ID_group);
                await getMessagesOld(params.ID_group);
            }
        };

        fetchInitialData();

        const focusListener = navigation.addListener('focus', () => {
            fetchInitialData();
        });

        return () => {
            focusListener();
        };
    }, [navigation, params?.ID_group]);

    useEffect(() => {

        socket.emit("joinGroup", params?.ID_group);

        // Lắng nghe tin nhắn từ server
        socket.on('receive_message', (data) => {
            setIsMessNew(true);
            setMessages(prevMessages => {
                // Thay thế tin nhắn tạm thời nếu đã tồn tại
                const tempIndex = prevMessages.findIndex(msg => msg.isLoading && msg.type === data.type);
                if (tempIndex !== -1) {
                    const newMessages = [...prevMessages];
                    newMessages[tempIndex] = {
                        _id: data._id,
                        ID_group: data.ID_group,
                        sender: {
                            _id: data.sender,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            avatar: data.avatar,
                        },
                        content: data.content,
                        type: data.type,
                        ID_message_reply: data.ID_message_reply
                            ? { _id: data.ID_message_reply._id, content: data.ID_message_reply.content || 'Tin nhắn không tồn tại' }
                            : null,
                        message_reactionList: [],
                        updatedAt: data.updatedAt,
                        createdAt: data.createdAt,
                        _destroy: data._destroy,
                    };
                    return newMessages;
                }
                return [
                    {
                        _id: data._id,
                        ID_group: data.ID_group,
                        sender: {
                            _id: data.sender,
                            first_name: data.first_name,
                            last_name: data.last_name,
                            avatar: data.avatar,
                        },
                        content: data.content,
                        type: data.type,
                        ID_message_reply: data.ID_message_reply
                            ? { _id: data.ID_message_reply._id, content: data.ID_message_reply.content || 'Tin nhắn không tồn tại' }
                            : null,
                        message_reactionList: [],
                        updatedAt: data.updatedAt,
                        createdAt: data.createdAt,
                        _destroy: data._destroy,
                    },
                    ...prevMessages,
                ];
            });
        });

        // Lắng nghe tin nhắn từ server bị thu hồi
        socket.on('message_revoked', (data) => {
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
        socket.on('receive_message_reation', (data) => {
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

        socket.on("group_deleted", ({ ID_group }) => {
            //console.log(`🗑️ Nhóm ${ID_group} đã bị xóa`);
            goBack();
        });

        socket.on("kicked_from_group", ({ ID_group }) => {
            //console.log(`🚪 Bạn đã bị kick khỏi nhóm ${ID_group}`);
            goBack();
        });

        socket.on("user_typing", ({ ID_group, ID_user }) => {
            //console.log("User: " + ID_user + " đang soạn tin nhắn...");
            if (ID_user == me._id) return;
            setTypingUsers((prev) => [...new Set([...prev, ID_user])]); // Thêm user vào danh sách

        });

        socket.on("user_stop_typing", ({ ID_group, ID_user }) => {
            //console.log("User: " + ID_user + " đang soạn tin nhắn...");
            setTypingUsers((prev) => prev.filter((id) => id !== ID_user)); // Xóa user khỏi danh sách
        });

        socket.on("lang-nghe-moi-choi-game-3-la", (data) => {
            console.log("lang-nghe-moi-choi-game-3-la")
            //console.log(data);
            if (data.sender != me._id) return;
            console.log("lang-nghe-moi-choi-game-3-la1")
            setIsGameing(false);
            navigation.navigate("ManHinhCho", { group: group, ID_message: data._id });
        });

        socket.on("lang-nghe-chap-nhan-choi-game-3-la", () => {
            console.log("lang-nghe-chap-nhan-choi-game-3-la")
        });
        socket.on("lang-nghe-tu-choi-choi-game-3-la", () => {
            console.log("lang-nghe-tu-choi-choi-game-3-la")
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
            socket.off("receive_message_reation");
            socket.off("message_revoked");
            socket.off("receive_message");
            socket.off("group_deleted");
            socket.off("kicked_from_group");
            // đang soạn
            socket.off("user_typing");
            socket.off("user_stop_typing");
            // game
            socket.off("lang-nghe-moi-choi-game-3-la");
            socket.off("lang-nghe-chap-nhan-choi-game-3-la");
            socket.off("lang-nghe-tu-choi-choi-game-3-la");
            // bàn phím
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [group, params?.ID_group, navigation, socket, me]);

    //infor group
    const getInforGroup = async (ID_group) => {
        try {
            await dispatch(getGroupID({ ID_group: ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    console.log("thong show data: ", response);
                    setGroup(response.group)

                    if (response.group.isPrivate == true) {
                        // lấy tên của mình
                        const myUser = response.group.members.find(user => user._id === me._id);
                        //console.log(response.group.members);
                        if (myUser) {
                            setID_user(myUser._id);
                            setmyUsername((myUser.first_name + " " + myUser.last_name));
                            setmyAvatar(myUser.avatar);

                        } else {
                            console.log("⚠️ Không tìm thấy người dùng");
                        }
                        // chat private
                        const otherUser = response.group.members.find(user => user._id !== me._id);

                        if (otherUser) {
                            setGroupName((otherUser.first_name + " " + otherUser.last_name));
                            setIsActive(onlineUsers.includes(otherUser._id));
                            //setGroupName(otherUser.displayName);

                            setGroupAvatar(otherUser.avatar);
                        } else {
                            console.log("⚠️ Không tìm thấy thành viên khác trong nhóm!");
                        }
                    } else {
                        // group
                        // lấy tên của mình
                        const myUser = response.group.members.find(user => user._id === me._id);
                        if (myUser) {
                            setID_user(myUser._id);
                            setmyUsername((myUser.first_name + " " + myUser.last_name));
                            setmyAvatar(myUser.avatar);
                            setIsActive(false);
                        } else {
                            console.log("⚠️ Không tìm thấy người dùng");
                        }
                        if (response.group.avatar == null) {
                            return;
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
                    //console.log(response.messages)
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
    const sendMessage = (type, content) => {
        if (socket == null || (message == null && type === 'text')) {
            return;
        }
        const payload = {
            ID_group: params.ID_group,
            sender: me._id,
            content: content,
            type: type,
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
    };



    const goBack = () => {
        navigation.navigate("HomeChat");
        closeBottomSheet();
        // navigation.goBack();
    };

    const toSettingChat = () => {
        navigation.navigate("SettingChat", { ID_group: group._id });
    };
    const onToGame3La = () => {
        setIsGameing(true);
        const payload = {
            ID_group: params.ID_group,
            me: me._id.toString(),
        };
        socket.emit('moi-choi-game-3-la', payload);
        //navigation.navigate("ManHinhCho", { group: group });
    };
    const onChoiGame3la = (ID_message) => {
        const payload = {
            ID_message: ID_message,
            ID_group: params.ID_group,
        };
        socket.emit('chap-nhan-choi-game-3-la', payload);
        navigation.navigate('InGame3La', { group: group });
    };
    const onHuyGame3la = (ID_message) => {
        const payload = {
            ID_message: ID_message,
            ID_group: params.ID_group,
        };
        socket.emit('tu-choi-choi-game-3-la', payload);
        //navigation.navigate("ManHinhCho", { group: group });
    };

    useEffect(() => {
        // Cuộn lên đầu danh sách tin nhắn khi danh sách tin nhắn thay đổi
        if (isMessNew) {
            setTimeout(() => {
                flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }, 200);
            setIsMessNew(false)
        }
    }, [isMessNew]);

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

    // đang soan tin
    const handleTyping = (text) => {
        setMessage(text);

        if (!isTyping) {
            console.log("typing: " + text)
            socket.emit("typing", { ID_group: params?.ID_group, ID_user: me._id }); // Gửi sự kiện lên server
            setIsTyping(true);
        }

        // Dừng typing sau 1.5s nếu không nhập tiếp
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            console.log("stop_typing: " + text)
            socket.emit("stop_typing", { ID_group: params?.ID_group, ID_user: me._id }); // Gửi sự kiện stop typing
            setIsTyping(false);
        }, 1500);
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
                && <ChatHeader
                    name={groupName}
                    avatar={groupAvatar}
                    onGoBack={goBack}
                    isPrivate={group?.isPrivate}
                    onToSettingChat={toSettingChat}
                    onCallVideo={onCallvieo}
                    onCallAudio={onCallAudio}
                    onToGame3La={onToGame3La}
                    isGameing={isGameing}
                    isActive={isActive}
                />
            }


            <FlatList
                ref={flatListRef} // Gán ref cho FlatList
                contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 10, paddingVertical: 10, justifyContent: 'flex-end' }}
                data={messages || []}
                renderItem={({ item }) => (
                    <Messagecomponent
                        message={item}
                        currentUserID={me._id}
                        onReply={() => setReply(item)}
                        onRevoke={revokeMessage}
                        onIcon={iconMessage}
                        onChoiGame3la={onChoiGame3la}
                        onHuyGame3la={onHuyGame3la}
                    />
                )}
                keyExtractor={(item) => item._id}
                // showsHorizontalScrollIndicator = {false}
                showsVerticalScrollIndicator={false}
                inverted
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

            {/* Đang soạn tin nhắn */}
            {
                typingUsersInfo?.length > 0
                && (
                    <Text style={{ color: "grey" }}>
                        {typingUsersInfo.map(user => `${user.first_name} ${user.last_name}`).join(", ")} đang nhập...
                    </Text>
                )
            }


            {/* Hiển thị reply */}
            {
                reply && (
                    <View style={styles.replyPreview}>
                        <View>
                            <Text style={styles.replyTitle}>Đang trả lời: </Text>
                            <Text style={styles.replyContent}>
                                {
                                    me._id == reply.sender._id
                                        ? ` Bạn: `
                                        : ` ${reply.sender.first_name} ${reply.sender.last_name}: `
                                }
                                {
                                    reply.type === 'text'
                                        ? `${reply.content}`
                                        : reply.type === 'image'
                                            ? 'Ảnh'
                                            : 'Video'
                                }
                            </Text>
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
                    <TouchableOpacity
                        onPress={onOpenGallery}
                    >
                        <Icon name="image" size={25} color="#007bff" />
                    </TouchableOpacity>
                    {/* Gửi vị trí */}
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('MapScreen', {
                                ID_group: params?.ID_group,
                                isGui: true,
                            });
                        }}
                        style={styles.menuItem}>
                        <Icon name="navigate-outline" size={24} color="#007bff" />
                    </TouchableOpacity>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message"
                    placeholderTextColor={'grey'}
                    value={message}
                    //onChangeText={setMessage}
                    onChangeText={handleTyping}
                />
                {/* <TouchableOpacity
                    onPress={() => sendMessage('text', message)}
                    style={styles.sendButton}
                >
                    <Text style={styles.sendText}>Send</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                    onPress={() => sendMessage('text', message)}
                    style={styles.sendButton}
                >
                    <View>
                        <Icon name="send" size={25} color='#007bff' />
                    </View>
                    {/* <Text style={styles.sendText}>Send</Text> */}
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
        marginRight: 10
    },
    container: {
        flex: 1,
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
        backgroundColor: '#ffffff',
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        // borderTopWidth: 1,
        // borderTopColor: '#ccc',
        justifyContent: 'space-between',  // Chia đều khoảng cách giữa các phần

    },
    input: {
        flex: 1,
        // borderWidth: 1,
        padding: 10,
        borderRadius: 20,
        color: 'black',
        // borderColor: 'gray',
        backgroundColor: '#d9d9d9d9',
        // paddingHorizontal: 10,
    },
    sendButton: {
        marginLeft: 10,
        // backgroundColor: '#007bff',
        // padding: 10,
        // borderRadius: 20,
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