import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useSelector, useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
import {
    addPost_Reaction, // thả biểu cảm
} from '../../rtk/API';
const PostItem = ({
    post,
    ID_user,
    onDelete = () => { },
    onDeleteVinhVien = () => { },
    updatePostReaction = () => { },
}) => {
    const me = useSelector(state => state.app.user)
    const reactions = useSelector(state => state.app.reactions)
    const dispatch = useDispatch();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    //console.log(post.post_reactions)

    // time 
    const [timeAgo, setTimeAgo] = useState(post.createdAt);

    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
    const reactionRef = useRef(null); // ref để tham chiếu tới tin nhắn

    // Cảnh
    // post_reactions: list của reaction của post
    // lọc reactions 
    const uniqueReactions = Array.from(
        new Map(
            post.post_reactions
                .filter(reaction => reaction.ID_reaction !== null)
                .map(reaction => [reaction.ID_reaction._id, reaction])
        ).values()
    );


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

    useEffect(() => {
        const updateDiff = () => {
            const now = Date.now();
            const createdTime = new Date(post.createdAt).getTime(); // Chuyển từ ISO sang timestamp

            if (isNaN(createdTime)) {
                setTimeAgo("Không xác định");
                return;
            }

            const diffMs = now - createdTime;
            if (diffMs < 0) {
                setTimeAgo("Vừa xong");
                return;
            }

            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) setTimeAgo(`${days} ngày trước`);
            else if (hours > 0) setTimeAgo(`${hours} giờ trước`);
            else if (minutes > 0) setTimeAgo(`${minutes} phút trước`);
            else setTimeAgo(`${seconds} giây trước`);
        };

        updateDiff();
        const interval = setInterval(updateDiff, 1000);

        return () => clearInterval(interval);
    }, [post.createdAt]);

    const callAddPost_Reaction = async (ID_reaction, name, icon) => {
        try {
            const paramsAPI = {
                ID_post: post._id,
                ID_user: me._id,
                ID_reaction: ID_reaction,
            };
            await dispatch(addPost_Reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    console.log(response.message);
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

    const hasCaption = post?.caption?.trim() !== '';
    const hasMedia = post?.medias?.length > 0;

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

    const renderMediaGrid = (medias) => {
        const mediaCount = medias.length;

        if (mediaCount === 0) return null;

        return (
            <View style={styles.mediaContainer}>
                {medias.slice(0, 5).map((uri, index) => (
                    <TouchableOpacity key={index} style={getMediaStyle(mediaCount, index)}>
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




    return (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                    <View style={{ marginLeft: 20 }}>
                        <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text>
                        <View style={styles.boxName}>
                            <Text style={styles.time}>{timeAgo}</Text>
                            {/* <Icon name="earth" size={12} color="gray" /> */}
                            {
                                getIcon(post.status)
                            }
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    disabled={ID_user != post.ID_user._id}
                    onPress={() =>
                        openBottomSheet(
                            25,
                            <View>
                                <TouchableOpacity onPress={() => { onDelete(), closeBottomSheet() }}
                                    style={[styles.deleteButton, post._destroy && { backgroundColor: "blue" }]}>
                                    <Text style={[styles.deleteText,]}
                                    >{
                                            post._destroy ? (
                                                "Phục hồi"
                                            ) : "Xóa bài viết"
                                        }
                                    </Text>
                                </TouchableOpacity>
                                {
                                    post._destroy && (
                                        <TouchableOpacity
                                            onPress={() => {
                                                onDeleteVinhVien()
                                                closeBottomSheet()
                                            }}
                                            style={styles.deleteButton}>
                                            <Text style={styles.deleteText}
                                            >Xóa vĩnh viễn
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>,
                        )
                    }

                >
                    <Icon name="ellipsis-horizontal" size={22} color="black" />
                </TouchableOpacity>

            </View>

            {hasCaption && <Text style={styles.caption}>{post?.caption}</Text>}
            {hasMedia && renderMediaGrid(post?.medias)}
            {/* reactions of post */}
            {
                post.post_reactions.length > 0 &&
                (
                    <View
                        style={[styles.vReactionsOfPost]}
                    >
                        {
                            uniqueReactions.map((reaction, index) => (
                                <Text
                                    key={index}
                                //style={styles.reactionText}
                                >{reaction.ID_reaction.icon}</Text>
                            ))
                        }
                        <Text
                            style={styles.slReactionsOfPost}
                        >{post.post_reactions.length}</Text>
                    </View>
                )
            }
            <View style={styles.interactions}>
                <TouchableOpacity
                    ref={reactionRef} // Gắn ref vào đây
                    style={[
                        styles.action,
                        userReaction &&
                        { backgroundColor: 'blue' }
                    ]}
                    onLongPress={() => {
                        handleLongPress();
                    }}
                >
                    {/* <Icon2 name="like" size={25} color="black" /> */}
                    <Text
                        style={styles.actionText}
                    >
                        {userReaction ? userReaction.ID_reaction.icon : "👍"} {/* Nếu đã react, hiển thị icon đó */}
                    </Text>
                    <Text
                        style={[
                            styles.actionText,
                            userReaction &&
                            { color: 'white' }
                        ]}
                    >
                        {userReaction ? userReaction.ID_reaction.name : "Thích"} {/* Nếu đã react, hiển thị icon đó */}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                    <Icon3 name="comment" size={20} color="black" />
                    <Text style={styles.actionText}>Bình luận</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.action}>
                    <Icon4 name="share-alt" size={20} color="black" />
                    <Text style={styles.actionText}>Chia sẻ</Text>
                </TouchableOpacity>
            </View>


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
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        padding: width * 0.025, // 2.5% chiều rộng màn hình
        marginBottom: height * 0.015, // 1.5% chiều cao màn hình
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: height * 0.015,
    },
    avatar: {
        width: width * 0.11, // 11% chiều rộng màn hình
        height: width * 0.11,
        borderRadius: width * 0.25, // Bo tròn ảnh đại diện
    },
    userInfo: {
        flex: 1,
        marginLeft: width * 0.01,
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
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        fontWeight: 'bold',
        color: 'black',
    },
    caption: {
        marginBottom: height * 0.015,
        fontSize: width * 0.035, // 3.5% chiều rộng màn hình
        color: 'black',
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
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
        justifyContent: 'space-around',
        marginTop: height * 0.015,
        paddingVertical: height * 0.015,
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: width * 0.015,
        fontSize: width * 0.035,
        color: 'black',
    },
    deleteButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ff4d4d', // Màu nền đỏ
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    deleteText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white', // Màu chữ trắng
    },
    //reaction
    reactionBar: {
        position: 'absolute',
        flexDirection: "row",
        backgroundColor: "#FFFF",
        padding: 10,
        borderRadius: 20,
    },
    reactionButton: {
        marginHorizontal: 5,
    },
    reactionText: {
        fontSize: 15,
        color: "#000",
        alignSelf: 'flex-end'
    },
    // reaction of post
    vReactionsOfPost: {
        flexDirection: 'row',
        width: '100%',
        height: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    slReactionsOfPost: {
        color: 'black',
        marginHorizontal: 5,
    },
});

export default PostItem;