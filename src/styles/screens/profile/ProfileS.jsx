import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProfileS = StyleSheet.create({
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
        marginHorizontal: 20,
        marginVertical: 11,
    },
    titleName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black'
    },
    boxHeader: {
        backgroundColor: "#fff",
    },
    backGroundImage: {
        height: 170,
        width: '100%',
    },
    avata: {
        width: 136,
        height: 136,
        borderRadius: 320,
        borderColor: '#fff',
        borderWidth: 2,
        position: 'absolute',
        bottom: -68,
        left: 20,
    },
    boxBackground: {
        marginHorizontal: 20,
        marginVertical: 20,
        marginTop: "20%",

    },
    boxInformation: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color:'black'
    },
    friendNumber: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    btnAddStory: {
        backgroundColor: '#0064E0',
        borderRadius: 8,
        marginVertical: 10,
    },
    textAddStory: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 11,
    },
    boxEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnEdit: {
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        flex: 4,
        alignItems: 'center',
    },
    textEdit: {
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 11,
        color:'gray'
    },
    btnMore: {
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        padding: 8,
        marginLeft: 13,
    },
    boxFriends: {
        marginHorizontal: 20
    },
    title: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 14
    },
    textFriendNumber2: {
        fontSize: 12,
        color: "#BEBEBE",
        fontWeight: "bold"
    },
    textFriend: {
        fontSize: 16,
        fontWeight: "bold",
        color:'black'
    },
    textSeeAll: {
        color: "#0064E099"
    },
    listFriends: {
        alignItems: "center",
        marginVertical: 19,
    },
    boxLive: {
        marginHorizontal: 20,
        marginVertical: 15
    },
    avataStatus: {
        width: 40,
        height: 40,
        borderRadius: 180,

    },
    boxAllThink: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
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
        paddingVertical: 17,
        backgroundColor: '#D9D9D999',
        marginVertical: 10
    },
    btnLivestream: {
        marginHorizontal: 20,
        backgroundColor: "#FFFFFF",
        width: 130,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    boxManange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnManage: {
        backgroundColor: '#D9D9D9',
        marginHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    //modal
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        borderRadius: 14,
        width: 336,
        height: 194,
        alignItems: 'center',
        backgroundColor: '#FFFF',
        justifyContent: 'space-evenly',
    },
    btnXacNhan: {
        width: 140,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0064E0',
        borderRadius: 30,
    },
    btnXoa: {
        width: 140,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A6A6A6',
        borderRadius: 30,
    },
    text_button: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600',
    },
    viewImagePick: {
        flexDirection: 'row',
        backgroundColor: 'lightblue', 
        position: 'relative', 
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    imageIcon: {
        position: 'absolute', 
        bottom: 10,  
        right: 10,  
        color: '#fff', 
    }
})

export default ProfileS

