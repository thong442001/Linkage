import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    
    contactList:{
        marginHorizontal: -10,
        },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1C2526', // Màu nền tối giống trong hình
      },
      shareButton:{
        backgroundColor: '#0064E0',
        marginHorizontal: 10,
        marginVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      rectangle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      },
      lineBottomSheet: {
        width: 40,
        height: 5,
        backgroundColor: 'black',
        borderRadius: 5,
      },
      avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
      },
      boxStatus: {
        marginTop: 5,
      },
      btnStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
      },
      txtPublic: {
        color: 'white',
        fontSize: 14,
      },
      contentShare: {
        flex: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 16,
        minHeight: 50,
      },
      shareButton: {
        marginVertical: 15,
        paddingHorizontal: 13,
        backgroundColor: '#0064E0',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
      },
      shareButtonText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '500',
      },
      copyLinkButton: {
        padding: 10,
        backgroundColor: '#444',
        borderRadius: 10,
        alignItems: 'center',
      },
      copyLinkText: {
        color: 'white',
        fontSize: 16,
      },
      // Style cho phần Gửi bằng Messenger
      sectionContainer: {
        marginVertical: 10,
        width: width * 0.9,
      },
      sectionTitle: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
      },
      contactList: {
        marginHorizontal: 10,
        flexGrow: 0,
      },
      contactItem: {
        alignItems: 'center',
        marginRight: 15,
      },
      contactAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
      },
      contactName: {
        color: 'black',
        fontSize: 12,
        textAlign: 'center',
      },
      // Style cho phần Chia sẻ lên
      shareOptionList: {
        flexGrow: 0,
      },
      shareOptionItem: {
        alignItems: 'center',
        marginRight: 15,
      },
      shareOptionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginBottom: 5,
        backgroundColor: '#333', // Placeholder nếu không có hình
      },
      shareOptionText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
      },
      // Style cho nút "Chia sẻ" trong action (TouchableOpacity bên dưới)
      action: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
      },
      actionText: {
        marginLeft: 5,
        color: 'black',
        fontSize: 16,
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
        fontSize: width * 0.04, // 4% chiều rộng màn hình
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

export default styles;