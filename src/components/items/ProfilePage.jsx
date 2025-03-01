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
    TextInput,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/AntDesign';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useSelector, useDispatch } from 'react-redux';
const { width, height } = Dimensions.get('window');
import {
    addPost_Reaction, // thả biểu cảm
} from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
const PostItem = ({
    post,
    ID_user,
    onDelete = () => { },
    onDeleteVinhVien = () => { },
    updatePostReaction = () => { },
}) => {
    const navigation = useNavigation();
    const me = useSelector(state => state.app.user)
    const reactions = useSelector(state => state.app.reactions)
    const dispatch = useDispatch();
    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    //console.log(post.post_reactions)

    // time 
    const [timeAgo, setTimeAgo] = useState(post.createdAt);

    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);

    // trang thai
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: "Công khai"
    });
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

    console.log(post.tags)
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
        console.log("Profile page>>>>>>>>>>", post.tags)
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
        // const interval = setInterval(updateDiff, 1000);

        // return () => clearInterval(interval);
    }, []);

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
                        {/* <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text> */}
                        <Text style={styles.name}>
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
                            15,
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
                                    style={{ color: 'black' }}
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
                        {userReaction ? userReaction.ID_reaction.icon : <Icon2 name="like2" size={20} color="black" />} {/* Nếu đã react, hiển thị icon đó */}
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
                <TouchableOpacity style={styles.action} onPress={() => handleShare()}>
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
                                    />
                                    <View style={{ backgroundColor: "#0064E0", borderRadius: 10, alignItems: 'center' }}>
                                        <TouchableOpacity style={{ padding: 10 }}>
                                            <Text style={{ color: 'white' }}>Chia sẻ ngay</Text>
                                        </TouchableOpacity>
                                    </View>
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
                                    onPress={() => handleSelectOption(option)}  // Khi người dùng chọn một tùy chọn, hàm này sẽ được gọi để cập nhật trạng thái và đóng modal.
                                >
                                    {/* // Hiển thị tên của tùy chọn. */}
                                    <Text style={styles.optionText}>{option.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
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
        width: width * 0.6
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
        marginVertical: 10
    }
});

export default PostItem;