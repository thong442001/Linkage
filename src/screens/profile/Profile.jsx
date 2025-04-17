import {
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Modal,
    Pressable,
    Animated,
    RefreshControl,
    Clipboard//copy
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef } from 'react';
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
    huyBanBe,// huy friend
    editBioOfUser, // edit Bio Of User
} from '../../rtk/API';
import { Snackbar } from 'react-native-paper'; // thông báo (ios and android)
import ProfileS from '../../styles/screens/profile/ProfileS';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { launchImageLibrary } from 'react-native-image-picker';
import { changeAvatar, changeBackground } from '../../rtk/Reducer';
import axios from 'axios';
import ProfileLoading from '../../utils/skeleton_loading/ProfileLoading';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import { useFocusEffect } from '@react-navigation/native';
import FriendLoading from '../../utils/skeleton_loading/FriendLoading';
import PostProfileLoading from '../../utils/skeleton_loading/PostProfileLoading';
import EditBioModal from '../../components/dialog/EditBioModal';
import SendRequestFriendModal from '../../utils/animation/success/SuccessModal';
import FailedRequestFriendModal from '../../utils/animation/failed/FailedModal';
import RecallSuccessFriendRequestModal from '../../utils/animation/success/SuccessModal';
import RecallFailedFriendRequestModal from '../../utils/animation/failed/FailedModal';
import AcceptFriendRequestModal from '../../utils/animation/success/SuccessModal';
import CancelFriendRequestModal from '../../utils/animation/failed/FailedModal';

