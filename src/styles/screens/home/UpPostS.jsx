import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UpPostS = StyleSheet.create({
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
        color: 'black'
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
    // model
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
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
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
    }
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
})

export default UpPostS

