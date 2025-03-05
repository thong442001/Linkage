import {
    Image,
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    TouchableOpacity,
} from 'react-native'
import React, { useState, useEffect } from 'react';
import ListCommentReply from './ListCommentReply';

const { width, height } = Dimensions.get('window');
import Video from 'react-native-video';

const ListComment = (props) => {
    const { comment, onReply } = props;
    const [replys, setrReplys] = useState(comment.replys || []);
    const [timeAgo, setTimeAgo] = useState(comment.createdAt);

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
                    </View>
                    <View style={styles.boxInteract}>
                        <Text style={{ color: "black" }}>{timeAgo}</Text>
                        <Text style={{ color: "black" }}>Thích</Text>
                        <TouchableOpacity onPress={() => onReply(comment)}>
                            <Text style={{ color: "black" }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

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
                renderItem={({ item }) => (
                    <ListCommentReply comment={item} onReply={(e) => onReply(e)} isReply={true} level={1} />
                )}
                keyExtractor={item => item._id}
            />
        </View>
    );
}

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
});
