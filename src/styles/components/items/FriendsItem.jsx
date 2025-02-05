import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding:  10
    },
    imgWrap: {
        width: '30%',
    },
    wrapper: {
        width: '70%',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 500,
        marginLeft: 5
    },
    info: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    name: {
        fontWeight: '600',
        fontSize: 16,
        color: 'white',
        marginLeft: 10,
    },
    mutualFriends: {
        color: 'gray',
        marginLeft: 10,
        marginTop: 10,
        fontWeight: '600',
    },
    sentTime: {
        color: '#888',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    acpButton: {
        // backgroundColor: '#0265ff',
        borderWidth: 2,
        borderRadius: 10,
        width: '46%',
        height: 35,
        marginLeft: 10,
        justifyContent: 'center',
    },
    acpTxt: {
        color: 'white',
        fontSize: 15,
        fontWeight: '600',
        textAlign: 'center',
    },
    delButton: {
        backgroundColor: '#393d3e',
        width: '46%',
        borderRadius: 10,
        justifyContent: 'center',
    },
    delTxt: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default styles;