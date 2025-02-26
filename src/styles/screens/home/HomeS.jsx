import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const HomeS = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#DEDEDE"
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: height * 0.01,
        marginHorizontal: width * 0.05,
    },
    box: {
        backgroundColor: "#fff",
        marginBottom: height * 0.005
    },
    box1: {
        backgroundColor: "#fff",
    },
    title: {
        fontSize: width * 0.07, // Thay đổi kích thước chữ theo chiều rộng
        color: "#0064E0",
        fontWeight: "bold",
    },
    icons: {
        alignItems: "center",
        flexDirection: 'row'
    },
    iconsPadding: {
        paddingLeft: width * 0.05
    },
    iconsPadding2: {
        paddingLeft: width * 0.04,
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
        marginVertical: height * 0.01,
        marginHorizontal: width * 0.05,
    },
    image: {
        marginRight: width * 0.02,
        width: width * 0.11,
        height: width * 0.11,
        borderRadius: width * 0.11 / 2,
        borderWidth: 1,
        borderColor: '#D9D9D9',
    },
    textInput: {
        flex: 1,
        borderColor: '#D9D9D9',
        borderRadius: width * 0.07,
        borderWidth: 1,
        height: height * 0.06,
        padding: width * 0.03
    },
    story: {
        flexDirection: 'row',
        marginVertical: height * 0.012,
    },
    imageStory: {
        width: width * 0.3,
        height: height * 0.25,
        borderRadius: width * 0.025,
    },
    backGround: {
        backgroundColor: '#fff',
        height: height * 0.07,
        width: "100%",
        position: 'absolute',
        bottom: -0.1,
        borderBottomLeftRadius: width * 0.025,
        borderBottomRightRadius: width * 0.025,
        alignItems: 'center',
    },
    boxStory: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: width * 0.03,
        height: "auto"
    },
    addStory: {
        borderWidth: 1,
        borderColor: '#fff',
        backgroundColor: '#fff',
        borderRadius: width * 0.12,
        position: 'absolute',
        top: -height * 0.02
    },
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});

export default HomeS;
