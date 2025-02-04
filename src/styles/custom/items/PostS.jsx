import { StyleSheet } from 'react-native'

const PostS = StyleSheet.create({
    container: {
        marginBottom: 30,
        borderRadius: 5,
        padding: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: 'center'
    },
    avata: {
        width: 40,
        height: 40,
        borderRadius: 90,
        marginRight: 10
    },
    fontDate: {
        fontSize: 10
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    image: {
        width: 'auto',
        height: 200,
        borderRadius: 10,
        marginTop: 10
    },
    body: {
        marginTop: 13
    },
    title: {
        marginLeft: 10,
        color: 'black'
    },
    interact: {
        flexDirection: 'row',
        marginTop: 20,
    },
    h2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    heartContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    heartAnimation: {
        position: 'absolute',
        zIndex: 10,
    }
})

export default PostS
