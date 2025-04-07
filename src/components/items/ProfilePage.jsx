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
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
const { width, height } = Dimensions.get('window');
import {
    addPost_Reaction, // thả biểu cảm
    addPost, // api share
    deletePost_reaction,//xóa post_reaction
} from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
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
    const me = useSelector(state => state.app.user)
    const reactions = useSelector(state => state.app.reactions)
    const dispatch = useDispatch();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    //console.log(post.post_reactions)
    //console.log("imgs: " + post?.ID_post_shared?.medias)

    // time 
    const [timeAgo, setTimeAgo] = useState(post.createdAt);
    const [timeAgoShare, setTimeAgoShare] = useState(post?.ID_post_shared?.createdAt);

    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    // trang thai
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: "Công khai"
    });
    const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
    const reactionRef = useRef(null); // ref để tham chiếu tới tin nhắn

    //share 
    const [captionShare, setCaptionShare] = useState('');

    // Cảnh
    // post_reactions: list của reaction của post
    const [selectedTab, setSelectedTab] = useState('all');
    const [isFirstRender, setIsFirstRender] = useState(true);


    //hien len anh
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    // Khi selectedTab thay đổi, cập nhật nội dung BottomSheet
    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return; // Bỏ qua lần chạy đầu tiên
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

                {/* Tabs */}
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

                {/* Danh sách người dùng */}
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

    //   Tạo danh sách tab từ uniqueReactions
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

    // Lọc danh sách người dùng theo reaction được chọn
    const filteredUsers = post.post_reactions
        .filter(
            reaction =>
                selectedTab === 'all' || reaction.ID_reaction._id === selectedTab,
        )
        .map(reaction => ({
            id: `${reaction.ID_user._id}-${reaction._id}`, // Tạo key duy nhất
            userId: reaction.ID_user._id, // ID của người dùng
            name: `${reaction.ID_user.first_name} ${reaction.ID_user.last_name}`,
            avatar: reaction.ID_user.avatar,
            reactionId: reaction.ID_reaction._id,
            reactionIcon: reaction.ID_reaction.icon,
            quantity: reaction.quantity,
        }));


    // lọc reactions 
    // const uniqueReactions = Array.from(
    //     new Map(
    //         post.post_reactions
    //             .filter(reaction => reaction.ID_reaction !== null)
    //             .map(reaction => [reaction.ID_reaction._id, reaction])
    //     ).values()
    // );

    // Nhóm reaction theo ID và đếm số lượng
    const reactionCount = post.post_reactions.reduce((acc, reaction) => {
        if (!reaction.ID_reaction) return acc; // Bỏ qua reaction null
        const id = reaction.ID_reaction._id;
        acc[id] = acc[id] ? { ...acc[id], count: acc[id].count + 1 } : { ...reaction, count: 1 };
        return acc;
    }, {});

    // Chuyển object thành mảng và lấy 2 reaction có số lượng nhiều nhất
    const topReactions = Object.values(reactionCount)
        .sort((a, b) => b.count - a.count) // Sắp xếp giảm dần theo count
        .slice(0, 2); // Lấy 2 reaction có số lượng nhiều nhất

    // Tìm reaction của chính người dùng hiện tại
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

    //share
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
    }

    // Các tùy chọn trạng thái
    const status = [
        {
            status: 1,
            name: "Công khai"
        },
        {
            status: 2,
            name: "Bạn bè"
        },
        {
            status: 3,
            name: "Chỉ mình tôi"
        },
    ];

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setModalVisible(false);
    };

    useEffect(() => {
        const updateDiff = () => {
            const now = Date.now();
            const createdTime = new Date(post.createdAt).getTime(); // Chuyển từ ISO sang timestamp

            let createdTimeShare = null;
            if (post.ID_post_shared?.createdAt) {
                createdTimeShare = new Date(post.ID_post_shared.createdAt).getTime();
            }

            if (isNaN(createdTime)) {
                setTimeAgo("Không xác định");
                setTimeAgoShare("Không xác định");
                return;
            }

            // Tính thời gian cho bài viết chính
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

            // Nếu bài viết là chia sẻ, tính thời gian cho bài gốc
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
        // const interval = setInterval(updateDiff, 1000);

        // return () => clearInterval(interval);
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
                    //console.log(response.message);
                    const newReaction = {
                        _id: ID_reaction,
                        name: name,
                        icon: icon,
                    };
                    // params: ID_post, newReaction, ID_post_reaction
                    updatePostReaction(
                        post._id,
                        newReaction,
                        response.post_reaction._id,
                    )
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
            const paramsAPI = {
                _id: ID_post_reaction
            };
            await dispatch(deletePost_reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    // params: ID_post, ID_post_reaction
                    deletPostReaction(
                        ID_post,
                        ID_post_reaction
                    )
                })
                .catch(error => {
                    console.log('Lỗi call api callDeletePost_reaction', error);
                });
        } catch (error) {
            console.log('Lỗi trong callDeletePost_reaction:', error);
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
                return <Icon name="lock-closed" size={12} color="gray" />; // mặc định
        }
    }

    const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');


    //render anh
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
        } else { // 5+ media
            if (index < 2) return styles.fivePlusMediaFirstRow;
            else if (index === 2) return styles.fivePlusMediaSecondRowLeft;
            else if (index === 3) return styles.fivePlusMediaSecondRowMiddle;
            else return styles.fivePlusMediaSecondRowRight;
        }
    };

    //call api addPost
    const callAddPostShare = async () => {
        try {
            setIsLoading(true);
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
                    setIsLoading(false)
                    setShareVisible(false);
                    setSuccessModalVisible(true);
                    setTimeout(() => {
                        setSuccessModalVisible(false);
                    }, 1500);
                })
                .catch((error) => {
                    setIsLoading(false)
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
        }
    };



    return (
        <View style={styles.postContainer}>
            <View>
                {/* Header share  */}
                {
                    post.ID_post_shared && (
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
                                                {/* Nếu không phải tác giả, hiển thị "Báo cáo" */}
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
                                                        {/* Nếu là tác giả, hiển thị tùy chọn dựa trên trạng thái _destroy */}
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                onDelete(); // Phục hồi hoặc Xóa bài viết
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

                                                        {/* Nếu bài viết đã bị xóa, thêm tùy chọn "Xóa vĩnh viễn" */}
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
                    )
                }
                {/* Header goc  */}
                <View style={post.ID_post_shared ? styles.header1 : styles.header2} >
                    <View style={styles.header}>
                        <View>
                            {
                                post.ID_post_shared
                                    ?
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
                                            {/* <Text style={styles.name}>{post.ID_post_shared.ID_user.first_name + " " + post.ID_post_shared.ID_user.last_name}</Text> */}
                                            <View style={styles.boxName}>
                                                <Text style={styles.time}>{timeAgoShare}</Text>
                                                {/* <Icon name="earth" size={12} color="gray" /> */}
                                                {
                                                    getIcon(post.ID_post_shared.status)
                                                }
                                            </View>
                                        </View>
                                    </View>
                                    :
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
                                            {/* <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text> */}
                                            <View style={styles.boxName}>
                                                <Text style={styles.time}>{timeAgo}</Text>
                                                {/* <Icon name="earth" size={12} color="gray" /> */}
                                                {
                                                    getIcon(post.status)
                                                }
                                            </View>
                                        </View>
                                    </View>
                            }
                        </View>

                        {
                            !post.ID_post_shared &&
                            <TouchableOpacity
                                onPress={() =>
                                    openBottomSheet(
                                        25,
                                        <View style={{ backgroundColor: '#d9d9d960', borderRadius: 10, padding: 10 }}>
                                            {
                                                ID_user != post.ID_user._id
                                                    ? (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                closeBottomSheet()
                                                                navigation.navigate('Report', { ID_post: post._id, ID_user: null })
                                                            }}
                                                            style={[styles.deleteButton]}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                <View>
                                                                    <Icon name="alert-circle" size={20} color="black" />
                                                                </View>
                                                                <Text style={[styles.deleteText,]}>
                                                                    {
                                                                        !post._destroy
                                                                        && (
                                                                            "Báo cáo"
                                                                        )
                                                                    }
                                                                </Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                    ) : (
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                onDelete()
                                                                closeBottomSheet()
                                                            }}
                                                            style={[styles.deleteButton]}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                {
                                                                    post._destroy ?
                                                                        <View>
                                                                            <Icon name="refresh-sharp" size={20} color="black" />
                                                                        </View>
                                                                        :
                                                                        <View>
                                                                            <Icon name="trash" size={20} color="black" />
                                                                        </View>
                                                                }
                                                                <Text style={[styles.deleteText,]}>
                                                                    {
                                                                        post._destroy ? (
                                                                            "Phục hồi"
                                                                        ) : "Xóa bài viết"
                                                                    }
                                                                </Text>
                                                            </View>

                                                        </TouchableOpacity>
                                                    )
                                            }

                                            {
                                                (post._destroy && ID_user == post.ID_user._id)
                                                && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            onDeleteVinhVien()
                                                            closeBottomSheet()
                                                        }}
                                                        style={styles.deleteButton}>
                                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                            <View>
                                                                <Icon name="trash" size={20} color="black" />
                                                            </View>
                                                            <Text style={styles.deleteText}
                                                            >Xóa vĩnh viễn
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }
                                        </View>,
                                    )
                                }

                            >
                                <Icon name="ellipsis-horizontal" size={22} color="black" />
                            </TouchableOpacity>
                        }
                    </View>
                    {
                        post?.ID_post_shared
                            ? (
                                <Text style={styles.caption}>{post.ID_post_shared.caption}</Text>
                            )
                            :
                            (
                                hasCaption && <Text style={styles.caption}>{post.caption}</Text>
                            )
                    }
                </View>
            </View>
            {
                post?.ID_post_shared
                    ? (
                        hasMedia && renderMediaGrid(post.ID_post_shared.medias)
                    )
                    :
                    (
                        hasMedia && renderMediaGrid(post.medias)
                    )
            }


            {!post._destroy && (
                <View style={styles.footer}>
                    {/* reactions of post */}
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
                                            : `Bạn và ${post.post_reactions.length - 1} người khác` // Bạn và người khác
                                        : `${post.post_reactions.length}`} {/* Không có bạn */}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={{ flex: 1 }} /> // Thêm View rỗng để giữ khoảng trống
                    )}
                    {/* số lượng bình luận luôn sát bên phải */}
                    <View>
                        {post?.comments.length > 0 && (
                            <Text style={styles.slReactionsOfPost}>
                                {post?.comments.length} bình luận
                            </Text>
                        )}
                    </View>
                </View>
            )}

            {
                !post._destroy &&
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
                        {/* <Icon2 name="like" size={25} color="black" /> */}

                        <Text
                            style={styles.actionText}
                        >
                            {userReaction ? userReaction.ID_reaction.icon : <Icon5 name="like2" size={20} color="black" />} {/* Nếu đã react, hiển thị icon đó */}
                        </Text>
                        <Text
                            style={[
                                styles.actionText,
                                userReaction &&
                                { color: '#0064E0' }
                            ]}>
                            {userReaction ? userReaction.ID_reaction.name : reactions[0].name} {/* Nếu đã react, hiển thị icon đó */}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.action}
                        onPress={() => {
                            console.log("ID_post gửi đi:", post._id); // Kiểm tra ID trước khi chuyển trang
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
            }
            {/* reactions biểu cảm */}
            < Modal
                visible={reactionsVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setReactionsVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => setReactionsVisible(false)}
                >
                    <View style={styles.overlay}>
                        <View
                            style={[
                                {
                                    position: "absolute",
                                    top: menuPosition.top,
                                    left: 10,
                                }
                            ]} // Cập nhật vị trí reactions
                        >
                            <View
                                style={[styles.reactionBar]}
                            >
                                {
                                    reactions.map((reaction, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.reactionButton}
                                            onPress={() => {
                                                callAddPost_Reaction(reaction._id, reaction.name, reaction.icon)
                                                setReactionsVisible(false);
                                            }}
                                        >
                                            <Text style={styles.reactionText}>{reaction.icon}</Text>
                                        </TouchableOpacity>
                                    ))
                                }
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal >


            {/* Chia sẻ */}
            <Modal
                visible={shareVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setShareVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShareVisible(false)}>
                    <View style={styles.overlay1}>
                        <View style={styles.modalContainer}>
                            <View >
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
                                    <TouchableOpacity
                                        onPress={callAddPostShare}
                                        style={{ padding: 10, backgroundColor: "#0064E0", borderRadius: 10, alignItems: 'center' }}>
                                        <View >


                                            <Text style={{ color: 'white' }}>Chia sẻ ngay</Text>

                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {/* Modal để hiển thị danh sách trạng thái */}
            < Modal
                transparent={true}  // Cho phép nền của modal trong suốt, giúp nhìn thấy nền bên dưới modal.
                visible={modalVisible}  // Điều khiển việc modal có hiển thị hay không dựa trên trạng thái `modalVisible`.
                animationType="fade"  // Hiệu ứng khi modal xuất hiện. Ở đây là kiểu "slide" từ dưới lên.
                onRequestClose={() => setModalVisible(false)}  // Khi modal bị yêu cầu đóng (ví dụ trên Android khi bấm nút back), hàm này sẽ được gọi để đóng modal.
            >
                <TouchableOpacity
                    style={styles.modalOverlay}  // Overlay của modal, tạo hiệu ứng làm mờ nền dưới modal.
                    onPress={() => setModalVisible(false)}  // Đóng modal khi người dùng chạm vào khu vực bên ngoài modal.
                >
                    {/* // Nội dung chính của modal, nơi hiển thị các tùy chọn. */}
                    <View style={styles.modalContent1}>
                        {
                            status.map((option, index) => (
                                <TouchableOpacity
                                    key={index}  // Mỗi phần tử trong danh sách cần có một key duy nhất.
                                    style={styles.optionButton}  // Styling cho mỗi nút tùy chọn trong danh sách.
                                    onPress={() => {
                                        //console.log(option.name)
                                        handleSelectOption(option)
                                    }}  // Khi người dùng chọn một tùy chọn, hàm này sẽ được gọi để cập nhật trạng thái và đóng modal.
                                >
                                    {/* // Hiển thị tên của tùy chọn. */}
                                    <Text style={styles.optionText}>{option.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            </Modal >


            {/* Modal hiển thị ảnh */}
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
                                controls={true} // Hiển thị nút điều khiển cho video
                                paused={false} // Tự động phát khi mở modal
                                onError={(e) => console.log("Video error:", e)} // Xử lý lỗi nếu có
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


            <SuccessModal
                visible={successModalVisible}
                message="Chia sẻ bài viết thành công!"
            />


            <FailedModal
                visible={failedModalVisible}
                message="Chia sẻ bài viết thất bại. Vui lòng thử lại!"
            />


            <FailedModal
                visible={failedModalVisible}
                message="Chia sẻ bài viết thất bại. Vui lòng thử lại!"
            />

            <LoadingModal
                visible={isLoading}
            />
        </View >
    );
});

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        // padding: width * 0.025, // 2.5% chiều rộng màn hình
        marginBottom: height * 0.005, // 1.5% chiều cao màn hình
    },
    header1: {
        backgroundColor: 'white',
        borderColor: '#d9d9d9d9',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        marginHorizontal: width * 0.02
    },
    header2: {
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: width * 0.04, // 2.5% chiều rộng 
        marginVertical: height * 0.015, // 1.5% chiều cao 
        // marginTop: height * 0.015,
    },
    headerMainNull: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: height * 0.015,
        marginHorizontal: width * 0.04, // 2.5% chiều rộng 
        marginVertical: height * 0.015, // 1.5% chiều cao 
        // marginTop: height * 0.015,
    },
    headerShare: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginBottom: height * 0.015,
        marginHorizontal: width * 0.04, // 2.5% chiều rộng 
        marginVertical: height * 0.015, // 1.5% chiều cao 
        // marginTop: height * 0.015,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.04,
        justifyContent: 'space-between',
        marginTop: height * 0.015,
    },
    footer2: {
        // marginTop: height * 0.02,
        // alignItems:'center'
    },
    avatar: {
        width: width * 0.11, // 11% chiều rộng màn hình
        height: width * 0.11,
        borderRadius: width * 0.25, // Bo tròn ảnh đại diện
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
        fontSize: width * 0.028, // 2.8% chiều rộng màn hình
        marginRight: width * 0.01,
        color: 'grey',
    },
    name: {
        fontSize: width * 0.045, // 4% chiều rộng màn hình
        fontWeight: '500',
        color: 'black',
        width: width * 0.6
    },
    caption: {
        marginBottom: height * 0.015,
        fontSize: width * 0.045, // 4% chiều rộng màn hình
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
        height: height * 0.4, // 40% chiều cao màn hình
    },
    doubleMedia: {
        width: '49.5%',
        height: height * 0.4,
        padding: 1,
    },
    tripleMediaFirst: {
        width: '100%',
        height: height * 0.33, // 33% chiều cao màn hình
        padding: 1,
    },
    tripleMediaSecond: {
        width: '49.5%',
        height: height * 0.2, // 20% chiều cao màn hình
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
    // list reactions 
    overlay: {
        position: 'absolute',
        //backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    overlayText: {
        color: 'white',
        fontSize: width * 0.06, // 6% chiều rộng màn hình
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
        // alignItems: 'center',
    },
    deleteText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black', // Màu chữ trắng
        marginLeft: 10
    },
    //reaction
    reactionBar: {
        position: 'absolute',
        flexDirection: "row",
        backgroundColor: "#FFFF",
        padding: 5,
        borderRadius: 20,
    },
    reactionButton: {
        marginHorizontal: 5,
    },
    reactionText: {
        fontSize: 18,
        color: "#000",
        alignSelf: 'flex-end',
    },
    // reaction of post
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
        // flex: 'flex-end',
        flexDirection: 'flex-start',
    },
    //modal share
    overlay1: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)", // Màu xám xung quanh
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white", // Modal giữ nguyên màu trắng
        borderRadius: 10,
        padding: 20,
    },
    modalContent: {
        alignItems: "center",
    },
    // model status
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
    //content Share
    contentShare: {
        width: "auto",  // Hoặc có thể dùng flex: 1
        // minHeight: 40, // Đảm bảo đủ không gian nhập liệu
        // flex: 1, // Giúp mở rộng khi nhập nhiều dòng
        // textAlignVertical: "top", // Căn chữ lên trên
        // borderWidth: 1, 
        // borderColor: "gray", 
        // borderRadius: 5, 
        padding: 10,
        marginVertical: 10,
        color: "black",
    },
    //buttonsheet reaction
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
    //anh
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