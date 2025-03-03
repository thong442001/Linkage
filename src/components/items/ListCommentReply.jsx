import { Image, StyleSheet, Text, View, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
const { width, height } = Dimensions.get('window');
import Video from 'react-native-video';
const ListCommentReply = (props) => {
    const { comment, onReply } = props
    const [replys, setrReplys] = useState(comment.replys || []);
    // time 
    const [timeAgo, setTimeAgo] = useState(comment.createdAt);
    useEffect(() => {
        const updateDiff = () => {
            const now = Date.now();
            const createdTime = new Date(comment.createdAt).getTime(); // Chuyển từ ISO sang timestamp

            if (isNaN(createdTime)) {
                setTimeAgo("Không xác định");
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

        };

        updateDiff();
        // const interval = setInterval(updateDiff, 1000);

        // return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setrReplys(comment.replys ? [...comment.replys] : []);
    }, [comment.replys]);

    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row', marginHorizontal: 5, }}>
                <Text style={{ color: 'black' }}>
                    {"------->   "}
                </Text>
                <Image style={styles.avatar} source={{ uri: comment.ID_user.avatar }} />
                <View>
                    <View style={styles.boxContent}>
                        <Text style={styles.name} >{comment.ID_user.first_name} {comment.ID_user.last_name}</Text>
                        {/* Nội dung tin nhắn chính */}
                        {
                            comment.type == 'text'
                                ? (
                                    <Text
                                        style={[
                                            styles.commentText,
                                        ]}>
                                        {comment.content}
                                    </Text>
                                ) : comment.type == 'image' ? (
                                    <Image
                                        style={[
                                            styles.messageImage,
                                        ]}
                                        source={{ uri: comment.content }}
                                    />
                                ) : (
                                    comment.type == 'video' && (
                                        <Video
                                            source={{ uri: comment.content }} // URL video
                                            style={[
                                                styles.messageVideo,
                                            ]}
                                            controls={true} // Hiển thị điều khiển video
                                            resizeMode="contain" // Cách hiển thị video
                                        />
                                    )
                                )
                        }
                    </View>
                    <View style={styles.boxInteract}>
                        <Text style={{ color: "black" }}>{timeAgo}</Text>
                        <Text style={{ color: "black" }}>Thích</Text>
                        <TouchableOpacity
                            onPress={() => onReply(comment)}

                        >
                            <Text style={{ color: "black" }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <FlatList
                data={comment.replys}
                renderItem={({ item }) =>
                    <ListCommentReply
                        comment={item}
                        onReply={(e) => onReply(e)}
                    />}
                keyExtractor={item => item._id}
            />
        </View>
    )
}

export default ListCommentReply

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    container: {
        //flexDirection: 'row',
        // marginHorizontal: 20,
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
        backgroundColor: '#d9d9d9',
        borderRadius: 10,
        paddingLeft: 15,
        maxWidth: '85%', // Đảm bảo comment không quá dài
        flexShrink: 1,  // Giúp text không tràn khỏi View
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5,
    },
    commentText: {
        lineHeight: 22, // Tăng khoảng cách giữa các dòng
    },
    //img
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 5,
    },
    //video
    messageVideo: {
        width: 250,
        height: 250,
        borderRadius: 5,
    },
})