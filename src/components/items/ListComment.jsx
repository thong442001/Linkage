import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ListComment = (props) => {
    const { comment } = props
    return (
        <View style={[styles.container]}>
            <View style={{ flexDirection: 'row', marginHorizontal: 5, }}>
                <Image style={styles.avatar} source={{ uri: comment.avatar }} />
                <View>
                    <View style={styles.boxContent}>
                        <Text style={styles.name} >{comment.name}</Text>
                        <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                    <View style={styles.boxInteract}>
                        <Text>{comment.time}</Text>
                        <Text>Thích</Text>
                        <Text>Phản hồi</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ListComment

const styles = StyleSheet.create({
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    container: {
        flexDirection: 'row',
        // marginHorizontal: 20,
        marginVertical: 10,
        flex: 1,
        marginTop: 10,
    },
    boxInteract: {
        marginLeft: 30,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 170,
    },
    boxContent: {
        marginLeft: 15,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingLeft: 15,
        maxWidth: '85%', // Đảm bảo comment không quá dài
        flexShrink: 1,  // Giúp text không tràn khỏi View
    },
    name: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 5,
    },
    commentText: {
        lineHeight: 22, // Tăng khoảng cách giữa các dòng
    }
})