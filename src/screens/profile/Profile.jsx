import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Modal,
    Pressable,
    Alert
} from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfilePage from '../../components/items/ProfilePage';
import Friends from '../../components/items/Friends';
import { useDispatch, useSelector } from 'react-redux';
import {
    joinGroupPrivate,
    guiLoiMoiKetBan,
    chapNhanLoiMoiKetBan,
    huyLoiMoiKetBan,
    editAvatarOfUser,
    editBackgroundOfUser,
    allProfile, // allProfile
    changeDestroyPost, // changeDestroy
} from '../../rtk/API';
import { Snackbar } from 'react-native-paper'; // thông báo (ios and android)
import HomeS from '../../styles/screens/home/HomeS';
import ProfileS from '../../styles/screens/profile/ProfileS';
import SelectAvatarDialog from '../../components/dialog/SelectAvatarDialog';
import styles from '../../styles/screens/friend/FriendNoti';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { changeAvatar, changeBackground } from '../../rtk/Reducer';
import axios from 'axios';
import messaging from '@react-native-firebase/messaging';
import ProfileLoading from '../../utils/skeleton_loading/ProfileLoading';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import { sendPushNotification } from '../services/NotificationService';
const Profile = props => {
    const { route, navigation } = props;
    const { params } = route;

    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);
    const [avatar, setavatar] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    const FCM_SERVER_KEY = "BOa0rmhBQ7uccvqyUyiwuj-U7e_ljHnHI_jyZhobPyBPNJmP6AadvOuZc8dVd8QKxdFKpBp_RD-vWwEdc0R5o54";

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [relationship, setRelationship] = useState(null);
    const [friendRelationships, setFriendRelationships] = useState(null);
    const [stories, setStories] = useState(null);
    // visible phản hồi kết bạn
    const [menuVisible, setMenuVisible] = useState(false);
    // dialog reLoad
    const [dialogReLoad, setDialogreload] = useState(false);
    const [loading, setloading] = useState(true)


    const openImageModal = imageUrl => {

        setSelectedImage(imageUrl);
        setImageModalVisible(true);

    };


    const closeImageModal = () => {
        setImageModalVisible(false);
        setSelectedImage(null);
        closeBottomSheet();
    };


    const openBottomSheetAvatar = () => {
        if (stories?.stories.length > 0) {
            // Nếu có story, mở Bottom Sheet với thêm tùy chọn xem story
            openBottomSheet(30, detail_selection_image());
        } else {
            // Nếu không có story, chỉ mở Bottom Sheet với các tùy chọn hình ảnh
            openBottomSheet(22, detail_selection_image());
        }
    };




    //up lên cloudiary
    const uploadFile = async file => {
        try {
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName,
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/ddbolgs7p/upload',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            console.log('📂 Response từ Cloudinary:', response.data); // Kiểm tra dữ liệu nhận về

            if (!response.data.secure_url) {
                throw new Error('Không nhận được secure_url từ Cloudinary!');
            }

            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);
            setavatar(fileUrl);
            return fileUrl;
        } catch (error) {
            console.error(
                'Lỗi uploadFile:',
                error.response ? error.response.data : error.message,
            );
            return null;
        }
    };

    //đổi avatar
    const onOpenGalleryChangeAvatar = async () => {
        try {
            const options = { mediaType: 'image', quality: 1 };

            launchImageLibrary(options, async response => {
                if (response.didCancel) {
                    console.log('Đã hủy chọn ảnh');
                    return;
                }

                if (response.errorMessage) {
                    console.log('Lỗi khi mở thư viện:', response.errorMessage);
                    return;
                }

                const selectedFile = response.assets?.[0];
                if (!selectedFile) {
                    console.log('Không có ảnh nào được chọn!');
                    return;
                }

                console.log('📂 File đã chọn:', selectedFile.uri);

                const fileUrl = await uploadFile(selectedFile);
                if (!fileUrl) {
                    console.log('❌ Upload ảnh thất bại!');
                    return;
                }

                const data = { ID_user: me._id, avatar: fileUrl };
                dispatch(editAvatarOfUser(data))
                    .unwrap()
                    .then(res => {
                        console.log('🔥 Cập nhật avatar response:', res);
                        if (res.status) {
                            dispatch(changeAvatar(fileUrl));
                            console.log('✅ Đổi avatar thành công');
                            closeBottomSheet();
                        } else {
                            console.log('❌ Đổi avatar thất bại');
                        }
                    })
                    .catch(err => {
                        console.log('❌ Lỗi khi gửi API đổi avatar:', err);
                    });
            });
        } catch (error) {
            console.log('Lỗi onOpenGallery:', error);
        }
    };

    //đổi ảnh bìa
    const onOpenGalleryChangeBackground = async () => {
        try {
            const options = { mediaType: 'image', quality: 1 };

            launchImageLibrary(options, async response => {
                if (response.didCancel) {
                    console.log('Đã hủy chọn ảnh');
                    return;
                }

                if (response.errorMessage) {
                    console.log('Lỗi khi mở thư viện:', response.errorMessage);
                    return;
                }

                const selectedFile = response.assets?.[0];
                if (!selectedFile) {
                    console.log('Không có ảnh nào được chọn!');
                    return;
                }

                console.log('📂 File đã chọn:', selectedFile.uri);

                const fileUrl = await uploadFile(selectedFile);
                if (!fileUrl) {
                    console.log('❌ Upload ảnh thất bại!');
                    return;
                }

                const data = { ID_user: me._id, background: fileUrl };
                dispatch(editBackgroundOfUser(data))
                    .unwrap()
                    .then(res => {
                        console.log('🔥 Cập nhật background response:', res);
                        if (res.status) {
                            dispatch(changeBackground(fileUrl));
                            console.log('✅ Đổi background thành công');
                            closeBottomSheet();
                        } else {
                            console.log('❌ Đổi background thất bại');
                        }
                    })
                    .catch(err => {
                        console.log('❌ Lỗi khi gửi API đổi background:', err);
                    });
            });
        } catch (error) {
            console.log('Lỗi onOpenGallery:', error);
        }
    };


    // Chạy lại nếu params._id hoặc me thay đổi
    // để vào trang profile bạn bè
    // useEffect(() => {
    //     callAllProfile();
    //     //callGetAllFriendOfID_user();
    // }, [params?._id, me]);

    useFocusEffect(
        useCallback(() => {
            callAllProfile(); // Gọi API load dữ liệu
        }, [params?._id, me])
    );

    //bottom sheet
    const detail_selection_image = () => {
        return (
            <View style={ProfileS.containerBottomSheet}>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>

                {/* Các tùy chọn */}
                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={onOpenGalleryChangeAvatar}>
                    <View style={ProfileS.anhBia}>
                        <Icon name="images" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Đổi ảnh đại diện</Text>
                </TouchableOpacity>




                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={() => openImageModal(user?.avatar)}>
                    <View style={ProfileS.anhBia}>
                        <Icon name="images" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Xem ảnh đại diện</Text>
                </TouchableOpacity>


                {stories?.stories.length > 0 &&
                    (
                        <TouchableOpacity
                            style={ProfileS.option}
                            onPress={() => {
                                closeBottomSheet();
                                navigation.navigate('StoryViewer', { StoryView: stories });
                            }}>
                            <View style={ProfileS.anhBia}>
                                <Icon name="images" size={25} />
                            </View>
                            <Text style={ProfileS.optionText}>Xem story</Text>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    };
    const detail_selection_background = () => {
        return (
            <View style={ProfileS.containerBottomSheet}>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>

                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={onOpenGalleryChangeBackground}>
                    <View style={ProfileS.anhBia}>
                        <Icon name="images" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Đổi ảnh bìa</Text>
                </TouchableOpacity>




                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={() => openImageModal(user?.background)}>
                    <View style={ProfileS.anhBia}>
                        <Icon name="images" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Xem ảnh bìa</Text>
                </TouchableOpacity>
            </View>
        );
    };

    //callAllProfile
    const callAllProfile = async () => {
        try {
            setloading(true)
            const paramsAPI = {
                ID_user: params?._id,
                me: me._id,
            };
            await dispatch(allProfile(paramsAPI))
                .unwrap()
                .then(response => {
                    setUser(response.user);
                    setPosts(response.posts);
                    setRelationship(response.relationship);
                    setFriendRelationships(response.friends);
                    setStories({
                        user: {
                            _id: response.user._id,
                            avatar: response.user.avatar,
                            first_name: response.user.first_name,
                            last_name: response.user.last_name,
                        },
                        stories: response.stories || []
                    });
                    setloading(false);
                })
                .catch(error => {
                    console.log('Error2 callGuiLoiMoiKetBan:', error);
                    setloading(false);
                    setDialogreload(true);
                });
        } catch (error) {
            console.log(error);
            setloading(false);
        }
    };

    const sendPushNotification = async (token, title, body, data = {}) => {
        try {
            const response = await axios.post(
                "https://fcm.googleapis.com/v1/projects/linkage-9deac/messages:send",
                {
                    to: token,
                    notification: {
                        title,
                        body,
                        sound: "default",
                    },
                    data: data,
                },
                {
                    headers: {
                        Authorization: `key=${FCM_SERVER_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("✅ Gửi thông báo thành công!", response.data);
        } catch (error) {
            console.error("❌ Lỗi khi gửi thông báo FCM:", error.response?.data || error.message);
        }
    };

    const callGuiLoiMoiKetBan = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
                me: me._id,
            };

            await dispatch(guiLoiMoiKetBan(paramsAPI))
                .unwrap()
                .then(async (response) => {
                    setRelationship(response.relationship);

                    // 📌 Lưu thông báo vào Firebase
                    const notificationRef = database().ref(`notifications/${user._id}`);
                    const newNotificationRef = notificationRef.push();

                    await newNotificationRef.set({
                        senderId: me._id,
                        senderName: `${me.first_name} ${me.last_name}`,
                        type: 'friend_request',
                        avatar: user.avatar,
                        timestamp: new Date().toISOString(),
                        status: 'pending',
                    });

                    console.log("✅ Lời mời kết bạn đã được lưu vào Firebase");

                    // 📌 Lấy FCM Token của người nhận từ Firebase
                    const tokenSnapshot = await database().ref(`users/${user._id}/fcmToken`).once('value');
                    const fcmToken = tokenSnapshot.val();

                    if (fcmToken) {
                        console.log(`📩 Đang gửi thông báo đến user ${user._id} với token: ${fcmToken}`);

                        // 🚀 Gửi Push Notification qua FCM
                        sendPushNotification(
                            fcmToken,
                            "📩 Lời mời kết bạn mới!",
                            `${me.first_name} đã gửi cho bạn một lời mời kết bạn.`
                        );
                    } else {
                        console.log("❌ Không tìm thấy FCM Token của người nhận!");
                    }
                })
                .catch(error => {
                    console.log('❌ Lỗi khi gửi lời mời:', error);
                    setDialogreload(true);
                });
        } catch (error) {
            console.log(error);
        }
    };



    //chapNhanLoiMoiKetBan
    const callChapNhanLoiMoiKetBan = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
            };
            await dispatch(chapNhanLoiMoiKetBan(paramsAPI))
                .unwrap()
                .then(response => {
                    //console.log(response);
                    setRelationship(response.relationship);
                })
                .catch(error => {
                    console.log('Error2 callChapNhanLoiMoiKetBan:', error);
                    setDialogreload(true);
                });
        } catch (error) {
            console.log(error);
        }
    };

    //huyLoiMoiKetBan
    const callHuyLoiMoiKetBan = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
            };
            await dispatch(huyLoiMoiKetBan(paramsAPI))
                .unwrap()
                .then(response => {
                    //console.log(response);
                    setRelationship(response.relationship);
                })
                .catch(error => {
                    console.log('Error2 callHuyLoiMoiKetBan:', error);
                    setDialogreload(true);
                });
        } catch (error) {
            console.log(error);
        }
    };

    //chat
    const getID_groupPrivate = async (user1, user2) => {
        try {
            const paramsAPI = {
                user1: user1,
                user2: user2,
            };
            await dispatch(joinGroupPrivate(paramsAPI))
                .unwrap()
                .then(response => {
                    //console.log(response);
                    //setID_groupPrivate(response.ID_group);
                    navigation.navigate('Chat', { ID_group: response.ID_group });
                })
                .catch(error => {
                    console.log('Error1:', error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    // call api callChangeDestroyPost
    const callChangeDestroyPost = async (ID_post) => {
        try {
            //console.log('Xóa bài viết với ID:', ID_post);

            await dispatch(changeDestroyPost({ _id: ID_post }))
                .unwrap()
                .then(response => {
                    //console.log('Xóa thành công:', response);
                    setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
                })
                .catch(error => {
                    console.log('Lỗi khi xóa bài viết:', error);
                });
        } catch (error) {
            console.log('Lỗi trong callChangeDestroyPost:', error);
        }
    };

    // Hàm cập nhật bài post sau khi thả biểu cảm
    const updatePostReaction = (ID_post, newReaction, ID_post_reaction) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id !== ID_post) return post; // Không phải bài post cần cập nhật

                // Tìm reaction của user hiện tại
                const existingReactionIndex = post.post_reactions.findIndex(
                    reaction => reaction.ID_user._id === me._id
                );

                let updatedReactions = [...post.post_reactions];

                if (existingReactionIndex !== -1) {
                    // Nếu user đã thả reaction, cập nhật reaction mới
                    updatedReactions[existingReactionIndex] = {
                        ...updatedReactions[existingReactionIndex],
                        ID_reaction: newReaction
                    };
                } else {
                    // Nếu user chưa thả reaction, thêm mới
                    updatedReactions.push({
                        _id: ID_post_reaction, // ID của reaction mới từ server
                        ID_user: {
                            _id: me._id,
                            first_name: me.first_name, // Sửa lại đúng key
                            last_name: me.last_name,
                            avatar: me.avatar,
                        },
                        ID_reaction: newReaction
                    });
                }

                return { ...post, post_reactions: updatedReactions };
            })
        );
    };


    const onChat = async () => {
        await getID_groupPrivate(params?._id, me?._id);
    };

    const headerFriends = () => {
        if (loading) {
            return <ProfileLoading />
        }
        return (
            <View style={ProfileS.container1}>
                <View style={ProfileS.boxHeader}>
                    {/* Hiển thị Snackbar dưới cùng màn hình */}
                    <Snackbar
                        visible={dialogReLoad}
                        onDismiss={() => {
                            setDialogreload(false);
                        }}
                        duration={1000}>
                        làm mới!
                    </Snackbar>
                    <View>
                        <View>
                            <Pressable onPress={() => openBottomSheet(25, detail_selection_background)}>
                                {user?.background != null ? (
                                    <Image
                                        style={ProfileS.backGroundImage}
                                        // source={{ uri: user?.background }}
                                        source={{ uri: user?.background }}
                                    />
                                ) : (
                                    <Image
                                        style={ProfileS.backGroundImage}
                                        source={require('./../../../assets/images/phongcanh.jpg')}
                                    />
                                )}
                            </Pressable>

                            <Pressable
                                onPress={openBottomSheetAvatar}
                            >
                                {user && (
                                    <Image
                                        style={[
                                            ProfileS.avata,
                                            stories?.stories.length > 0 ? ProfileS.avatarWithStory : null,
                                        ]}
                                        source={{ uri: user?.avatar }}
                                    />
                                )}
                            </Pressable>

                            <Modal
                                visible={isImageModalVisible}
                                transparent={true}
                                animationType="fade"
                                onRequestClose={{ closeImageModal }}>
                                <View style={ProfileS.modalContainer}>
                                    <TouchableWithoutFeedback onPress={closeImageModal}>
                                        <View style={ProfileS.modalBackground} />
                                    </TouchableWithoutFeedback>

                                    {selectedImage ? (
                                        <Image
                                            source={{ uri: selectedImage }}
                                            style={ProfileS.fullImage}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <Image
                                            source={require('./../../../assets/images/phongcanh.jpg')}
                                            style={ProfileS.fullImage}
                                            resizeMode="contain"
                                        />
                                    )}

                                    <TouchableOpacity
                                        style={ProfileS.closeButton}
                                        onPress={closeImageModal}>
                                        <Icon
                                            name="close-circle-outline"
                                            size={40}
                                            color={'white'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </Modal>
                        </View>
                        <View style={ProfileS.boxBackground}>
                            <Text style={ProfileS.name}>
                                {' '}
                                {user?.first_name} {user?.last_name}
                            </Text>
                            <View style={ProfileS.boxInformation}>
                                <Text style={ProfileS.friendNumber}>{friendRelationships.length} </Text>
                                <Text style={[ProfileS.friendNumber, { color: '#D6D6D6' }]}>
                                    {' '}
                                    Người bạn
                                </Text>
                            </View>

                            {/* btn me vs friend */}
                            {user &&
                                (user._id !== me._id ? (
                                    <View>
                                        {relationship?.relation == 'Người lạ' && (
                                            <TouchableOpacity
                                                style={ProfileS.btnAddStory}
                                                onPress={callGuiLoiMoiKetBan}>
                                                <Text style={ProfileS.textAddStory}>+ Thêm bạn bè</Text>
                                            </TouchableOpacity>
                                        )}
                                        {relationship?.relation == 'Bạn bè' && (
                                            <TouchableOpacity style={ProfileS.btnAddStory}>
                                                <Text style={ProfileS.textAddStory}>Bạn bè</Text>
                                            </TouchableOpacity>
                                        )}
                                        {((relationship?.ID_userA == me._id &&
                                            relationship?.relation == 'A gửi lời kết bạn B') ||
                                            (relationship?.ID_userB == me._id &&
                                                relationship?.relation == 'B gửi lời kết bạn A')) && (
                                                <TouchableOpacity
                                                    style={ProfileS.btnAddStory}
                                                    onPress={callHuyLoiMoiKetBan}>
                                                    <Text style={ProfileS.textAddStory}>Hủy lời mời</Text>
                                                </TouchableOpacity>
                                            )}
                                        {((relationship?.ID_userA == me._id &&
                                            relationship?.relation == 'B gửi lời kết bạn A') ||
                                            (relationship?.ID_userB == me._id &&
                                                relationship?.relation == 'A gửi lời kết bạn B')) && (
                                                /* Nhấn để mở menu */
                                                <TouchableOpacity
                                                    style={ProfileS.btnAddStory}
                                                    onPress={() => {
                                                        setMenuVisible(true);
                                                    }}>
                                                    <Text style={ProfileS.textAddStory}>+ Phản hồi</Text>
                                                </TouchableOpacity>
                                            )}

                                        <View style={ProfileS.boxEdit}>
                                            <TouchableOpacity
                                                style={ProfileS.btnEdit}
                                                onPress={onChat}>
                                                <Text style={ProfileS.textEdit}>Nhắn tin</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ProfileS.btnMore}>
                                                <Icon
                                                    name="ellipsis-horizontal"
                                                    size={25}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <TouchableOpacity style={ProfileS.btnAddStory}>
                                            <Text style={ProfileS.textAddStory}>+ Thêm vào tin</Text>
                                        </TouchableOpacity>
                                        <View style={ProfileS.boxEdit}>
                                            <TouchableOpacity
                                                style={ProfileS.btnEdit}>
                                                <Text style={ProfileS.textEdit}>
                                                    Chỉnh sửa trang cá nhân
                                                </Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ProfileS.btnMore}>
                                                <Icon
                                                    name="ellipsis-horizontal"
                                                    size={25}
                                                    color="black"
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    </View>
                </View>

                <View style={[ProfileS.boxHeader, { marginVertical: 7 }]}>
                    <View style={ProfileS.boxFriends}>
                        <View style={ProfileS.title}>
                            <View>
                                <Text style={ProfileS.textFriend}>Bạn bè</Text>
                                <Text style={ProfileS.textFriendNumber2}>{friendRelationships.length} Người bạn</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('ListFriend', { _id: params._id })}>
                                <Text style={ProfileS.textSeeAll}>Xem tất cả bạn bè</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ProfileS.listFriends}>
                            <LoadingModal visible={loading} />
                            <FlatList
                                data={(friendRelationships || []).slice(0, 6)}
                                renderItem={({ item }) => (
                                    //console.log("friend: " + item.ID_userA._id);
                                    <TouchableOpacity
                                        onPress={() => {
                                            if (item.ID_userA._id == params?._id) {
                                                navigation.navigate('TabHome', {
                                                    screen: 'Profile',
                                                    params: { _id: item.ID_userB._id },
                                                });
                                            } else {
                                                navigation.navigate('TabHome', {
                                                    screen: 'Profile',
                                                    params: { _id: item.ID_userA._id },
                                                });
                                            }
                                        }}>
                                        <Friends relationship={item} ID_user={params?._id} />
                                    </TouchableOpacity>
                                )}
                                keyExtractor={item => item._id}
                                numColumns={3}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>

                <View style={[ProfileS.boxHeader, { marginBottom: 7 }]}>
                    <View style={ProfileS.boxLive}>
                        <View style={ProfileS.title2}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                                Bài viết
                            </Text>
                            <Text style={{ fontSize: 15, color: '#0064E0' }}>Bộ lọc</Text>
                        </View>
                        <View style={ProfileS.boxAllThink}>
                            <View style={ProfileS.boxThink}>
                                <Image
                                    style={ProfileS.avataStatus}
                                    source={require('./../../../assets/images/person.jpg')}
                                />
                                <Text style={{ fontSize: 13, marginLeft: 10 }}>
                                    Bạn đang nghĩ gì?
                                </Text>
                            </View>
                            <Icon name="image" size={30} color="#3FF251" />
                        </View>
                    </View>
                    <View style={ProfileS.boxLivestream}>
                        <TouchableOpacity style={ProfileS.btnLivestream}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <Icon name="videocam" size={20} color="red" />
                                <Text style={{ marginLeft: 5, color: 'black' }}>
                                    Phát trực tiếp
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={ProfileS.btnManage}>
                        <View style={ProfileS.boxManange}>
                            <Icon2 name="comment-text" size={17} color="black" />
                            <Text style={{ fontSize: 13, color: 'black' }}>
                                {' '}
                                Quản lí bài viết
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };



    return (
        <View style={ProfileS.container}>
            <View style={ProfileS.boxHeader}>
                <View style={ProfileS.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View>
                            <Icon name="chevron-back" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                    <Text style={ProfileS.titleName}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <View>
                        <Icon name="search" size={20} color="black" />
                    </View>
                </View>
            </View>
            <View style={HomeS.line}></View>
            <View>
                <View>

                    <View style={ProfileS.post}>
                        <FlatList
                            data={posts}
                            renderItem={({ item }) =>
                                <ProfilePage
                                    post={item}
                                    ID_user={me._id}
                                    onDelete={() => callChangeDestroyPost(item._id)}
                                    updatePostReaction={updatePostReaction}
                                />
                            }
                            keyExtractor={item => item._id}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={headerFriends}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        />
                    </View>
                </View>
            </View>

            {/* Menu Phản hồi kết bạn */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}>
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={ProfileS.overlay}>
                        <View style={ProfileS.dialog}>
                            <TouchableOpacity
                                style={ProfileS.btnXacNhan}
                                onPress={() => {
                                    setMenuVisible(false);
                                    callChapNhanLoiMoiKetBan();
                                }}>
                                <Text style={ProfileS.text_button}>Xác Nhận</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={ProfileS.btnXoa}
                                onPress={() => {
                                    setMenuVisible(false);
                                    callHuyLoiMoiKetBan();
                                }}>
                                <Text style={ProfileS.text_button}>Xóa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

export default Profile;
