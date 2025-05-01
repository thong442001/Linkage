import React, { useState, useEffect, useRef, memo } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
    TextInput,
    FlatList,
    Clipboard,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useSelector, useDispatch } from 'react-redux';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { width, height } = Dimensions.get('window');
import {
    addPost_Reaction,
    addPost,
    deletePost_reaction,
    getAllGroupOfUser
} from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
import { Snackbar } from 'react-native-paper';
import styles from '../../styles/screens/postItem/PostItemS';
import GroupcomponentShare from '../../components/chat/GroupcomponentShare'
import { useSocket } from '../../context/socketContext';
import LoadingChatList from '../../utils/animation/loadingChatList/LoadingChatList';
// Component SharedPost

const SharedPost = ({
    me,
    callAddPostShare,
    copyToClipboard,
    post,
    width,
    styles,
}) => {
    const token = useSelector(state => state.app.token);
    const { closeBottomSheet } = useBottomSheet();
    const dispatch = useDispatch();
    const [captionShare, setCaptionShare] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoadingGroups, setIsLoadingGroups] = useState(false); // Thêm trạng thái loading
    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: 'Công khai',
    });
    const [groups, setGroups] = useState([]);
    const { socket } = useSocket();
    const deeplinkPost = `https://linkage.id.vn/deeplink?url=linkage://post-chi-tiet?ID_post=${post._id.toString()}`

    const status = [
        { status: 1, name: 'Công khai', icon: "user-alt" },
        { status: 2, name: 'Bạn bè', icon: "user-friends" },
        { status: 3, name: 'Chỉ mình tôi', icon: "user-lock" },
    ];

    const handleSelectOption = (option) => {
        console.log('Selected option:', option);
        setSelectedOption(option);
        setModalVisible(false);
    };

    useEffect(() => {
        callGetAllGroupOfUser(me._id)
    }, []);

    const callGetAllGroupOfUser = async ID_user => {
        try {
            setIsLoadingGroups(true);

            const response = await dispatch(getAllGroupOfUser({ ID_user, token })).unwrap();
            setGroups(response.groups);

            setTimeout(() => {
                setIsLoadingGroups(false);
            }, 500);
        } catch (error) {
            console.log('Error:', error);
            setIsLoadingGroups(false);
        }
    };

    // gửi tin nhắn
    const sendMessage = async (ID_group) => {

        await socket.emit("joinGroup", ID_group);

        if (socket == null) {
            console.log("socket ko joinGroup đc")
            return;
        }
        const payload = {
            ID_group: ID_group,
            sender: me._id,
            content: deeplinkPost,
            type: 'text',
            ID_message_reply: null
        };
        socket.emit('send_message', payload);
    };

    const renderContact = ({ item }) => (
        <TouchableOpacity
            onPress={() => {
                sendMessage(item._id)
                closeBottomSheet();
            }}
            key={item._id}
        >
            <GroupcomponentShare item={item} />
        </TouchableOpacity>
    );

    //console.log('Current selectedOption in SharedPost:', selectedOption);

    return (
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <View style={styles.rectangle}>
                <View style={styles.lineBottomSheet}></View>
            </View>

            <View
                style={{
                    flexDirection: 'column',
                    backgroundColor: '#ecf0f0',
                    borderRadius: 10,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: width * 0.9,
                    marginVertical: 10,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        borderRadius: 10,
                        marginHorizontal: 15,
                    }}
                >
                    <Image source={{ uri: me?.avatar }} style={styles.avatar} />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ top: 10, color: 'black', fontWeight: 'bold' }}>
                            {me?.first_name + ' ' + me?.last_name}
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: '#dce0e0',
                                    paddingVertical: 2,
                                    borderRadius: 5,
                                    paddingHorizontal: 10,
                                }}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={{ color: 'black', fontSize: 14 }}>{selectedOption.name}</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => callAddPostShare(captionShare, selectedOption.name)}
                                style={[
                                    styles.shareButton,
                                    {
                                        marginHorizontal: 10,
                                        marginRight: 5,
                                        paddingVertical: 2,
                                        paddingHorizontal: 10,
                                        backgroundColor: '#0064E0',
                                        borderRadius: 5,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.shareButtonText,
                                        { fontSize: 14, color: 'white' },
                                    ]}
                                >
                                    Chia sẻ ngay
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <TextInput
                        editable={true}
                        multiline={true}
                        scrollEnabled={true}
                        placeholder="Hãy nói gì đó về nội dung này"
                        placeholderTextColor="gray"
                        style={[
                            styles.contentShare,
                            {
                                flexShrink: 1,
                                maxHeight: 100,
                                minHeight: 40,
                                marginHorizontal: 10,
                                textAlignVertical: 'top',
                                overflow: 'hidden',
                            },
                        ]}
                        value={captionShare}
                        onChangeText={(text) => setCaptionShare(text)}
                        color="black"
                        maxLength={500}
                    />
                </View>
            </View>

            <View style={{ marginBottom: 10 }}>
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Gửi bằng Chat</Text>
                    {isLoadingGroups ? (
                        <LoadingChatList />
                    ) : (
                        <FlatList
                            data={groups}
                            pointerEvents="auto"
                            renderItem={renderContact}
                            keyExtractor={(item) => item._id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            nestedScrollEnabled={true}
                            style={styles.contactList}
                        />
                    )}
                </View>

                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Chia sẻ lên</Text>
                    <View style={{ marginHorizontal: 10 }}>
                        <TouchableOpacity
                            onPress={() => {
                                copyToClipboard(deeplinkPost.toString());
                            }}
                            style={styles.copyLinkButton}
                        >
                            <Text style={styles.copyLinkText}>Sao chép liên kết</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent1}>
                        {status.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.optionButton,
                                    selectedOption.status === option.status && { backgroundColor: '#e0e0e0' },
                                ]}
                                onPress={() => handleSelectOption(option)}
                            >
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 5 }}>
                                    <Text style={styles.optionText}>{option.name}</Text>
                                    <FontAwesome5 name={option.icon} size={15} color={"black"} />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

