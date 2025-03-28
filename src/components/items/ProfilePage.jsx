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
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useSelector, useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
import {
    addPost_Reaction,
    addPost,
    deletePost_reaction,
} from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';

const PostItem = memo(({
    post,
    ID_user,
    onDelete = () => { },
    onDeleteVinhVien = () => { },
    updatePostReaction = () => { },
    deletPostReaction = () => { },
    currentTime
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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: "Công khai"
    });
    const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 });
    const reactionRef = useRef(null);
    const [captionShare, setCaptionShare] = useState('');
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
                                onPress={() => setSelectedTab(item.id)}>
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
            ]),
        ).values(),
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
                selectedTab === 'all' || reaction.ID_reaction._id === selectedTab,
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

    const handleShare = () => {
        if (reactionRef.current) {
            reactionRef.current.measure((x, y, width, height, pageX, pageY) => {
                setMenuPosition({
                    top: pageY - 57,
                    left: pageX,
                    right: pageX,
                });
                setShareVisible(true);
            });
        }
    };

    const status = [
        { status: 1, name: "Công khai" },
        { status: 2, name: "Bạn bè" },
        { status: 3, name: "Chỉ mình tôi" },
    ];

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setModalVisible(false);
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

    const callAddPost_Reaction = (ID_reaction, name, icon) => {
        // 1. Cập nhật giao diện ngay lập tức (Optimistic Update)
        const newReaction = {
            _id: ID_reaction,
            name: name,
            icon: icon,
        };
        updatePostReaction(post._id, newReaction, `temp-${Date.now()}`); // Tạm thời tạo ID giả
    
        // 2. Gọi API ngầm
        const paramsAPI = {
            ID_post: post._id,
            ID_user: ID_user,
            ID_reaction: ID_reaction,
        };
        dispatch(addPost_Reaction(paramsAPI))
            .unwrap()
            .then(response => {
                // Cập nhật lại ID chính xác từ API
                updatePostReaction(post._id, newReaction, response.post_reaction._id);
            })
            .catch(error => {
                console.log('Lỗi call api addPost_Reaction', error);
                // Rollback nếu API thất bại
                deletPostReaction(post._id, `temp-${Date.now()}`);
            });
    };

    const callDeletePost_reaction = (ID_post, ID_post_reaction) => {
        // 1. Cập nhật giao diện ngay lập tức (Optimistic Update)
        deletPostReaction(ID_post, ID_post_reaction);
        
        // 2. Gọi API ngầm
        const paramsAPI = {
            _id: ID_post_reaction,
        };
        dispatch(deletePost_reaction(paramsAPI))
            .unwrap()
            .then(response => {
                // Xóa thành công, không cần làm gì thêm
            })
            .catch(error => {
                console.log('Lỗi call api callDeletePost_reaction', error);
                // Rollback nếu API thất bại: thêm lại reaction
                const reaction = post.post_reactions.find(r => r._id === ID_post_reaction);
                if (reaction) {
                    updatePostReaction(ID_post, reaction.ID_reaction, ID_post_reaction);
                }
            });
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
        if (count === 1) {
            return styles.singleMedia;
        } else if (count === 2) {
            return styles.doubleMedia;
        } else if (count === 3) {
            return index === 0 ? styles.tripleMediaFirst : styles.tripleMediaSecond;
        } else if (count === 4) {
            return styles.quadMedia;
        } else {
            if (index < 2) return styles.fivePlusMediaFirstRow;
            else if (index === 2) return styles.fivePlusMediaSecondRowLeft;
            else if (index === 3) return styles.fivePlusMediaSecondRowMiddle;
            else return styles.fivePlusMediaSecondRowRight;
        }
    };

    const callAddPostShare = async () => {
        try {
            const paramsAPI = {
                ID_user: ID_user,
                caption: captionShare,
                medias: [],
                status: selectedOption.name,
                type: 'Share',
                ID_post_shared: post.ID_post_shared ? post.ID_post_shared._id : post._id,
                tags: [],
            };
            await dispatch(addPost(paramsAPI))
                .unwrap()
                .then((response) => {
                    setShareVisible(false);
                })
                .catch((error) => {
                    console.log('Error1 callAddPostShare:', error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={styles.postContainer}>
            <View>
                {post.ID_post_shared && (
                    <View>
                        <View style={[styles.headerShare]}>
                            <View style={styles.userInfo}>
                                <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                                <View style={{ marginLeft: width * 0.01 }}>
                                    <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text>
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
                                            {ID_user != post.ID_user._id ? (
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        closeBottomSheet();
                                                        navigation.navigate('Report', { ID_post: post._id, ID_user: null });
                                                    }}
                                                    style={[styles.deleteButton, post._destroy && { backgroundColor: "blue" }]}
                                                >
                                                    <Text style={[styles.deleteText]}>
                                                        {!post._destroy && "Báo cáo"}
                                                    </Text>
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
                                                        <View>
                                                            <Icon name="trash" size={20} color="black" />
                                                        </View>
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
                                                    <Text style={styles.deleteText}>Xóa vĩnh viễn</Text>
                                                </TouchableOpacity>
                                            )}
                                        </View>,
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
                <View style={post.ID_post_shared ? styles.header1 : styles.header2}>
                    <View style={styles.header}>
                        <View>
                            {post.ID_post_shared ? (
                                <View style={styles.userInfo}>
                                    <Image source={{ uri: post.ID_post_shared.ID_user.avatar }} style={styles.avatar} />
                                    <View style={{ marginLeft: width * 0.01 }}>
                                        <Text style={styles.name}>
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
                                                            <Text onPress={() => console.log('Xem danh sách tag')} style={[styles.name]}>
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
                                                            <Text onPress={() => console.log('Xem danh sách tag')} style={[styles.name]}>
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
                        {!post.ID_post_shared && (
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
                                        </View>,
                                    )
                                }
                            >
                                <Icon name="ellipsis-horizontal" size={22} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {post?.ID_post_shared ? (
                        <Text style={styles.caption}>{post.ID_post_shared.caption}</Text>
                    ) : (
                        hasCaption && <Text style={styles.caption}>{post.caption}</Text>
                    )}
                </View>
            </View>
            {post?.ID_post_shared ? (
                hasMedia && renderMediaGrid(post.ID_post_shared.medias)
            ) : (
                hasMedia && renderMediaGrid(post.medias)
            )}
            {/* Chỉ hiển thị footer nếu bài viết không ở trạng thái _destroy */}
            {!post._destroy && (
                <View style={styles.footer}>
                    {post.post_reactions.length > 0 ? (
                        <View style={styles.footer2}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center" }}
                                onPress={() => { openBottomSheet(50, renderBottomSheetContent()), setIsVisible(true) }}
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
                            <Text style={styles.slReactionsOfPost}>
                                {post?.comments.length} bình luận
                            </Text>
                        )}
                    </View>
                </View>
            )}
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
    <View style={styles.actionContent}>
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
    </View>
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
                    <TouchableOpacity style={styles.action} onPress={() => handleShare()}>
                        <Icon4 name="share-alt" size={20} color="black" />
                        <Text style={styles.actionText}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            )}
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
                visible={shareVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setShareVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShareVisible(false)}>
                    <View style={styles.overlay1}>
                        <View style={styles.modalContainer}>
                            <View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={{ uri: me?.avatar }} style={styles.avatar} />
                                    <View style={{ marginLeft: 10 }}>
                                        <Text style={styles.name}>{me?.first_name + " " + me?.last_name}</Text>
                                        <View style={styles.boxStatus}>
                                            <TouchableOpacity
                                                style={styles.btnStatus}
                                                onPress={() => setModalVisible(true)}
                                            >
                                                <Text style={styles.txtPublic}>{selectedOption.name}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ marginHorizontal: 10 }}>
                                    <TextInput
                                        placeholder='Hãy nói gì đó về nội dung này'
                                        placeholderTextColor={"gray"}
                                        multiline={true}
                                        style={styles.contentShare}
                                        value={captionShare}
                                        onChangeText={setCaptionShare}
                                    />
                                    <View style={{ backgroundColor: "#0064E0", borderRadius: 10, alignItems: 'center' }}>
                                        <TouchableOpacity
                                            style={{ padding: 10 }}
                                            onPress={callAddPostShare}
                                        >
                                            <Text style={{ color: 'white' }}>Chia sẻ ngay</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
                                style={styles.optionButton}
                                onPress={() => handleSelectOption(option)}
                            >
                                <Text style={styles.optionText}>{option.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
            <Modal
                visible={isImageModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setImageModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: height * 0.005,
    },
    header1: {
        backgroundColor: 'white',
        borderColor: 'gray',
        borderTopWidth: 0.5,
        borderRightWidth: 0.5,
        borderLeftWidth: 0.5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: width * 0.02
    },
    header2: {},
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.04,
        marginVertical: height * 0.015,
    },
    headerMainNull: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.04,
        marginVertical: height * 0.015,
    },
    headerShare: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.04,
        marginVertical: height * 0.015,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.04,
        justifyContent: 'space-between',
        marginTop: height * 0.015,
    },
    footer2: {},
    avatar: {
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.25,
    },
    userInfo: {
        flex: 1,
        alignItems: 'center',
        flexDirection: 'row'
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: width * 0.028,
        marginRight: width * 0.01,
        color: 'grey',
    },
    name: {
        fontSize: width * 0.045,
        fontWeight: '500',
        color: 'black',
        width: width * 0.6
    },
    caption: {
        marginBottom: height * 0.015,
        fontSize: width * 0.045,
        color: 'black',
        marginLeft: width * 0.04
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    singleMedia: {
        width: '100%',
        height: height * 0.4,
    },
    doubleMedia: {
        width: '49.5%',
        height: height * 0.4,
        padding: 1,
    },
    tripleMediaFirst: {
        width: '100%',
        height: height * 0.33,
        padding: 1,
    },
    tripleMediaSecond: {
        width: '49.5%',
        height: height * 0.2,
        padding: 1,
    },
    quadMedia: {
        width: '49.5%',
        height: height * 0.2,
        padding: 1,
    },
    fivePlusMediaFirstRow: {
        width: '49.5%',
        height: height * 0.2,
        padding: 1,
    },
    fivePlusMediaSecondRowLeft: {
        width: '32.66%',
        height: height * 0.2,
        padding: 1,
    },
    fivePlusMediaSecondRowMiddle: {
        width: '32.66%',
        height: height * 0.2,
        padding: 1,
    },
    fivePlusMediaSecondRowRight: {
        width: '32.66%',
        height: height * 0.2,
        padding: 1,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoWrapper: {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    overlay: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlayText: {
        color: 'white',
        fontSize: width * 0.06,
        fontWeight: 'bold',
    },
    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: height * 0.015,
        paddingVertical: height * 0.015,
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
        marginHorizontal: width * 0.04,
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10, 
        paddingHorizontal: 15, 
        borderRadius: 8, 
    },
    actionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        fontSize: width * 0.035,
        color: 'black',
        marginLeft: width * 0.01,
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginLeft: 10
    },
    reactionBar: {
        position: 'absolute',
        flexDirection: "row",
        backgroundColor: "#e3e3e3",
        padding: 5,
        borderRadius: 20,
    },
    reactionButton: {
        marginHorizontal: 5,
    },
    reactionText: {
        fontSize: 20,
        color: "#000",
        alignSelf: 'flex-end',
    },
    vReactionsOfPost: {
        flexDirection: 'row',
        width: '100%',
        height: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        marginTop: height * 0.02
    },
    slReactionsOfPost: {
        color: 'black',
        flexDirection: 'flex-start',
    },
    overlay1: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
    },
    modalContent: {
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent1: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    optionButton: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    btnStatus: {
        backgroundColor: '#B2D5F8',
        padding: 7,
        borderRadius: 10,
        alignItems: 'center',
    },
    txtPublic: {
        fontSize: 13,
        color: '#0064E0'
    },
    boxStatus: {
        marginTop: 5,
        flexDirection: 'row',
    },
    contentShare: {
        width: "auto",
        padding: 10,
        marginVertical: 10,
        color: "black",
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
    },
    headerReaction: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        color: 'black',
        fontSize: 16,
        fontWeight: '600',
    },
    tabContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#E4E4E4',
    },
    tab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    selectedTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#1877F2',
    },
    tabIcon: {
        marginRight: 4,
        fontSize: 16,
        color: 'black'
    },
    tabLabel: {
        color: 'black',
        fontSize: 14,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userName: {
        fontSize: 14,
        fontWeight: '500',
    },
    icon: {
        position: 'absolute',
        marginLeft: 25,
        marginTop: 25,
    },
    container_listReaction: {
        flexDirection: 'column',
    },
    nameItemReaction: {
        color: 'black',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    fullImage: {
        width: "90%",
        height: "80%",
    },
});

export default PostItem;