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
    },
    friendNumber: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    btnAddStory: {
        flexDirection: "row",
        backgroundColor: '#0064E0',
        borderRadius: 8,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnAddStory2: {
        flexDirection: 'row',
        backgroundColor: '#BEBEBE',
        borderRadius: 8,
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textAddStory: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 11,
        marginLeft: 5
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
    btnEdit2: {
        backgroundColor: '#0064E0',
        borderRadius: 8,
        flex: 4,
        alignItems: 'center',
    },
    textEdit: {
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 11,
        color: "#FFFFFF"
    },
    textEdit2: {
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 11,
        color: "black"
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
        fontWeight: "bold"
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
    }
})

export default ProfileS

