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
        marginLeft: 10
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
        fontWeight: 'bold'
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
        marginTop: 10
    },
    boxItems: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 10
    },
    boxItems2: {
    },
    btnIcon:{
        paddingVertical: 5
    },
    txtIcon:{
        fontSize: 15,
        marginLeft: 10
    }
})

export default UpPostS