// Component chính PostItem
const PostItem = memo(({
    post,
    ID_user,
    onDelete = () => { },
    onDeleteVinhVien = () => { },
    updatePostReaction = () => { },
    deletPostReaction = () => { },
    currentTime,
}) => {
    const navigation = useNavigation();
    const me = useSelector(state => state.app.user);
    const reactions = useSelector(state => state.app.reactions);
    const dispatch = useDispatch();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();

    const [timeAgo, setTimeAgo] = useState(post.createdAt);
    const [timeAgoShare, setTimeAgoShare] = useState(post?.ID_post_shared?.createdAt);
    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
    const reactionRef = useRef(null);
    const [dialogCopyVisible, setDialogCopyVisible] = useState(false);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isFirstRender, setIsFirstRender] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);




    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }
        if (selectedTab !== null) {
            openBottomSheet(50, renderBottomSheetContent());
        }
    }, [selectedTab]);

    const copyToClipboard = text => {
        Clipboard.setString(text);
        setDialogCopyVisible(true);
    };

    const renderBottomSheetContent = () => {
        return (
            <View style={styles.container}>
                <View style={styles.headerReaction}>
                    <TouchableOpacity style={styles.backButton} onPress={closeBottomSheet}>
                        <Icon4 name="angle-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Người đã bày tỏ cảm xúc</Text>
                </View>
                <View style={styles.tabContainer}>
                    <FlatList
                        data={tabs}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.tab, selectedTab === item.id && styles.selectedTab]}
                                onPress={() => setSelectedTab(item.id)}
                            >
                                <Text style={styles.tabIcon}>{item.icon}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.container_listReaction}>
                                <Text style={styles.nameItemReaction}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.nameItemReaction}>{item.reactionIcon}</Text>
                                    <Text style={{ marginLeft: 5, color: 'black' }}>{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    };

    const uniqueReactions_tab = Array.from(
        new Map(
            post.post_reactions.map(reaction => [
                reaction.ID_reaction._id,
                reaction.ID_reaction,
            ])
        ).values()
    );

    const tabs = [
        { id: 'all', icon: 'Tất cả' },
        ...uniqueReactions_tab.map(reaction => ({
            id: reaction._id,
            icon: reaction.icon,
        })),
    ];

    const filteredUsers = post.post_reactions
        .filter(
            reaction =>
                selectedTab === 'all' || reaction.ID_reaction._id === selectedTab
        )
        .map(reaction => ({
            id: `${reaction.ID_user._id}-${reaction._id}`,
            userId: reaction.ID_user._id,
            name: `${reaction.ID_user.first_name} ${reaction.ID_user.last_name}`,
            avatar: reaction.ID_user.avatar,
            reactionId: reaction.ID_reaction._id,
            reactionIcon: reaction.ID_reaction.icon,
            quantity: reaction.quantity,
        }));

    const reactionCount = post.post_reactions.reduce((acc, reaction) => {
        if (!reaction.ID_reaction) return acc;
        const id = reaction.ID_reaction._id;
        acc[id] = acc[id] ? { ...acc[id], count: acc[id].count + 1 } : { ...reaction, count: 1 };
        return acc;
    }, {});

    const topReactions = Object.values(reactionCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, 2);

    const userReaction = post.post_reactions.find(
        (reaction) => reaction.ID_user._id === ID_user
    );

    const handleLongPress = () => {
        if (reactionRef.current) {
            reactionRef.current.measure((x, y, width, height, pageX, pageY) => {
                setMenuPosition({
                    top: pageY - 57,
                    left: pageX,
                    right: pageX,
                });
                setReactionsVisible(true);
            });
        }
    };




    useEffect(() => {
        const updateDiff = () => {
            const now = Date.now();
            const createdTime = new Date(post.createdAt).getTime();
            let createdTimeShare = null;
            if (post.ID_post_shared?.createdAt) {
                createdTimeShare = new Date(post.ID_post_shared.createdAt).getTime();
            }

            if (isNaN(createdTime)) {
                setTimeAgo("Không xác định");
                setTimeAgoShare("Không xác định");
                return;
            }

            const diffMs = now - createdTime;
            if (diffMs < 0) {
                setTimeAgo("Vừa xong");
            } else {
                const seconds = Math.floor(diffMs / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                if (days > 0) {
                    setTimeAgo(`${days} ngày trước`);
                } else if (hours > 0) {
                    setTimeAgo(`${hours} giờ trước`);
                } else if (minutes > 0) {
                    setTimeAgo(`${minutes} phút trước`);
                } else {
                    setTimeAgo(`${seconds} giây trước`);
                }
            }

            if (createdTimeShare !== null) {
                const diffMsShare = now - createdTimeShare;
                if (diffMsShare < 0) {
                    setTimeAgoShare("Vừa xong");
                } else {
                    const seconds = Math.floor(diffMsShare / 1000);
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    if (days > 0) {
                        setTimeAgoShare(`${days} ngày trước`);
                    } else if (hours > 0) {
                        setTimeAgoShare(`${hours} giờ trước`);
                    } else if (minutes > 0) {
                        setTimeAgoShare(`${minutes} phút trước`);
                    } else {
                        setTimeAgoShare(`${seconds} giây trước`);
                    }
                }
            }
        };

        updateDiff();
    }, [currentTime]);

    const callAddPost_Reaction = async (ID_reaction, name, icon) => {
        try {
            const paramsAPI = {
                ID_post: post._id,
                ID_user: ID_user,
                ID_reaction: ID_reaction,
            };
            await dispatch(addPost_Reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    const newReaction = {
                        _id: ID_reaction,
                        name: name,
                        icon: icon,
                    };
                    updatePostReaction(post._id, newReaction, response.post_reaction._id);
                })
                .catch(error => {
                    console.log('Lỗi call api addPost_Reaction', error);
                });
        } catch (error) {
            console.log('Lỗi trong addPost_Reaction:', error);
        }
    };

    const callDeletePost_reaction = async (ID_post, ID_post_reaction) => {
        try {
            const paramsAPI = { _id: ID_post_reaction };
            await dispatch(deletePost_reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    deletPostReaction(ID_post, ID_post_reaction);
                })
                .catch(error => {
                    console.log('Lỗi call api callDeletePost_reaction', error);
                });
        } catch (error) {
            console.log('Lỗi trong callDeletePost_reaction:', error);
        }
    };

    const callAddPostShare = async (captionShare, status) => {
        try {
            setIsLoading(true);
            console.log('Sharing with status:', status);
            const paramsAPI = {
                ID_user: ID_user,
                caption: captionShare,
                medias: [],
                status: status,
                type: 'Share',
                ID_post_shared: post.ID_post_shared ? post.ID_post_shared._id : post._id,
                tags: [],
            };
            await dispatch(addPost(paramsAPI))
                .unwrap()
                .then((response) => {
                    setIsLoading(false);
                    setShareVisible(false);
                    setSuccessModalVisible(true);
                    setTimeout(() => {
                        setSuccessModalVisible(false);
                    }, 1500);
                })
                .catch((error) => {
                    setIsLoading(false);
                    console.log('Lỗi khi share bài viết:', error);
                    setShareVisible(false);
                    setFailedModalVisible(true);
                    setTimeout(() => {
                        setFailedModalVisible(false);
                    }, 1500);
                });
        } catch (error) {
            setIsLoading(false);
            console.log('Lỗi share bài viết:', error);
            setShareVisible(false);
            setFailedModalVisible(true);
            setTimeout(() => {
                setFailedModalVisible(false);
            }, 1500);
        } finally {
            closeBottomSheet();
        }
    };
    

    const hasCaption = post?.caption?.trim() !== '';
    const hasMedia = post?.medias?.length > 0 || post?.ID_post_shared?.medias?.length > 0;

    const getIcon = (status) => {
        switch (status) {
            case 'Bạn bè':
                return <Icon name="people" size={12} color="gray" />;
            case 'Công khai':
                return <Icon name="earth" size={12} color="gray" />;
            case 'Chỉ mình tôi':
                return <Icon name="lock-closed" size={12} color="gray" />;
            default:
                return <Icon name="lock-closed" size={12} color="gray" />;
        }
    };

    const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');

    const renderMediaGrid = (medias) => {
        const mediaCount = medias.length;
        if (mediaCount === 0) return null;



       
        return (
            <View style={styles.mediaContainer}>
                {medias.slice(0, 5).map((uri, index) => (
                    <TouchableOpacity
                        key={index}
                        style={getMediaStyle(mediaCount, index)}
                        onPress={() => {
                            setSelectedImage(uri);
                            if (mediaCount > 5) {
                                navigation.navigate("PostDetail", { ID_post: post._id, typeClick: "image" });
                            } else {
                                setImageModalVisible(true);
                            }
                        }}
                    >
                        {isVideo(uri) ? (
                            <View style={styles.videoWrapper}>
                                <Video source={{ uri }} style={styles.video} resizeMode="cover" paused />
                                <View style={styles.playButton}>
                                    <Icon name="play-circle" size={40} color="white" />
                                </View>
                            </View>
                        ) : (
                            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
                        )}
                        {index === 4 && mediaCount > 5 && (
                            <View style={styles.overlay}>
                                <Text style={styles.overlayText}>+{mediaCount - 5}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const getMediaStyle = (count, index) => {
        if (count === 1) return styles.singleMedia;
        else if (count === 2) return styles.doubleMedia;
        else if (count === 3) return index === 0 ? styles.tripleMediaFirst : styles.tripleMediaSecond;
        else if (count === 4) return styles.quadMedia;
        else {
            if (index < 2) return styles.fivePlusMediaFirstRow;
            else if (index === 2) return styles.fivePlusMediaSecondRowLeft;
            else if (index === 3) return styles.fivePlusMediaSecondRowMiddle;
            else return styles.fivePlusMediaSecondRowRight;
        }
    };
    const canShowShareButton = () => {
        if(post.type === 'Share') {
            // Nếu là bài viết shared, chỉ kiểm tra trạng thái của bài viết gốc
            if (post.ID_post_shared?._destroy || !post.ID_post_shared) {
                return false;
              }
              return post.ID_post_shared.status !== 'Chỉ mình tôi';
        }
        // Nếu là bài viết gốc (ko phải bài share), kiểm tra trạng thái của chính nó
          return post.status !== 'Chỉ mình tôi';
    }

    return (
        <View style={styles.postContainer}>
            {/* Kiểm tra nếu bài viết bị xóa và không thuộc về người dùng hiện tại */}
            {post._destroy && ID_user !== post.ID_user._id ? (
                <View style={styles.deletedPostContainer}>
                    <Text style={styles.deletedPostText}>Bài viết đã bị xóa.</Text>
                </View>
            ) : (
                <>
                    {/* Nội dung bài viết hiện tại */}
                    <View>
                        {post.type == 'Share' && (
                            <View>
                                <View style={[styles.headerShare]}>
                                    <View style={styles.userInfo}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Profile', { _id: post.ID_user._id })}>
                                            <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                                        </TouchableOpacity>
                                        <View style={{ marginLeft: width * 0.01 }}>
                                            <Text style={styles.name} onPress={() => navigation.navigate('Profile', { _id: post.ID_user._id })}>
                                                {post?.ID_user?.first_name + " " + post?.ID_user?.last_name}
                                            </Text>
                                            <View style={styles.boxName}>
                                                <Text style={styles.time}>{timeAgo}</Text>
                                                {getIcon(post.status)}
                                            </View>
                                        </View>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() =>
                                            openBottomSheet(
                                                25,
                                                <View style={{ backgroundColor: '#d9d9d960', borderRadius: 10, padding: 10 }}>
                                                    {ID_user !== post.ID_user._id ? (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                closeBottomSheet();
                                                                navigation.navigate('Report', { ID_post: post._id, ID_user: null });
                                                            }}
                                                            style={styles.deleteButton}
                                                        >
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                <Icon name="alert-circle" size={20} color="black" />
                                                                <Text style={styles.deleteText}>Báo cáo</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <>
                                                            <TouchableOpacity
                                                                onPress={() => {
                                                                    onDelete();
                                                                    closeBottomSheet();
                                                                }}
                                                                style={styles.deleteButton}
                                                            >
                                                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                    <Icon
                                                                        name={post._destroy ? 'refresh-sharp' : 'trash'}
                                                                        size={20}
                                                                        color="black"
                                                                    />
                                                                    <Text style={styles.deleteText}>
                                                                        {post._destroy ? 'Phục hồi' : 'Xóa bài viết'}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            {post._destroy && (
                                                                <TouchableOpacity
                                                                    onPress={() => {
                                                                        onDeleteVinhVien();
                                                                        closeBottomSheet();
                                                                    }}
                                                                    style={styles.deleteButton}
                                                                >
                                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                        <Icon name="trash" size={20} color="black" />
                                                                        <Text style={styles.deleteText}>Xóa vĩnh viễn</Text>
                                                                    </View>
                                                                </TouchableOpacity>
                                                            )}
                                                        </>
                                                    )}
                                                </View>
                                            )
                                        }
                                    >
                                        <Icon name="ellipsis-horizontal" size={22} color="black" />
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    {hasCaption && <Text style={[styles.caption, { color: 'black' }]}>{post.caption}</Text>}
                                </View>
                            </View>
                        )}
                        <View style={post.type == 'Share' ? styles.header1 : styles.header2}>
                            <View style={styles.header}>
                                <View>
                                    {post.type == 'Share' ? (
                                        (post?.ID_post_shared?._destroy || !post?.ID_post_shared)
                                            ? (
                                                <View style={styles.userInfo}>
                                                    < Text style={styles.caption}>Nội dung bài viết đã bị xóa</Text>
                                                </View>
                                            )
                                            : (
                                                <View style={styles.userInfo}>
                                                    <TouchableOpacity onPress={() => navigation.navigate('Profile', { _id: post.ID_post_shared.ID_user._id })}>
                                                        <Image source={{ uri: post.ID_post_shared.ID_user.avatar }} style={styles.avatar} />
                                                    </TouchableOpacity>
                                                    <View style={{ marginLeft: width * 0.01 }}>
                                                        <Text style={styles.name} onPress={() => navigation.navigate('Profile', { _id: post.ID_post_shared.ID_user._id })}>
                                                            {post.ID_post_shared.ID_user.first_name} {post.ID_post_shared.ID_user.last_name}
                                                            {post.ID_post_shared.tags.length > 0 && (
                                                                <Text>
                                                                    <Text style={{ color: 'gray' }}> cùng với </Text>
                                                                    <Text onPress={() => navigation.navigate('Profile', { _id: post.ID_post_shared.tags[0]._id })} style={[styles.name]}>
                                                                        {post.ID_post_shared.tags[0]?.first_name} {post.ID_post_shared.tags[0]?.last_name}
                                                                    </Text>
                                                                    {post.ID_post_shared.tags.length > 1 && (
                                                                        <>
                                                                            <Text style={{ color: 'gray' }}> và </Text>
                                                                            <Text onPress={() => navigation.navigate('ListTag', { ListTag: post.ID_post_shared.tags })} style={[styles.name]}>
                                                                                {post.ID_post_shared.tags.length - 1} người khác
                                                                            </Text>
                                                                        </>
                                                                    )}
                                                                </Text>
                                                            )}
                                                        </Text>
                                                        <View style={styles.boxName}>
                                                            <Text style={styles.time}>{timeAgoShare}</Text>
                                                            {getIcon(post.ID_post_shared.status)}
                                                        </View>
                                                    </View>
                                                </View>
                                            )
                                    ) : (
                                        <View style={styles.userInfo}>
                                            <TouchableOpacity onPress={() => navigation.navigate('Profile', { _id: post.ID_user._id })}>
                                                <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                                            </TouchableOpacity>
                                            <View style={{ marginLeft: width * 0.01 }}>
                                                <Text style={styles.name} onPress={() => navigation.navigate('Profile', { _id: post.ID_user._id })}>
                                                    {post.ID_user.first_name} {post.ID_user.last_name}
                                                    {post.tags.length > 0 && (
                                                        <Text>
                                                            <Text style={{ color: 'gray' }}> cùng với </Text>
                                                            <Text onPress={() => navigation.navigate('Profile', { _id: post.tags[0]._id })} style={[styles.name]}>
                                                                {post.tags[0]?.first_name} {post.tags[0]?.last_name}
                                                            </Text>
                                                            {post.tags.length > 1 && (
                                                                <>
                                                                    <Text style={{ color: 'gray' }}> và </Text>
                                                                    <Text onPress={() => navigation.navigate('ListTag', { ListTag: post.tags })} style={[styles.name]}>
                                                                        {post.tags.length - 1} người khác
                                                                    </Text>
                                                                </>
                                                            )}
                                                        </Text>
                                                    )}
                                                </Text>
                                                <View style={styles.boxName}>
                                                    <Text style={styles.time}>{timeAgo}</Text>
                                                    {getIcon(post.status)}
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                {post.type != 'Share' && (
                                    <TouchableOpacity
                                        onPress={() =>
                                            openBottomSheet(
                                                25,
                                                <View style={{ backgroundColor: '#d9d9d960', borderRadius: 10, padding: 10 }}>
                                                    {ID_user != post.ID_user._id ? (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                closeBottomSheet();
                                                                navigation.navigate('Report', { ID_post: post._id, ID_user: null });
                                                            }}
                                                            style={[styles.deleteButton]}
                                                        >
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                <View>
                                                                    <Icon name="alert-circle" size={20} color="black" />
                                                                </View>
                                                                <Text style={[styles.deleteText]}>
                                                                    {!post._destroy && "Báo cáo"}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                onDelete();
                                                                closeBottomSheet();
                                                            }}
                                                            style={[styles.deleteButton]}
                                                        >
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                {post._destroy ? (
                                                                    <View>
                                                                        <Icon name="refresh-sharp" size={20} color="black" />
                                                                    </View>
                                                                ) : (
                                                                    <View>
                                                                        <Icon name="trash" size={20} color="black" />
                                                                    </View>
                                                                )}
                                                                <Text style={[styles.deleteText]}>
                                                                    {post._destroy ? "Phục hồi" : "Xóa bài viết"}
                                                                </Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}
                                                    {post._destroy && ID_user == post.ID_user._id && (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                onDeleteVinhVien();
                                                                closeBottomSheet();
                                                            }}
                                                            style={styles.deleteButton}
                                                        >
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                <View>
                                                                    <Icon name="trash" size={20} color="black" />
                                                                </View>
                                                                <Text style={styles.deleteText}>Xóa vĩnh viễn</Text>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            )
                                        }
                                    >
                                        <Icon name="ellipsis-horizontal" size={22} color="black" />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {/* {!post?.ID_post_shared?._destroy && (
                                post?.ID_post_shared ? (
                                    <Text style={styles.caption}>{post.ID_post_shared.caption}</Text>
                                ) : (
                                    hasCaption && <Text style={styles.caption}>{post.caption}</Text>
                                )
                            )} */}
                            {post.type == 'Share' ? (
                                !((post?.ID_post_shared?._destroy) || !post?.ID_post_shared)
                                && < Text style={styles.caption}>{post?.ID_post_shared?.caption}</Text>
                            )
                                : (
                                    hasCaption && <Text style={styles.caption}>{post.caption}</Text>
                                )
                            }
                        </View>
                    </View>
                    {/* {!post?.ID_post_shared?._destroy && (
                        post?.ID_post_shared ? (
                            hasMedia && renderMediaGrid(post.ID_post_shared.medias)
                        ) : (
                            hasMedia && renderMediaGrid(post.medias)
                        )
                    )} */}
                    {post.type == 'Share' ? (
                        !((post?.ID_post_shared?._destroy) || !post?.ID_post_shared)
                        && hasMedia && renderMediaGrid(post.ID_post_shared.medias)
                    )
                        : (
                            hasMedia && renderMediaGrid(post.medias)
                        )
                    }
                    {/* Sửa điều kiện hiển thị footer */}
                    {!post._destroy && (
                        <View style={styles.footer}>
                            {post.post_reactions.length > 0 ? (
                                <View style={styles.footer2}>
                                    <TouchableOpacity
                                        style={{ flexDirection: "row", alignItems: "center" }}
                                        onPress={() => {
                                            openBottomSheet(50, renderBottomSheetContent());
                                            setIsVisible(true);
                                        }}
                                    >
                                        {topReactions.map((reaction, index) => (
                                            <Text key={index} style={{ color: 'black' }}>
                                                {reaction.ID_reaction.icon}
                                            </Text>
                                        ))}
                                        <Text style={{ color: 'black', marginLeft: 5 }}>
                                            {post.post_reactions.some(reaction => reaction.ID_user._id === ID_user)
                                                ? post.post_reactions.length === 1
                                                    ? `${me?.first_name + " " + me?.last_name}`
                                                    : `Bạn và ${post.post_reactions.length - 1} người khác`
                                                : `${post.post_reactions.length}`}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={{ flex: 1 }} />
                            )}
                            <View>
                                {post?.comments.length > 0 && (
                                    <Text
                                        style={styles.slReactionsOfPost}
                                        onPress={() => {
                                            console.log("ID_post gửi đi:", post._id);
                                            navigation.navigate("PostDetail", { ID_post: post._id, typeClick: "comment" });
                                        }}
                                    >
                                        {post?.comments.length} bình luận
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                    {/* Hiển thị interactions chỉ khi bài viết không bị xóa */}
                    {!post._destroy && (
                        <View style={styles.interactions}>
                            <TouchableOpacity
                                delayLongPress={200}
                                delayPressOut={0}
                                ref={reactionRef}
                                style={[styles.action, userReaction && { backgroundColor: 'white' }]}
                                onLongPress={handleLongPress}
                                onPress={() =>
                                    userReaction
                                        ? callDeletePost_reaction(post._id, userReaction._id)
                                        : callAddPost_Reaction(reactions[0]._id, reactions[0].name, reactions[0].icon)
                                }
                            >
                                <Text style={styles.actionText}>
                                    {userReaction ? userReaction.ID_reaction.icon : <Icon5 name="like2" size={20} color="black" />}
                                </Text>
                                <Text
                                    style={[
                                        styles.actionText,
                                        userReaction && { color: '#0064E0' }
                                    ]}
                                >
                                    {userReaction ? userReaction.ID_reaction.name : reactions[0].name}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.action}
                                onPress={() => {
                                    console.log("ID_post gửi đi:", post._id);
                                    navigation.navigate("PostDetail", { ID_post: post._id, typeClick: "comment" });
                                }}
                            >
                                <Icon3 name="comment" size={20} color="black" />
                                <Text style={styles.actionText}>Bình luận</Text>
                            </TouchableOpacity>
                            {(
                                canShowShareButton() && (
                                    <TouchableOpacity
                                    style={styles.action}
                                    onPress={() => {
                                        openBottomSheet(55, (
                                            <SharedPost
                                                me={me}
                                                callAddPostShare={callAddPostShare}
                                                copyToClipboard={copyToClipboard}
                                                post={post}
                                                width={width}
                                                styles={styles}
                                                setShareVisible={setShareVisible}
                                            />
                                        ));
                                    }}
                                    disabled={
                                        post && post.type === "Share" && (post.ID_post_shared?._destroy || !post.ID_post_shared)
                                    }
                                >
                                    <Icon4
                                        name="share-alt"
                                        size={20}
                                        //color="black"
                                        color={post && post.type === "Share" && (post.ID_post_shared?._destroy || !post.ID_post_shared)
                                            ? '#888' : 'black'}
                                    />
                                    <Text
                                        style={[styles.actionText,
                                        post && post.type === "Share" && (post.ID_post_shared?._destroy || !post.ID_post_shared)
                                        && { color: '#888' }
                                        ]}
                                    >Chia sẻ</Text>
                                </TouchableOpacity>
                                )
                            )}
                        </View>
                    )}
                </>
            )
            }
            <Modal
                visible={reactionsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setReactionsVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setReactionsVisible(false)}>
                    <View style={styles.overlay}>
                        <View
                            style={[
                                {
                                    position: "absolute",
                                    top: menuPosition.top,
                                    left: 10,
                                }
                            ]}
                        >
                            <View style={[styles.reactionBar]}>
                                {reactions.map((reaction, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.reactionButton}
                                        onPress={() => {
                                            callAddPost_Reaction(reaction._id, reaction.name, reaction.icon);
                                            setReactionsVisible(false);
                                        }}
                                    >
                                        <Text style={styles.reactionText}>{reaction.icon}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Modal
                visible={isImageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        {isVideo(selectedImage) ? (
                            <Video
                                source={{ uri: selectedImage }}
                                style={styles.fullImage}
                                resizeMode="contain"
                                controls={true}
                                paused={false}
                                onError={(e) => console.log("Video error:", e)}
                            />
                        ) : (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.fullImage}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            <Snackbar
                visible={dialogCopyVisible}
                onDismiss={() => setDialogCopyVisible(false)}
                duration={1000}
            >
                Đã sao chép tin nhắn!
            </Snackbar>
            <SuccessModal
                visible={successModalVisible}
                message="Chia sẻ bài viết thành công!"
            />
            <FailedModal
                visible={failedModalVisible}
                message="Chia sẻ bài viết thất bại. Vui lòng thử lại!"
            />
            <LoadingModal visible={isLoading} />
        </View >
    );
});

export default PostItem;