import { Image, StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Video from 'react-native-video';

const { width } = Dimensions.get('window');

const ListCommentReply = ({ comment, onReply, level = 0 }) => {
    const [replys, setReplys] = useState(comment.replys || []);
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
        };

        updateDiff();
    }, []);

    useEffect(() => {
        setReplys(comment.replys ? [...comment.replys] : []);
    }, [comment.replys]);

    return (
        <View style={[styles.container, level > 0 && styles.replyContainer]}>
            <View style={{ flexDirection: 'row', paddingLeft: level === 1 ? 20 : 0 }}>
                <Image style={styles.avatar} source={{ uri: comment.ID_user.avatar }} />
                <View>
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
                    <View style={styles.boxInteract}>
                        <Text style={{ color: "black" }}>{timeAgo}</Text>
                        <Text style={{ color: "black" }}>Thích</Text>
                        <TouchableOpacity onPress={() => onReply(comment)}>
                            <Text style={{ color: "black" }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Chỉ thụt vào ở cấp 1, cấp cao hơn không thụt thêm */}
            <FlatList
                data={replys}
                renderItem={({ item }) => (
                    <ListCommentReply comment={item} onReply={onReply} level={1} />
                )}
                keyExtractor={item => item._id}
            />
        </View>
    );
};

export default ListCommentReply;

const styles = StyleSheet.create({
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 50,
    },
    container: {
        marginVertical: 10,
        flex: 1,
        marginHorizontal: 20
    },
    replyContainer: {
        position: 'relative',
    },
    boxInteract: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    boxContent: {
        marginLeft: 10,
        padding: 10,
        backgroundColor: '#d9d9d990',
        borderRadius: 20,
    },
    name: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: 'black',
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
});
