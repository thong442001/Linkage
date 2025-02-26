import { Dimensions, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window')
const ProfileS = StyleSheet.create({
    anhBia: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e4e2de',
        padding: height * 0.008,
        borderRadius: height * 0.03,
        marginHorizontal: width * 0.02,
        width: height * 0.05,
        height: height * 0.05,
    },
    containerBottomSheet: {
        backgroundColor: "#D9D9D9",
        borderTopLeftRadius: width * 0.2,
        borderTopRightRadius: width * 0.2,
        paddingVertical: width * 0.05,
        paddingHorizontal: width * 0.05,
    },
    rectangle: {
        alignItems: "center",
        marginBottom: width * 0.01,
    },
    lineBottomSheet: {
        width: width * 0.15,
        height: height * 0.006,
        backgroundColor: "#fff",
        borderRadius: width * 0.1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: width * 0.03,
        borderBottomColor: "#eee",
    },
    optionText: {
        fontSize: height * 0.02,
        fontWeight: "500",
    },
    container1: {
        flex: 1,
        backgroundColor: "#A1A6AD"
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.014,
    },
    titleName: {
        fontSize: height * 0.025,
        fontWeight: 'bold',
        color: 'black'
    },
    boxHeader: {
        backgroundColor: "#fff",
    },
    backGroundImage: {
        height: height * 0.22,
        width: '100%',
    },
    avata: {
        width: height * 0.17,
        height: height * 0.17,
        borderRadius: height * 0.085,
        borderColor: '#fff',
        borderWidth: 2,
        position: 'absolute',
        bottom: -height * 0.085,
        left: width * 0.05,
    },
    avatarWithStory: {
        borderColor: "#0064E0", // Nếu có stories thì viền xanh
        borderWidth: 5,
    },
    boxBackground: {
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.03,
        marginTop: "20%",

    },
    boxInformation: {
        flexDirection: 'row',
    },
    name: {
        fontSize: height * 0.03,
        fontWeight: 'bold',
        color: 'black'
    },
    friendNumber: {
        fontSize: height * 0.016,
        fontWeight: 'bold',
    },
    btnAddStory: {
        backgroundColor: '#0064E0',
        borderRadius: height * 0.01,
        marginVertical: height * 0.013,
    },
    textAddStory: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: height * 0.014,
    },
    boxEdit: {
        borderRadius: height * 0.01,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnEdit: {
        backgroundColor: '#D9D9D9',
        borderRadius: height * 0.01,
        flex: 4,
        alignItems: 'center',
    },
    textEdit: {
        fontSize: height * 0.016,
        fontWeight: 'bold',
        marginVertical: height * 0.015,
        color: 'gray'
    },
    btnMore: {
        backgroundColor: '#D9D9D9',
        borderRadius: height * 0.01,
        flex: 1,
        alignItems: 'center',
        padding: height * 0.01,
        marginLeft: width * 0.03,
    },
    boxFriends: {
        marginHorizontal: width * 0.05,
    },
    title: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: height * 0.02
    },
    textFriendNumber2: {
        fontSize: width * 0.03, // Tỷ lệ theo chiều rộng
        color: "#BEBEBE",
        fontWeight: "bold"
    },
    textFriend: {
        fontSize: width * 0.04,
        fontWeight: "bold",
        color: 'black'
    },
    textSeeAll: {
        color: "#0064E099"
    },
    listFriends: {
        alignItems: "center",
        marginVertical: height * 0.02,
    },
    boxLive: {
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.02
    },
    avataStatus: {
        width: width * 0.1,
        height: width * 0.1,
        borderRadius: width * 0.5, // Làm tròn dựa trên kích thước avatar
    },
    boxAllThink: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: height * 0.01
    },
    boxThink: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxLivestream: {
        paddingVertical: height * 0.02,
        backgroundColor: '#D9D9D999',
        marginVertical: height * 0.015
    },
    btnLivestream: {
        marginHorizontal: width * 0.05,
        backgroundColor: "#FFFFFF",
        width: width * 0.35,
        height: height * 0.05,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: width * 0.04,
    },
    boxManange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnManage: {
        backgroundColor: '#D9D9D9',
        marginHorizontal: width * 0.05,
        paddingVertical: height * 0.015,
        borderRadius: width * 0.02,
        marginBottom: height * 0.015
    },
    // Modal styles
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        borderRadius: width * 0.04,
        width: width * 0.9,
        height: height * 0.25,
        alignItems: 'center',
        backgroundColor: '#FFFF',
        justifyContent: 'space-evenly',
    },
    btnXacNhan: {
        width: width * 0.4,
        height: height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0064E0',
        borderRadius: width * 0.08,
    },
    btnXoa: {
        width: width * 0.4,
        height: height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A6A6A6',
        borderRadius: width * 0.08,
    },
    text_button: {
        fontSize: width * 0.04,
        color: 'white',
        fontWeight: '600',
    },
    viewImagePick: {
        alignItems: 'flex-end'
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.8)',
    },
    fullImage: {
        width: '100%',
        height: '80%',
    },
    closeButton: {
        position: 'absolute',
        bottom: height * 0.05,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.015,
        borderRadius: width * 0.02,
    },
    closeButtonText: {
        color: '#000',
        fontSize: width * 0.04,
        fontWeight: 'bold',
    },
})

export default ProfileS

