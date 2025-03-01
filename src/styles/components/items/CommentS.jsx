import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
const { width, height } = Dimensions.get('window');
const CommentS = StyleSheet.create({
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
    time: {
        fontSize: width * 0.028, // 2.8% chiều rộng màn hình
        marginRight: width * 0.01,
    },
    name: {
        fontSize: width * 0.04, // 4% chiều rộng màn hình
        fontWeight: 'bold',
        color: 'black'
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
        marginVertical: height * 0.015,
        padding: width * 0.025,
    },
    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'gray',
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
});


export default CommentS