import { set } from '@react-native-firebase/database';
import { oStackHome } from '../../navigations/HomeNavigation';
const Profile = props => {
    const { route, navigation } = props;
    const { params } = route;

    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const [avatar, setavatar] = useState('');
    const [bio, setBio] = useState(null);
    const [isEditBio, setIsEditBio] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);
    const [liveID, setliveID] = useState('');

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [relationship, setRelationship] = useState(null); posts
    const [friendRelationships, setFriendRelationships] = useState([]);
    const [stories, setStories] = useState(null);
    const [mutualFriendsCount, setMutualFriendsCount] = useState(0);
    const [dialogReLoad, setDialogreload] = useState(false);
    const [loading, setloading] = useState(true);
    const [isLoading, setisLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false)

    //state quản lý thông báo gửi lời mời kết bạn, hủy lời mời, phản hồi lời mời 
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);
    const [recallSuccessModalVisible, setRecallSuccessModalVisible] = useState(false);
    const [recallFailedModalVisible, setRecallFailedModalVisible] = useState(false);
    const [acceptFriendRequestModalVisible, setAcceptFriendRequestModalVisible] = useState(false);
    const [cancelFriendRequestModalVisible, setCancelFriendRequestModalVisible] = useState(false);
    // Animated value for scroll handling
    const scrollY = useRef(new Animated.Value(0)).current;
    const previousScrollY = useRef(0);

    //Deeplink 
    const [dialogCopyVisible, setDialogCopyVisible] = useState(false); // dialog copy
    // Hàm copy tin nhắn
    const copyToClipboard = text => {
        Clipboard.setString(text);
        setDialogCopyVisible(true); // hiện dialog copy
    };


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        callAllProfile().finally(() => setRefreshing(false));
    }, [params?._id, me]);

 // Tự động mở story khi vào từ thông báo
 useEffect(() => {
    if (params?.autoPlayStory && stories?.stories?.length > 0) {
      console.log('Tự động mở StoryViewer với stories:', stories);
      navigation.navigate(oStackHome.StoryViewer.name, {
        StoryView: stories,
        currentUserId: me?._id,
      });
      // Xóa autoPlayStory khỏi params để tránh lặp lại khi quay lại
      navigation.setParams({ autoPlayStory: undefined });
    }
  }, [stories, params?.autoPlayStory, navigation, me?._id]);



    useEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
            const currentScrollY = value;
            if (currentScrollY < 50) {
                // Nếu cuộn gần đầu trang, luôn hiện Bottom Tab
                props.route.params.handleScroll(true);
            } else {
                if (currentScrollY - previousScrollY.current > 0) {
                    // Cuộn xuống => Ẩn Bottom Tab
                    props.route.params.handleScroll(false);
                } else if (currentScrollY - previousScrollY.current < 0) {
                    // Cuộn lên => Hiện Bottom Tab
                    props.route.params.handleScroll(true);
                }
            }
            previousScrollY.current = currentScrollY;
        });

        return () => {
            scrollY.removeListener(listenerId);
        };
    }, [scrollY]);

    useFocusEffect(
        React.useCallback(() => {
            setliveID(String(Math.floor(Math.random() * 100000000)));
        }, [])
    );

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
            openBottomSheet(35, detail_selection_image());
        } else {
            openBottomSheet(25, detail_selection_image());
        }
    };

    const openBottomSheetReportUser = () => {
        openBottomSheet(25, detail_selection_report_user());
    };

    const openBottomSheetHuyBanBe = () => {
        openBottomSheet(25, detail_selection_huy_friend());
    };

    const openBottomSheetPhanHoi = () => {
        openBottomSheet(30, detail_selection_phan_hoi());
    };

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
                'https://api.cloudinary.com/v1_1/ddasyg5z3/upload',
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );

            if (!response.data.secure_url) {
                throw new Error('Không nhận được secure_url từ Cloudinary!');
            }

            const fileUrl = response.data.secure_url;
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

    const onOpenGalleryChangeAvatar = async () => {
        try {
            setisLoading(true);
            closeBottomSheet();
            const options = { mediaType: 'photo', quality: 1, includeBase64: false, };

            launchImageLibrary(options, async response => {
                if (response.didCancel) {
                    setisLoading(false);
                    console.log('Đã hủy chọn ảnh');
                    return;
                }

                if (response.errorMessage) {
                    setisLoading(false);
                    console.log('Lỗi khi mở thư viện:', response.errorMessage);
                    return;
                }

                const selectedFile = response.assets?.[0];
                if (!selectedFile) {
                    setisLoading(false);
                    console.log('Không có ảnh nào được chọn!');
                    return;
                }

                console.log('📂 File đã chọn:', selectedFile.uri);

                const fileUrl = await uploadFile(selectedFile);
                if (!fileUrl) {
                    setisLoading(false);
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
                        } else {
                            setisLoading(false);
                            console.log('❌ Đổi avatar thất bại');
                        }
                        setisLoading(false);
                    })
                    .catch(err => {
                        setisLoading(false);
                        console.log('❌ Lỗi khi gửi API đổi avatar:', err);
                    });
            });
        } catch (error) {
            console.log('Lỗi onOpenGallery:', error);
        }
    };

    const onOpenGalleryChangeBackground = async () => {
        try {
            setisLoading(true);
            closeBottomSheet();

            // Cấu hình chỉ cho phép chọn ảnh
            const options = {
                mediaType: 'photo', // Chỉ chọn ảnh, không phải video
                quality: 1, // Chất lượng ảnh cao nhất
                includeBase64: false, // Không cần base64 để tối ưu
            };

            launchImageLibrary(options, async response => {
                if (response.didCancel) {
                    setisLoading(false);
                    console.log('Đã hủy chọn ảnh');
                    return;
                }

                if (response.errorCode || response.errorMessage) {
                    setisLoading(false);
                    console.log('Lỗi khi mở thư viện:', response.errorCode, response.errorMessage);
                    return;
                }

                const selectedFile = response.assets?.[0];
                if (!selectedFile) {
                    setisLoading(false);
                    console.log('Không có ảnh nào được chọn!');
                    return;
                }

                // Kiểm tra loại file để chắc chắn là ảnh
                if (!selectedFile.type?.startsWith('image/')) {
                    setisLoading(false);
                    console.log('❌ File không phải ảnh:', selectedFile.type);
                    return;
                }

                console.log('📂 File ảnh đã chọn:', selectedFile.uri);

                const fileUrl = await uploadFile(selectedFile);
                if (!fileUrl) {
                    setisLoading(false);
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
                        } else {
                            console.log('❌ Đổi background thất bại');
                        }
                        setisLoading(false);
                    })
                    .catch(err => {
                        setisLoading(false);
                        console.log('❌ Lỗi khi gửi API đổi background:', err);
                    });
            });
        } catch (error) {
            setisLoading(false);
            console.log('Lỗi onOpenGallery:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            callAllProfile();
        }, [params?._id, me])
    );

    const detail_selection_image = () => {
        return (
            <View>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>
                <View style={ProfileS.containerBottomSheet}>
                    {user?._id === me?._id ? (
                        <>
                            <TouchableOpacity
                                style={ProfileS.option}
                                onPress={onOpenGalleryChangeAvatar}>
                                <View style={ProfileS.anhBia}>
                                    <Icon name="image" size={25} color="black" />
                                </View>
                                <Text style={ProfileS.optionText}>Đổi ảnh đại diện</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={ProfileS.option}
                                onPress={() => openImageModal(user?.avatar)}>
                                <View style={ProfileS.anhBia}>
                                    <Icon name="person-circle-outline" size={25} color="black" />
                                </View>
                                <Text style={ProfileS.optionText}>Xem ảnh đại diện</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={ProfileS.option}
                            onPress={() => openImageModal(user?.avatar)}>
                            <View style={ProfileS.anhBia}>
                                <Icon name="person-circle-outline" size={25} color="black" />
                            </View>
                            <Text style={ProfileS.optionText}>Xem ảnh đại diện</Text>
                        </TouchableOpacity>
                    )}
                    {stories?.stories.length > 0 && (
                        <TouchableOpacity
                            style={ProfileS.option}
                            onPress={() => {
                                closeBottomSheet();
                                navigation.navigate(oStackHome.StoryViewer.name, { StoryView: stories, currentUserId: me?._id, });
                            }}>
                            <View style={ProfileS.anhBia}>
                                <Icon name="radio-button-on" size={25} color="black" />
                            </View>
                            <Text style={ProfileS.optionText}>Xem story</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        );
    };

    const detail_selection_background = () => {
        return (
            <View>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>
                <View style={ProfileS.containerBottomSheet}>
                    {user?._id === me?._id && (
                        <TouchableOpacity
                            style={ProfileS.option}
                            onPress={onOpenGalleryChangeBackground}>
                            <View style={ProfileS.anhBia}>
                                <Icon name="swap-vertical" size={25} color="black" />
                            </View>
                            <Text style={ProfileS.optionText}>Đổi ảnh bìa</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={ProfileS.option}
                        onPress={() => openImageModal(user?.background)}>
                        <View style={ProfileS.anhBia}>
                            <Icon name="image" size={25} color="black" />
                        </View>
                        <Text style={ProfileS.optionText}>Xem ảnh bìa</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const detail_selection_report_user = () => {
        return (
            <View style={ProfileS.containerBottomSheet}>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>
                {
                    (me._id != user?._id)
                    && (
                        <TouchableOpacity
                            style={ProfileS.option}
                            onPress={() => {
                                closeBottomSheet();
                                navigation.navigate('Report', { ID_post: null, ID_user: user._id });
                            }}
                        >
                            <View style={ProfileS.anhBia}>
                                <Icon name="ban" size={25} />
                            </View>
                            <Text style={ProfileS.optionText}>Báo cáo</Text>
                        </TouchableOpacity>
                    )
                }
                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={() => {
                        closeBottomSheet();
                        copyToClipboard(`https://linkage.id.vn/deeplink?url=linkage://profile?ID_user=${user?._id.toString()}`); // copy
                    }}
                >
                    <View style={ProfileS.anhBia}>
                        <Icon name="unlink" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Sao chép liên kết</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const detail_selection_huy_friend = () => {
        return (
            <View style={ProfileS.containerBottomSheet}>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>

                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={callHuyBanBe}
                >
                    <View style={ProfileS.anhBia}>
                        <Icon name="ban" size={25} />
                    </View>
                    <Text style={ProfileS.optionText}>Hủy bạn bè</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const detail_selection_phan_hoi = () => {
        return (
            <View style={ProfileS.containerBottomSheet}>
                <View style={ProfileS.rectangle}>
                    <View style={ProfileS.lineBottomSheet}></View>
                </View>

                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={callChapNhanLoiMoiKetBan}
                >
                    <View style={ProfileS.anhBia}>
                        <Icon name="checkmark-circle" size={25} color={'blue'} />
                    </View>
                    <Text style={ProfileS.optionText}>Chấp nhận lời mời kết bạn</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={ProfileS.option}
                    onPress={callSetRelationNguoiLa}
                >
                    <View style={ProfileS.anhBia}>
                        <Icon name="close-circle" size={25} color={'red'} />
                    </View>
                    <Text style={ProfileS.optionText}>Từ chối lời mời kết bạn</Text>
                </TouchableOpacity>
            </View>
        );
    };

    const callAllProfile = async () => {
        try {
            setloading(true);
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
                    setBio(response.user.bio)
                    setMutualFriendsCount(response.mutualFriendsCount);
                    setloading(false);
                })
                .catch(error => {
                    console.log('Error2 allProfile:', error);
                    setloading(false);
                    setDialogreload(true);
                });
        } catch (error) {
            console.log(error);
            setloading(false);
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
                    console.log(response);
                    setRelationship(response.relationship);
                    setSuccessModalVisible(true);
                    setTimeout(() => setSuccessModalVisible(false), 2000);
                })
                .catch(error => {
                    setFailedModalVisible(true);
                    setTimeout(() => {
                        setFailedModalVisible(false)
                        callAllProfile()
                    }, 2000);
                    console.log('❌ Lỗi khi gửi lời mời:', error);
                });
        } catch (error) {
            setFailedModalVisible(true);
            setTimeout(() => setFailedModalVisible(false), 2000);
            console.log(error);
        }
    };

    const callChapNhanLoiMoiKetBan = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
            };
            await dispatch(chapNhanLoiMoiKetBan(paramsAPI))
                .unwrap()
                .then(response => {
                    setRelationship(response.relationship);
                    closeBottomSheet();
                    setAcceptFriendRequestModalVisible(true);
                    setTimeout(() => setAcceptFriendRequestModalVisible(false), 2000);
                })
                .catch(error => {
                    setCancelFriendRequestModalVisible(true);
                    setTimeout(() => setCancelFriendRequestModalVisible(false), 2000);
                    console.log('Error2 callChapNhanLoiMoiKetBan:', error);
                    closeBottomSheet();
                    callAllProfile()
                });
        } catch (error) {
            setAcceptFriendRequestModalVisible(true);
            setTimeout(() => setAcceptFriendRequestModalVisible(false), 2000);
            console.log(error);
        }
    };

    const callSetRelationNguoiLa = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
            };
            await dispatch(huyLoiMoiKetBan(paramsAPI))
                .unwrap()
                .then(response => {
                    setRelationship(response.relationship);
                    closeBottomSheet();
                    setRecallSuccessModalVisible(true);
                    setTimeout(() => setRecallSuccessModalVisible(false), 2000);
                })
                .catch(error => {
                    setRecallFailedModalVisible(true);
                    setTimeout(() => setRecallFailedModalVisible(false), 2000);
                    console.log('Error2 callSetRelationNguoiLa:', error);
                    closeBottomSheet();
                    callAllProfile()
                });
        } catch (error) {
            setRecallFailedModalVisible(true);
            setTimeout(() => setRecallFailedModalVisible(false), 2000);
            console.log(error);
        }
    };

    const callHuyBanBe = async () => {
        try {
            const paramsAPI = {
                ID_relationship: relationship?._id,
            };
            await dispatch(huyBanBe(paramsAPI))
                .unwrap()
                .then(response => {
                    setRelationship(response.relationship);
                    closeBottomSheet();
                    setRecallSuccessModalVisible(true);
                    setTimeout(() => setRecallSuccessModalVisible(false), 2000);
                    callAllProfile();
                })
                .catch(error => {
                    setRecallFailedModalVisible(true);
                    setTimeout(() => setRecallFailedModalVisible(false), 2000);
                    console.log('Error2 callSetRelationNguoiLa:', error);
                    closeBottomSheet();
                    callAllProfile()
                });
        } catch (error) {
            console.log(error);
        }
    };

    const getID_groupPrivate = async (user1, user2) => {
        try {
            const paramsAPI = {
                user1: user1,
                user2: user2,
            };
            await dispatch(joinGroupPrivate(paramsAPI))
                .unwrap()
                .then(response => {
                    navigation.navigate('Chat', { ID_group: response.ID_group });
                })
                .catch(error => {
                    console.log('Error1:', error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const callChangeDestroyPost = async (ID_post) => {
        try {
            await dispatch(changeDestroyPost({ _id: ID_post }))
                .unwrap()
                .then(response => {
                    setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
                })
                .catch(error => {
                    console.log('Lỗi khi xóa bài viết:', error);
                });
        } catch (error) {
            console.log('Lỗi trong callChangeDestroyPost:', error);
        }
    };

    const updatePostReaction = (ID_post, newReaction, ID_post_reaction) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id !== ID_post) return post;
                const existingReactionIndex = post.post_reactions.findIndex(
                    reaction => reaction.ID_user._id === me._id
                );
                let updatedReactions = [...post.post_reactions];
                if (existingReactionIndex !== -1) {
                    updatedReactions[existingReactionIndex] = {
                        ...updatedReactions[existingReactionIndex],
                        ID_reaction: newReaction
                    };
                } else {
                    updatedReactions.push({
                        _id: ID_post_reaction,
                        ID_user: {
                            _id: me._id,
                            first_name: me.first_name,
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

    const deletPostReaction = (ID_post, ID_post_reaction) => {
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post._id !== ID_post) return post;
                const updatedReactions = post.post_reactions.filter(reaction => reaction._id !== ID_post_reaction);
                return { ...post, post_reactions: updatedReactions };
            })
        );
    };

    const onChat = async () => {
        await getID_groupPrivate(params?._id, me?._id);
    };

    const callEditBioOfUser = async (text) => {
        try {
            const paramsAPI = {
                ID_user: me._id,
                bio: text
            };
            await dispatch(editBioOfUser(paramsAPI))
                .unwrap()
                .then(async (response) => {
                    //console.log(response);
                    setBio(text);
                })
                .catch(error => {
                    console.log('❌ Lỗi editBioOfUser:', error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const renderPosts = useCallback(({ item }) => (
        <ProfilePage
            post={item}
            ID_user={me._id}
            onDelete={() => callChangeDestroyPost(item._id)}
            updatePostReaction={updatePostReaction}
            deletPostReaction={deletPostReaction}
        />
    ), [posts]);

    const headerFriends = () => {
        if (loading) {
            return (
                <View style={{ backgroundColor: '#FFFFFF' }}>
                    <ProfileLoading />
                    <FriendLoading />
                </View>
            );
        }
        return (
            <View style={ProfileS.container1}>
                <SendRequestFriendModal visible={successModalVisible} message={'Lời mời đã được gửi'} />
                <FailedRequestFriendModal visible={failedModalVisible} message={'Đã hủy lời mời kết bạn'} />
                <RecallSuccessFriendRequestModal visible={recallSuccessModalVisible} message={'Đã hủy lời mời kết bạn'} />
                <RecallSuccessFriendRequestModal visible={recallFailedModalVisible} message={'Đã hủy lời mời kết bạn'} />
                <AcceptFriendRequestModal visible={acceptFriendRequestModalVisible} message={'Đã chấp nhận lời mời kết bạn'} />
                <View style={ProfileS.boxHeader}>
                    {/* <Snackbar
                        visible={dialogReLoad}
                        onDismiss={() => {
                            setDialogreload(false);
                        }}
                        duration={1000}>
                        làm mới!
                    </Snackbar> */}
                    <View>
                        <View>
                            <View>
                                <Pressable onPress={() => openBottomSheet(30, detail_selection_background)}>
                                    {user?.background != null ? (
                                        <Image
                                            style={ProfileS.backGroundImage}
                                            source={{ uri: user?.background }}
                                        />
                                    ) : (
                                        <Image
                                            style={ProfileS.backGroundImage}
                                            source={require('./../../../assets/images/phongcanh.jpg')}
                                        />
                                    )}
                                </Pressable>
                                <View style={ProfileS.header}>
                                    <TouchableOpacity
                                        style={ProfileS.header1}
                                        onPress={() => {
                                            props.route.params.handleScroll(true); // Đảm bảo bottom tab hiển thị
                                            navigation.goBack();
                                          }}>
                                        <View>
                                            <Icon name="chevron-back" size={20} color="black" />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <Pressable onPress={openBottomSheetAvatar}>
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
                                onRequestClose={closeImageModal}>
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
                                {/* {' '} */}
                                {user?.first_name} {user?.last_name}
                            </Text>
                            {/* Bio */}
                            {bio && (
                                <Text style={ProfileS.bio}>
                                    {bio}
                                </Text>
                            )}
                            <View style={ProfileS.boxInformation}>
                                <Text style={ProfileS.friendNumber}>{friendRelationships?.length}</Text>
                                <Text style={[ProfileS.friendNumber, { color: '#D6D6D6' }]}>
                                    {' '}
                                    người bạn
                                </Text>
                                {mutualFriendsCount > 0 && (
                                    <Text style={ProfileS.friendNumber}> * {mutualFriendsCount}</Text>
                                )}
                                {mutualFriendsCount > 0 && (
                                    <Text style={[ProfileS.friendNumber, { color: '#D6D6D6' }]}>
                                        {' '}
                                        bạn chung
                                    </Text>
                                )}
                            </View>

                            {user && (user._id !== me._id ? (
                                <View>
                                    {relationship?.relation == 'Người lạ' && (
                                        <TouchableOpacity
                                            style={ProfileS.btnAddStory}
                                            onPress={callGuiLoiMoiKetBan}>
                                            <Text style={ProfileS.textAddStory}>+ Thêm bạn bè</Text>
                                        </TouchableOpacity>
                                    )}
                                    {relationship?.relation == 'Bạn bè' && (
                                        <TouchableOpacity
                                            style={ProfileS.btnAddStory}
                                            onPress={openBottomSheetHuyBanBe}>
                                            <Text style={ProfileS.textAddStory}>Bạn bè</Text>
                                        </TouchableOpacity>
                                    )}
                                    {((relationship?.ID_userA == me._id &&
                                        relationship?.relation == 'A gửi lời kết bạn B') ||
                                        (relationship?.ID_userB == me._id &&
                                            relationship?.relation == 'B gửi lời kết bạn A')) && (
                                            <TouchableOpacity
                                                style={ProfileS.btnAddStory}
                                                onPress={callSetRelationNguoiLa}>
                                                <Text style={ProfileS.textAddStory}>Hủy lời mời</Text>
                                            </TouchableOpacity>
                                        )}
                                    {((relationship?.ID_userA == me._id &&
                                        relationship?.relation == 'B gửi lời kết bạn A') ||
                                        (relationship?.ID_userB == me._id &&
                                            relationship?.relation == 'A gửi lời kết bạn B')) && (
                                            <TouchableOpacity
                                                style={ProfileS.btnAddStory}
                                                onPress={openBottomSheetPhanHoi}>
                                                <Text style={ProfileS.textAddStory}>+ Phản hồi</Text>
                                            </TouchableOpacity>
                                        )}

                                    <View style={ProfileS.boxEdit}>
                                        <TouchableOpacity
                                            style={ProfileS.btnEdit}
                                            onPress={onChat}>
                                            <Text style={ProfileS.textEdit}>Nhắn tin</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            //disabled={me._id == user?._id}
                                            style={ProfileS.btnMore}
                                            onPress={openBottomSheetReportUser}>
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
                                    <TouchableOpacity
                                        style={ProfileS.btnAddStory}
                                        onPress={() => navigation.navigate('PostStory')}
                                    >
                                        <Text style={ProfileS.textAddStory}>+ Thêm vào tin</Text>
                                    </TouchableOpacity>
                                    <View style={ProfileS.boxEdit}>
                                        <TouchableOpacity
                                            style={ProfileS.btnEdit}
                                            onPress={() => setIsEditBio(true)}
                                        >
                                            <Text style={ProfileS.textEdit}>
                                                Chỉnh sửa trang cá nhân
                                            </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            //disabled={me._id == user?._id}
                                            style={ProfileS.btnMore}
                                            onPress={openBottomSheetReportUser}>
                                            <Icon
                                                name="ellipsis-horizontal"
                                                size={25}
                                                color="black"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}

                            {/* dialog Edit bio 
                            <Modal
                                visible={isEditBio}
                                transparent={true}
                                animationType="fade"
                            //onRequestClose={() => setIsEditBio(false)}
                            >
                                <View style={ProfileS.modalContainer}>
                                    <TouchableWithoutFeedback onPress={() => setIsEditBio(false)}>
                                        <View style={ProfileS.modalBackground} />
                                    </TouchableWithoutFeedback>

                                    <View style={ProfileS.dialog}>
                                        <Text style={ProfileS.name}>Miêu tả</Text>
                                        <TextInput
                                            value={bio}
                                            onChangeText={setBio}
                                            style={{ width: '80%', height: 50, justifyContent: 'center', color: 'black' }}
                                            placeholderTextColor={"gray"}
                                            placeholder='Nhập miêu tả...'
                                        />
                                        <View
                                            style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around' }}
                                        >
                                            <TouchableOpacity
                                                style={ProfileS.btnXacNhan}
                                                onPress={() => {
                                                    callEditBioOfUser(bio)
                                                    setIsEditBio(false)
                                                }}
                                            >
                                                <Text style={ProfileS.text_button}>Lưu</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={ProfileS.btnXoa}
                                                onPress={() => {
                                                    setBio(user.bio)
                                                    setIsEditBio(false)

                                                }}
                                            >
                                                <Text style={ProfileS.text_button}>Hủy</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </Modal> */}

                        </View>
                    </View>
                </View >

                <View style={[ProfileS.boxHeader, { marginVertical: 7 }]}>
                    <View style={ProfileS.boxFriends}>
                        <View style={ProfileS.title}>
                            <View>
                                <Text style={ProfileS.textFriend}>Bạn bè</Text>
                                {mutualFriendsCount > 0 ? (
                                    <Text style={ProfileS.textFriendNumber2}>
                                        {friendRelationships.length} ({mutualFriendsCount} bạn chung)
                                    </Text>
                                ) : (
                                    <Text style={ProfileS.textFriendNumber2}>
                                        {friendRelationships.length} người bạn
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('ListFriend', { _id: params._id })}>
                                <Text style={ProfileS.textSeeAll}>Xem tất cả bạn bè</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={ProfileS.listFriends}>
                            <FlatList
                                data={(friendRelationships || []).slice(0, 6)}
                                renderItem={({ item }) => (
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

                {
                    user?._id === me?._id && (
                        <View style={[ProfileS.boxHeader, { marginBottom: 7 }]}>
                            <View style={ProfileS.boxLive}>
                                <View style={ProfileS.title2}>
                                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                                        Bài viết
                                    </Text>
                                    {/* <Text style={{ fontSize: 15, color: '#0064E0' }}>Bộ lọc</Text> */}
                                </View>
                                <TouchableOpacity
                                    style={ProfileS.boxAllThink}
                                    onPress={() => navigation.navigate('UpPost')}
                                >
                                    <View style={ProfileS.boxThink}>
                                        <Image
                                            style={ProfileS.avataStatus}
                                            source={{ uri: user?.avatar }}
                                        />
                                        <Text style={{ fontSize: 13, marginLeft: 10, color: 'gray', }}>
                                            Bạn đang nghĩ gì?
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={ProfileS.boxLivestream}>
                                <TouchableOpacity
                                    style={ProfileS.btnLivestream}
                                    onPress={() => navigation.navigate('HostLive', { userID: me._id, avatar: me.avatar, userName: me.first_name + ' ' + me.last_name, liveID: liveID })}>
                                    <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                        <Icon name="videocam" size={20} color="red" />
                                        <Text style={{ marginLeft: 5, color: 'black' }}>
                                            Phát trực tiếp
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                style={ProfileS.btnManage}
                                onPress={() => navigation.navigate('Trash')}
                            >
                                <View style={ProfileS.boxManange}>
                                    <Icon2 name="comment-text" size={17} color="black" />
                                    <Text style={{ fontSize: 13, color: 'black' }}>
                                        Quản lí bài viết
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    )
                }
                {/* Hiển thị Snackbar dưới cùng màn hình */}
                <Snackbar
                    visible={dialogCopyVisible}
                    onDismiss={() => setDialogCopyVisible(false)}
                    duration={1000}>
                    Đã sao chép tin nhắn!
                </Snackbar>
            </View >
        );
    };


    return (
        <View style={ProfileS.container}>
            <LoadingModal visible={isLoading} />
            <View>
                <View>
                    <View style={ProfileS.post}>
                        {loading ? (
                            <View style={{ backgroundColor: '#FFFFFF' }}>
                                <ProfileLoading />
                                <FriendLoading />
                                <FriendLoading />
                            </View>
                        ) : (
                            <Animated.FlatList
                                data={posts}
                                renderItem={renderPosts}
                                keyExtractor={item => item._id}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={headerFriends}
                                showsVerticalScrollIndicator={false}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }], // Sửa lại cú pháp, bỏ dấu , thừa
                                    { useNativeDriver: true }
                                )}
                                scrollEventThrottle={16}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                        colors={['#0064E0']}
                                        tintColor="#0064E0"
                                    >
                                    </RefreshControl>
                                }
                            />
                        )}
                    </View>
                </View>
            </View>
            <EditBioModal
                visible={isEditBio}
                bio={bio}
                onSave={(newBio) => {
                    callEditBioOfUser(newBio);
                    setIsEditBio(false);
                }}
                onCancel={() => {
                    setIsEditBio(false);
                    setBio(user?.bio || '');
                }}
            />
        </View>
    );
};

export default Profile;