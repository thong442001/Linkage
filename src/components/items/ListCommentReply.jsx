import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native';
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import Video from 'react-native-video';
const { width, height } = Dimensions.get('window');
import { useSelector, useDispatch } from 'react-redux';
import {
    addComment_Reaction, // api tạo comment_reaction
    deleteComment_reaction, // api delete reaction
} from '../../rtk/API';
import Svg, { Path } from 'react-native-svg';
const ListCommentReply = memo(({ comment, onReply, level = 0 }) => {

    const dispatch = useDispatch()
    const reactions = useSelector(state => state.app.reactions);
    const me = useSelector(state => state.app.user)

    const [comment_reactions, setComment_reactions] = useState(comment.comment_reactions || []);
    const [replys, setReplys] = useState(comment.replys || []);
    const [timeAgo, setTimeAgo] = useState(comment.createdAt);

    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [menuPosition, setMenuPosition] = useState({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }); // Vị trí của menu
    const reactionRef = useRef(null); // ref để tham chiếu tới tin nhắn

    useEffect(() => {
        const updateDiff = () => {
            const now = Date.now();
            const createdTime = new Date(comment.createdAt).getTime();
            if (isNaN(createdTime)) {
                setTimeAgo("Không xác định");
                return;
            }

            const diffMs = now - createdTime;
            const seconds = Math.floor(diffMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
                setTimeAgo(`${days} ngày`);
            } else if (hours > 0) {
                setTimeAgo(`${hours} giờ`);
            } else if (minutes > 0) {
                setTimeAgo(`${minutes} phút`);
            } else {
                setTimeAgo(`${seconds} giây`);
            }
        };

        updateDiff();
    }, []);

    useEffect(() => {
        setReplys(comment.replys ? [...comment.replys] : []);
    }, [comment.replys]);

    // Tìm reaction của chính người dùng hiện tại
    const userReaction = comment_reactions.find(
        (reaction) => reaction.ID_user._id == me._id
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

    // lọc reactions 
    // const uniqueReactions = Array.from(
    //     new Map(
    //         comment_reactions
    //             .filter(reaction => reaction.ID_reaction !== null)
    //             .map(reaction => [reaction.ID_reaction._id, reaction])
    //     ).values()
    // );

    // Nhóm reaction theo ID và đếm số lượng
    const reactionCount = comment_reactions.reduce((acc, reaction) => {
        if (!reaction.ID_reaction) return acc; // Bỏ qua reaction null
        const id = reaction.ID_reaction._id;
        acc[id] = acc[id] ? { ...acc[id], count: acc[id].count + 1 } : { ...reaction, count: 1 };
        return acc;
    }, {});

    // Chuyển object thành mảng và lấy 2 reaction có số lượng nhiều nhất
    const topReactions = Object.values(reactionCount)
        .sort((a, b) => b.count - a.count) // Sắp xếp giảm dần theo count
        .slice(0, 2); // Lấy 2 reaction có số lượng nhiều nhất

    // reaction comment
    const callAddComment_Reaction = async (ID_reaction, name, icon) => {
        try {
            const paramsAPI = {
                ID_comment: comment._id,
                ID_user: me._id,
                ID_reaction: ID_reaction,
            };
            await dispatch(addComment_Reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    //console.log(response.message);
                    const newReaction = {
                        _id: ID_reaction,
                        name: name,
                        icon: icon,
                    };
                    // params: ID_post, newReaction, ID_post_reaction
                    updateCommentReaction(
                        newReaction,
                        response.comment_reaction._id,
                    )
                })
                .catch(error => {
                    console.log('Lỗi call api callAddComment_Reaction', error);
                });
        } catch (error) {
            console.log('Lỗi trong callAddComment_Reaction:', error);
        }
    };

    // Hàm cập nhật bài post sau khi thả biểu cảm
    const updateCommentReaction = (newReaction, ID_comment_reaction) => {
        if (userReaction) {
            //userReaction có thì sửa userReaction trong reactionsOfPost
            const updatedReactions = comment_reactions.map(reaction =>
                reaction.ID_user._id == me._id
                    ? {
                        _id: ID_comment_reaction, // ID của reaction mới từ server
                        ID_user: {
                            _id: me._id,
                            first_name: me.first_name,
                            last_name: me.last_name,
                            avatar: me.avatar,
                        },
                        ID_reaction: newReaction
                    }
                    : reaction
            );
            setComment_reactions(updatedReactions)
        } else {
            // chưa thêm vào
            setComment_reactions([...comment_reactions, {
                _id: ID_comment_reaction, // ID của reaction mới từ server
                ID_user: {
                    _id: me._id,
                    first_name: me.first_name,
                    last_name: me.last_name,
                    avatar: me.avatar,
                },
                ID_reaction: newReaction
            }])
        }
    };

    const callDeleteComment_reaction = async (ID_comment_reaction) => {
        try {
            const paramsAPI = {
                _id: ID_comment_reaction
            };
            await dispatch(deleteComment_reaction(paramsAPI))
                .unwrap()
                .then(response => {
                    // params: ID_post, ID_post_reaction
                    deletCommentReaction(
                        ID_comment_reaction
                    )
                })
                .catch(error => {
                    console.log('Lỗi call api callDeleteComment_reaction', error);
                });
        } catch (error) {
            console.log('Lỗi trong callDeleteComment_reaction:', error);
        }
    };

    // Hàm cập nhật bài post sau khi xóa biểu cảm
    const deletCommentReaction = (ID_comment_reaction) => {
        const updatedReactions = comment_reactions.filter(reaction =>
            reaction._id !== ID_comment_reaction
        );
        setComment_reactions(updatedReactions)
    };

    const renderReply = useCallback(({ item }) => (
        <ListCommentReply comment={item} onReply={(e) => onReply(e)} isReply={true} level={level + 1} />
    ), [onReply]);

    const baseHeight = 30; // Chiều cao của đường kẻ cho reply đầu tiên
    const extraHeight = 110; // Khoảng cách tăng thêm cho mỗi reply sau đó
    const totalHeight = baseHeight + (replys.length - 1) * extraHeight;

    return (
        <View style={[styles.container, level > 0 && styles.replyContainer]}>
            <View style={{ flexDirection: 'row', marginTop: 10, maxWidth: "78%", paddingLeft: level === 1 ? 20 : level === 2 ? 80 : 130 }}>
                <View style={{ flexDirection: 'row' }}>
                    {/* Đường kẻ vuông góc dưới bên trái */}
                    {
                        level <= 2 && (
                            <Svg height="50" width="50">
                                {/* Đoạn thẳng đi xuống */}
                                <Path
                                    d="M 2 0 V 20"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="transparent"
                                />
                                {/* Đoạn cong bo góc */}
                                <Path
                                    d="M 2 17 Q 2 30 20 30"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="transparent"
                                />
                                {/* Đoạn thẳng đi ngang */}
                                <Path
                                    d="M 20 30 H 45"
                                    stroke="gray"
                                    strokeWidth="1"
                                    fill="transparent"
                                />
                            </Svg>
                        )
                    }


                    {/* Avatar */}
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={styles.avatar} source={{ uri: comment.ID_user.avatar }} />
                        {/* Kiểm tra nếu có replys thì mới hiển thị đường kẻ */}
                        {replys.length > 0 && level <= 2 && (
                            <View style={{ position: 'absolute', top: '100%', alignItems: 'center' }}>
                                <Svg height={totalHeight} width="20">
                                    <Path d={`M 2 0 V ${totalHeight}`} stroke="gray" strokeWidth="2" fill="transparent" />
                                </Svg>
                            </View>
                        )}
                        {replys.length > 0 && level >=3 && (
                            <View style={{ position: 'absolute', top: '100%', alignItems: 'center' }}>
                                <Svg height={totalHeight} width="20">
                                    <Path d={`M 2 0 V ${totalHeight}`} stroke="gray" strokeWidth="2" fill="transparent" />
                                </Svg>
                            </View>
                        )}
                    </View>

                </View>

                <View >
                    <View style={styles.boxContent}>
                        <Text style={styles.name}>{comment.ID_user.first_name} {comment.ID_user.last_name}</Text>
                        {comment.type === 'text' ? (
                            <Text style={styles.commentText}>{comment.content}</Text>
                        ) : comment.type === 'image' ? (
                            <Image style={styles.messageImage} source={{ uri: comment.content }} />
                        ) : comment.type === 'video' && (
                            <Video
                                source={{ uri: comment.content }}
                                style={styles.messageVideo}
                                controls
                                resizeMode="contain"
                            />
                        )}

                    </View>
                    <View style={styles.boxInteract2}>
                        <View style={styles.boxInteract}>
                            <Text style={{ color: "black" }}>{timeAgo}</Text>
                            <TouchableOpacity
                                ref={reactionRef} // Gắn ref vào đây
                                onLongPress={() => {
                                    handleLongPress();
                                }}
                                onPress={() => userReaction
                                    ? callDeleteComment_reaction(userReaction._id)
                                    : callAddComment_Reaction(reactions[0]._id, reactions[0].name, reactions[0].icon)
                                }
                            >
                                <Text
                                    style={[
                                        userReaction
                                            ? { color: '#FF9D00' }
                                            : { color: 'black' }
                                    ]}
                                >
                                    {userReaction ? userReaction.ID_reaction.name : reactions[0].name} {/* Nếu đã react, hiển thị icon đó */}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => onReply(comment)}>
                                <Text style={{ color: "black" }}>Trả lời</Text>
                            </TouchableOpacity>
                        </View>

                        <View>
                            {/* butonsheet reaction biểu cảm */}
                            <TouchableOpacity
                            //</View>onPress={() => openBottomSheet(50, renderBottomSheetContent())}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    {
                                        comment_reactions.length > 0
                                        && (
                                            <Text style={styles.reactionText}>
                                                {comment_reactions.length}
                                            </Text>
                                        )
                                    }
                                    {
                                        topReactions.map((reaction, index) => (
                                            <View key={index}>
                                                <Text style={styles.reactionText}>
                                                    {reaction.ID_reaction.icon}
                                                </Text>
                                            </View>
                                        ))}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
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
                                    left: width * 0.25,
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
                                                callAddComment_Reaction(reaction._id, reaction.name, reaction.icon)
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

            {/* Chỉ thụt vào ở cấp 1, cấp cao hơn không thụt thêm */}
            <FlatList
                data={replys}
                renderItem={renderReply}
                keyExtractor={(item) => item._id.toString()}
            // getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
            />
        </View >
    );
});

