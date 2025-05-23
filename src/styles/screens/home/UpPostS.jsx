import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window');

const UpPostS = StyleSheet.create({
    search:{
        flexDirection:'row',
        alignItems: 'center',
        backgroundColor:'#E4E4E4',
        paddingHorizontal:10,
        borderRadius:20,
        width:'60%',

    },
    loadingContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -50 }, { translateY: -50 }],
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    loadingText: {
        color: 'white',
        marginTop: 10,
    },
    Container: {
        flex: 1,
        backgroundColor: 'white'
    },
    Header: {
        marginHorizontal: 20,
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    boxBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    txtCreate: {
        fontSize: 20,
        marginLeft: 10,
        color: 'black'
    },
    btnPost: {
        backgroundColor: '#D9D9D9',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    btnPost2: {
        backgroundColor: '#0064E0',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    txtUpPost: {
        color: 'gray',
        fontSize: 15
    },
    txtUpPost2: {
        color: 'white',
        fontSize: 15
    },

    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'gray',
    },
    line1: {
        width: 0.5,  // Đặt width nhỏ để làm đường dọc
        height: '40%', // Chiều cao bằng với parent
        backgroundColor: 'black',
        marginHorizontal: 10 // Cách lề một chút nếu cần
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50
    },
    boxMargin: {
        marginHorizontal: 20,
        marginVertical: 20
    },
    boxInfor: {
        flexDirection: 'row',
    },
    txtName: {
        fontSize: 19,
        fontWeight: 'bold',
        color: 'black',
        width: width * 0.7
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
    txtInput: {
        fontSize: 23,
        marginTop: 10,
        color: 'black',
    },
    boxItems: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10
    },
    boxItems2: {
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    btnIcon: {
        paddingVertical: 5
    },
    txtIcon: {
        fontSize: 15,
        marginLeft: 10,
        color: 'black'
    },
    // modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    optionButton: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingBottom: 10
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    // medias
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
    BoxInter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderBottomColor: 'white',
        borderTopColor: '#000f0d40',

    },
    BoxInter1: {
        flexDirection: 'column'
    },
    // interactions: {
    //     flexDirection: 'row',
    //     justifyContent: 'space-around',
    //     marginTop: 10,
    //     paddingTop: 10,
    //     borderTopWidth: 0.5,
    //     borderTopColor: '#ddd',
    // },
    // action: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    // },
    // actionText: {
    //     marginLeft: 5,
    //     fontSize: 14,
    // },
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
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 10
    },
    modalContainerTag: {
        width: width * 0.79,
        height: height * 0.6,
        backgroundColor: "white", // Modal giữ nguyên màu trắng
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
    },

    avatar: {
        width: width * 0.11, // 11% chiều rộng màn hình
        height: width * 0.11,
        borderRadius: width * 0.25, // Bo tròn ảnh đại diện
    },
    name: {
        color: 'black'
    },
    tag: {
        // color: '#0064E0'
        color: 'white',
        fontSize: 15
    },
    btnTag: {
        backgroundColor: "#0064E0",
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    boxTag: {
        // backgroundColor: '#0064E0',
        alignSelf: 'flex-end',
        flexDirection:'row',
        marginBottom: 20,
        justifyContent:'space-between',
        width:'100%',
    }
})

export default UpPostS

