import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CommentS = StyleSheet.create({
    box: {
        backgroundColor: "#D9d9d9",
    },
    boxIcons: {
        flexDirection: 'row',
    },
    post: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avata: {
        width: 42,
        height: 42,
        borderRadius: 50,
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 11,
        marginRight: 4,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    title: {
        marginHorizontal: 20,
        marginVertical: 15,
    },
    boxInteract: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 18
    },
    boxIcons2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxIcons3: {
        marginRight: 10
    },
    boxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        backgroundColor: "#d9d9d9",
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 10
    },
    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'gray',
    },
    boxInputText:{
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: "100%"
    }
})


export default CommentS
