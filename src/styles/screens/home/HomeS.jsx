import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const HomeS = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DEDEDE"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginHorizontal: 20,

    },
    box: {
        backgroundColor: "#fff",
        marginBottom: 4
    },
    box1: {
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        color: "#0064E0",
        fontWeight: "bold",
    },
    icons: {
        alignItems: "center",
        flexDirection: 'row'
    },
    iconsPadding: {
        paddingLeft: 21
    },
    iconsPadding2: {
        paddingLeft: 15,
    },
    line: {
        height: 0.5,
        width: '100%',
        backgroundColor: 'gray',
    },
    header2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
        marginHorizontal: 20,
    },
    image: {
        marginRight: 5,
        width: 42,
        height: 42,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    textInput: {
        flex: 1,
        borderColor: '#D9D9D9',
        borderRadius: 28,
        height: 42,
    },
    story: {
        flexDirection: 'row',
        // marginLeft: 20,
        marginVertical: 9,
    },
    post: {

    },
    imageStory: {
        width: 110,
        height: 170,
        borderRadius: 10,
    },
    backGround: {
        backgroundColor: '#fff',
        height: 57,
        width: "100%",
        position: 'absolute',
        bottom: -0.1,
        borderBottomLeftRadius: 9,
        borderBottomRightRadius: 9,
        alignItems: 'center',
    },
    boxStory: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 11,
    },
    addStory: {
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: 50,
        position: 'absolute',
        top: -15
    },
    logo:{
        flexDirection:'row',
        alignItems: 'center',
    }
})

export default HomeS