export default ListCommentReply;

const styles = StyleSheet.create({
    avatar: {
        width: width * 0.1, // ~10% chiều rộng màn hình
        height: width * 0.1,
        borderRadius: width * 0.05, // Giữ hình tròn
    },
    container: {
        marginVertical: height * 0.005,
        flex: 1,
    },
    replyContainer: {
        position: 'relative',
    },
    boxInteract: {
        flexDirection: 'row',
        gap: width * 0.025,
        marginTop: height * 0.005,
    },
    boxInteract2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        flexWrap: 'wrap',
    },
    boxContent: {
        marginLeft: width * 0.04,
        padding: width * 0.03,
        backgroundColor: '#d9d9d990',
        borderRadius: width * 0.05,
        paddingLeft: width * 0.04,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    name: {
        fontSize: width * 0.035,
        fontWeight: "bold",
        marginBottom: height * 0.005,
        color: 'black',
    },
    commentText: {
        lineHeight: height * 0.03,
        color: 'black',
    },
    messageImage: {
        width: width * 0.4,
        height: width * 0.5,
        borderRadius: width * 0.02,
    },
    messageVideo: {
        width: width * 0.4,
        height: width * 0.6,
        borderRadius: width * 0.02,
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
    reactionBar: {
        position: 'absolute',
        flexDirection: "row",
        backgroundColor: "#FFFF",
        padding: width * 0.03,
        borderRadius: width * 0.05,
    },
    reactionButton: {
        marginHorizontal: width * 0.015,
    },
    reactionText: {
        fontSize: width * 0.04,
        color: "#000",
        alignSelf: 'flex-end',
    },
    lineContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginRight: width * 0.04,
    },
    line2: {
        width: width * 0.002,
        height: height * 0.03,
        backgroundColor: 'gray',
    },
    line: {
        width: width * 0.08,
        height: width * 0.002,
        backgroundColor: 'gray',
    }
});