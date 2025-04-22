import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window');
const CommentS = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        top: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareBottomSheetContainer: {
        backgroundColor: 'white',
        padding: 15,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    shareButton: {
        backgroundColor: '#0064E0',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    shareButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
        // borderRadius: 7,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.25,
        // shadowRadius: 3.84,
        // elevation: 5, // Dành cho Android
    },
    header2: {
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
        // marginLeft: width * 0.01,
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
        fontWeight: 'bold',
        color: 'black',
        width: width * 0.6
    },
    caption: {
        marginBottom: height * 0.015,
        fontSize: width * 0.045, // 3.5% chiều rộng màn hình
        color: 'black',
        marginLeft: width * 0.04
    },
    captionShare: {
        marginBottom: height * 0.015,
        fontSize: width * 0.045, // 3.5% chiều rộng màn hình
        color: 'black',
        // marginLeft: width * 0.04
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
        alignSelf: 'flex-end'
    },
    // reaction of post
    vReactionsOfPost: {
        flexDirection: 'row',
        width: '100%',
        height: 20,
        paddingHorizontal: 10,
        justifyContent: 'space-between'
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
        // marginRight: 12,
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
        marginLeft: width * 0.03
    },
    box: {
        backgroundColor: "#D9d9d9",
    },
    boxIcons: {
        flexDirection: 'row',
    },
    post: {
        marginHorizontal: width * 0.05, // 5% chiều rộng màn hình
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avata: {
        width: width * 0.11, // 11% chiều rộng màn hình
        height: width * 0.11,
        borderRadius: width * 0.25, // Bo tròn ảnh đại diện
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: width * 0.045, // 4% chiều rộng màn hình
        fontWeight: '500',
        color: 'black',
        width: width * 0.5
    },
    title: {
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.02,
    },
    title1: {
    },
    boxInteract: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: height * 0.015,
    },
    boxIcons2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxIcons3: {
        marginRight: width * 0.025,
    },
    boxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        backgroundColor: "#d9d9d9",
        borderRadius: width * 0.05,
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.012,
        padding: width * 0.025,
        // width: width * 0.75,
        flex: 1
    },
    line: {
        height: 0.2,
        width: '100%',
        backgroundColor: '#d9d9d9d9',
    },
    boxInputText: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: "100%"
    },
    // 🌟 Media (Hình ảnh & Video)
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
        padding: 5,
    },
    tripleMediaFirst: {
        width: '100%',
        height: height * 0.33, // 33% chiều cao màn hình
        padding: 5,
    },
    tripleMediaSecond: {
        width: '49.5%',
        height: height * 0.2, // 20% chiều cao màn hình
        padding: 5,
    },
    quadMedia: {
        width: '49%',
        height: height * 0.2,
        padding: 5,
    },
    fivePlusMediaFirstRow: {
        width: '49.5%',
        height: height * 0.2,
        padding: 5,
    },
    fivePlusMediaSecondRowLeft: {
        width: '32.66%',
        height: height * 0.3,
        padding: 5,
    },
    fivePlusMediaSecondRowMiddle: {
        width: '32.66%',
        height: height * 0.3,
        padding: 5,
    },
    fivePlusMediaSecondRowRight: {
        width: '32.66%',
        height: height * 0.3,
        padding: 5,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    videoWrapper: {
        position: 'relative',
        width: '90%',
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
    sendButton: {
        // marginRight: 20,
        // backgroundColor: '#007bff',
        // padding: 10,
        // borderRadius: 20,
    },
    //reply
    replyPreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderColor: '#d9d9d9d9',
        paddingVertical: height * 0.01,
        paddingHorizontal: width * 0.02,
    },
    replyTitle: {
        color: 'black',
    },
    replyContent: {
        color: 'black',
    },
    replyRight: {
        alignItems: 'flex-end',
    },
    //input comment 
    boxComment: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: width * 0.04,
    },
    boxCommentAll: {
        backgroundColor: 'white', // Đảm bảo có màu nền để bóng hiển thị rõ
        borderRadius: 6, // Nếu muốn bo góc
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3.84,
        elevation: 20, // Dành cho Android
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
    // chi tiet anh
    mediaItemDetail: {
        width: "100%",
        height: 300, // Đặt chiều cao cố định hoặc dùng "auto" nếu muốn theo tỷ lệ
        marginBottom: 10, // Khoảng cách giữa các ảnh
    },
    imageDetail: {
        width: "100%",
        height: "100%",
        // borderRadius: 10, // Bo góc nhẹ
    },
    videoWrapperDetail: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    videoDetail: {
        width: "100%",
        height: "100%",
        // borderRadius: 10,
    },
    playButtonDetail: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -20 }, { translateY: -20 }],
    },
    overlayDetail: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    overlayTextDetail: {
        color: "white",
        fontSize: 24,
        fontWeight: "bold",
    },
    boxInfor1: {
        marginHorizontal: width * 0.05,
        marginTop: height * 0.02
    },
    removeButton: {
        position: 'absolute',
        top: 3,
        right: 10,
        borderRadius: 12,
        padding: 2,
        zIndex: 1, // Đảm bảo nút nằm trên media
    },
});


export default CommentS
