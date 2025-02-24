import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import { Modal } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {
    addPost,
} from '../../rtk/API';

const PostItem = ({ post }) => {
    // time 
    const [timeAgo, setTimeAgo] = useState(post.createdAt);
    //const [isDeleted, setisDeleted] = useState(post._destroy || false);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useDispatch();

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
    // console.log('Post ne', post._destroy)

    // const handleDeletePost = async () => {
    //     try {
    //         const paramsAPI = {
    //             _destroy: true,
    //         };

    //         console.log("Xóa bài viết với params:", paramsAPI);

    //         await dispatch(addPost({ id: post._id, data: paramsAPI })) // Gửi yêu cầu cập nhật bài viết
    //             .unwrap()
    //             .then((response) => {
    //                 console.log("Xóa thành công:", response);
    //                 //setisDeleted(true); // Cập nhật UI để ẩn bài viết
    //                 setModalVisible(false); // Đóng modal
    //             })
    //             .catch((error) => {
    //                 console.log("Lỗi khi xóa bài viết:", error);
    //             });
    //     } catch (error) {
    //         console.log("Lỗi trong handleDeletePost:", error);
    //     }
    // };


    return (
        <View style={styles.postContainer}>
            <View style={styles.header}>
                <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                <View style={styles.userInfo}>
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

                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Icon name="ellipsis-horizontal" size={22} color="black" />
                </TouchableOpacity>


                {/* Modal hiển thị lựa chọn */}
                <Modal
                    transparent={true}
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <TouchableOpacity style={styles.overlay} onPress={() => setModalVisible(false)}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                            // onPress={handleDeletePost}
                            >
                                <Text style={styles.deleteText}>🗑️ Xóa bài viết</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {hasCaption && <Text style={styles.caption}>{post?.caption}</Text>}
            {hasMedia && renderMediaGrid(post?.medias)}

            <View style={styles.interactions}>
                <TouchableOpacity style={styles.action}>
                    <Icon2 name="like" size={25} color="black" />
                    <Text style={styles.actionText}>Thích</Text>
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
        </View>
    );
};

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: '#fff',
        padding: 10,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 50,
    },
    userInfo: {
        flex: 1,
        marginLeft: 0,
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 11,
        marginRight: 4,
        color: 'grey'
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    caption: {
        marginBottom: 10,
        fontSize: 14,
        color: 'black'
    },
    mediaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    singleMedia: {
        width: '100%',
        height: 300,
    },
    doubleMedia: {
        width: '49.5%',
        height: 300,
        padding: 1
    },
    tripleMediaFirst: {
        width: '100%',
        height: 250,
        padding: 1
    },
    tripleMediaSecond: {
        width: '49.5%',
        height: 150,
        padding: 1
    },
    quadMedia: {
        width: '49.5%',
        height: 150,
        padding: 1
    },
    fivePlusMediaFirstRow: {
        width: '49.5%',
        height: 150,
        padding: 1
    },
    fivePlusMediaSecondRowLeft: {
        width: '32.66%',
        height: 150,
        padding: 1
    },
    fivePlusMediaSecondRowMiddle: {
        width: '32.66%',
        height: 150,
        padding: 1
    },
    fivePlusMediaSecondRowRight: {
        width: '32.66%',
        height: 150,
        padding: 1
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoWrapper: {
        position: 'relative',
        width: '100%',
        height: '100%',
        // borderRadius: 8,
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
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // borderRadius: 8,
    },
    overlayText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    interactions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
    },
    action: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        marginLeft: 5,
        fontSize: 14,
        color: 'black'
    },
    modalContent: { backgroundColor: "blue", padding: 15, borderRadius: 10, width: 200, alignItems: "center", opacity: 0.9 },
    deleteText: { color: "red", fontSize: 16, fontWeight: "bold", padding: 10 },
});

export default PostItem;