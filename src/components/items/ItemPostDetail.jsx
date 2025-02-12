import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/FontAwesome5'
import { useBottomSheet } from '../../context/BottomSheetContext';
const ItemPostDetail = (props) => {
    const { post } = props
    const { openBottomSheet } = useBottomSheet();
    return (
        <View style={styles.container}>
            <View>
                <View style={styles.boxInfor}>
                    <View style={styles.boxInfor2}>
                        <Image style={styles.avatar} source={require('../../../assets/images/person.jpg')} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>{post.name}</Text>
                            <View style={styles.boxName}>
                                <Text style={styles.time}>{post.time}</Text>
                                <Icon name="earth" size={15} color="gray" />
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 15 }}>
                        <Text>{post.title}</Text>
                    </View>
                </View>
                <Image style={{ width: '100%', height: 300 }} source={{ uri: post.image[0] }} />
                <View style={styles.boxInteract}>
                    <View style={styles.boxIcons2}>
                        <View style={styles.boxIcons3}>
                            <Icon2 name="like" size={25} color="black" />
                        </View>
                        <Text>Thích</Text>
                    </View>
                    <View style={styles.boxIcons2}>
                        <TouchableOpacity onPress={() => { console.log("Mở BottomSheet..."), openBottomSheet(100, <Text>Bình luận</Text>) }} style={{ flexDirection: "row" }}>
                            <View style={styles.boxIcons3}>
                                <Icon3 name="comment" size={20} color="black" />
                            </View>
                            <Text>Bình luận</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boxIcons2}>
                        <View style={styles.boxIcons3}>
                            <Icon4 name="share-alt" size={20} color="black" />
                        </View>
                        <Text>Chia sẻ</Text>
                    </View>
                </View>
                <View style={styles.line}></View>
                <Image style={{ width: '100%', height: 300 }} source={{ uri: post.image[0] }} />
                <View style={styles.boxInteract}>
                    <View style={styles.boxIcons2}>
                        <View style={styles.boxIcons3}>
                            <Icon2 name="like" size={25} color="black" />
                        </View>
                        <Text>Thích</Text>
                    </View>
                    <View style={styles.boxIcons2}>
                        <TouchableOpacity onPress={() => { console.log("Mở BottomSheet..."), openBottomSheet(100, <Text>Bình luận</Text>) }} style={{ flexDirection: "row" }}>
                            <View style={styles.boxIcons3}>
                                <Icon3 name="comment" size={20} color="black" />
                            </View>
                            <Text>Bình luận</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.boxIcons2}>
                        <View style={styles.boxIcons3}>
                            <Icon4 name="share-alt" size={20} color="black" />
                        </View>
                        <Text>Chia sẻ</Text>
                    </View>
                </View>
                <View style={styles.line}></View>
            </View>
        </View>
    )
}

export default ItemPostDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    boxInfor: {
        marginHorizontal: 20,
        marginVertical: 20,
    },
    boxInfor2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    time: {
        fontSize: 11,
        marginRight: 4,
    },
    boxInteract: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 25,
    },
    boxIcons2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxIcons3: {
        marginRight: 10
    },
    line: {
        height: 5,
        width: '100%',
        backgroundColor: '#A1A6AD',
    },
})