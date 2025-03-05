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
} from 'react-native'
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import ListCommentReply from './ListCommentReply';
import { useSelector, useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
import Video from 'react-native-video';
import {
    addComment_Reaction, // api tạo comment_reaction
    deleteComment_reaction, // api delete reaction
} from '../../rtk/API';
const ListComment = memo(({ comment, onReply }) => {

    const dispatch = useDispatch()
    const reactions = useSelector(state => state.app.reactions);
    const me = useSelector(state => state.app.user)

    const [comment_reactions, setComment_reactions] = useState(comment.comment_reactions || []);
    const [replys, setrReplys] = useState(comment.replys || []);
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
        };

        updateDiff();
    }, []);

    useEffect(() => {
        setrReplys(comment.replys ? [...comment.replys] : []);
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
        <ListCommentReply
            comment={item}
            onReply={(e) => onReply(e)}
            isReply={true}
            level={1}
        />
    ), [onReply]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                <Image style={styles.avatar} source={{ uri: comment.ID_user.avatar }} />
                <View>
                    <View style={styles.boxContent}>
                        <Text style={styles.name}>{comment.ID_user.first_name} {comment.ID_user.last_name}</Text>
                        {
                            comment.type == 'text' ? (
                                <Text style={styles.commentText}>{comment.content}</Text>
                            ) : comment.type == 'image' ? (
                                <Image style={styles.messageImage} source={{ uri: comment.content }} />
                            ) : comment.type == 'video' && (
                                <Video
                                    source={{ uri: comment.content }}
                                    style={styles.messageVideo}
                                    controls={true}
                                    resizeMode="contain"
                                />
                            )
                        }
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
                                    comment_reactions.map((reaction, index) => (
                                        <View key={index} style={styles.reactionButton}>
                                            <Text style={styles.reactionText}>
                                                {reaction.ID_reaction.icon}
                                            </Text>
                                        </View>
                                    ))}
                            </View>
                        </TouchableOpacity>
                    </View>
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
                </View>
            </View >

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

            {/* Chỉ hiển thị reply cấp 1, không thụt tiếp vào nữa */}
            {/* <FlatList
                data={replys}
                renderItem={({ item }) => (
                    <View style={styles.replyContainer}>
                        <View style={styles.threadLine} />
                        <ListCommentReply comment={item} onReply={(e) => onReply(e)} isReply={true} />
                    </View>
                )}
                keyExtractor={item => item._id}
                extraData={replys}
            /> */}
            <FlatList
                data={replys}
                renderItem={renderReply}
                keyExtractor={(item) => item._id.toString()}
                getItemLayout={(data, index) => ({ length: 70, offset: 70 * index, index })}
            />
        </View >
    );
});

export default ListComment;

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    container: {
        marginVertical: 10,
        flex: 1,
        marginTop: 10,
        marginHorizontal: 20
    },
    boxInteract: {
        marginLeft: width * 0.05,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 170,
        gap: 10
    },
    boxContent: {
        marginLeft: 15,
        padding: 10,
        backgroundColor: '#d9d9d990',
        borderRadius: 20,
        paddingLeft: 15,
        // maxWidth: '85%',
        // flexShrink: 1,
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5,
        color: 'black'
    },
    commentText: {
        lineHeight: 22,
        color: 'black'
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 5,
    },
    messageVideo: {
        width: 250,
        height: 250,
        borderRadius: 5,
    },
    replyContainer: {
        flexDirection: 'row',
        paddingLeft: 20, // Chỉ thụt vào 1 lần cho reply
        position: 'relative',
    },
    threadLine: {
        position: 'absolute',
        left: 10,
        top: 10,
        bottom: 10,
        width: 2,
        backgroundColor: 'gray',
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
        alignSelf: 'flex-end',
    },
});
