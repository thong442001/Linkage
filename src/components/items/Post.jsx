import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useMemo, useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/FontAwesome5'
import Icon5 from 'react-native-vector-icons/AntDesign'
import FBPhotoGrid from '@renzycode/react-native-fb-photo-grid';
import { useBottomSheet } from '../../context/BottomSheetContext';
import PostDetailS from '../../styles/screens/home/PostDetailS'
import { useNavigation } from '@react-navigation/native'
import ListComment from './ListComment'
const Post = (props) => {
    const navigation = useNavigation();
    const { post } = props
    const { openBottomSheet } = useBottomSheet();

    const dataComment = [
        {
            id: 1,
            name: 'Kenny',
            image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg',
            avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg',
            comment: 'Chúc mừng bạn',
            time: '1p'
        },
        {
            id: 2,
            name: 'Henry',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s',
            avatar: 'https://www.shutterstock.com/image-photo/handsome-indian-male-office-employee-260nw-2278702237.jpg',
            comment: 'Chúc mừng bạn',
            time: '1p'
        },
        {
            id: 3,
            name: 'John',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNXaVKjl0ywihdE-KRHXIA6nevtd2IksdVw&s',
            avatar: 'https://t3.ftcdn.net/jpg/02/35/92/68/360_F_235926813_VGqvkvucMfZ0T16NLwhkN9C8hUS0vbOH.jpg',
            comment: 'Tuyệt vời quá ',
            time: '1p'
        },
    ]

    const comment = () => {
        return (
            <View>
                <View style={[styles.boxHeader, { justifyContent: 'space-between', marginBottom: 10 }]}>
                    <View style={styles.boxHeader}>
                        <Icon5 name="like1" size={25} color="blue" />
                        <Text style={{ marginHorizontal: 10 }}> Bạn và 161 </Text>
                        <Icon name="chevron-forward" size={25} color="black" />
                    </View>
                    <Icon5 name="like1" size={25} color="blue" />
                </View>
                <FlatList
                    data={dataComment}
                    renderItem={({ item }) => <ListComment comment={item} />}
                    keyExtractor={item => item.id}
                />
            </View>
        )
    }

    return (
        <View style={[styles.box, { marginTop: 4 }]}>
            <View style={{ marginVertical: 18 }}>
                <View style={styles.post}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.avata} source={{ uri: post.avata }} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.name}>{post.name}</Text>
                            <View style={styles.boxName}>
                                <Text style={styles.time}>{post.time}</Text>
                                <Icon name="earth" size={12} color="gray" />
                            </View>
                        </View>
                    </View>
                    <View style={styles.boxIcons}>
                        <View style={{ marginRight: 10 }}>
                            <Icon name="ellipsis-horizontal" size={25} color="black" />
                        </View>
                        <Icon name="close" size={25} color="black" />
                    </View>
                </View>
                <View style={styles.title}>
                    <Text>{post.title}</Text>
                </View>
                {/* <Image style={{ width: '100%', height: 300 }} source={{ uri: post.image }} /> */}
                <FBPhotoGrid
                    height={300}
                    gutterColor="#fff"
                    photos={post.image}
                    gutterSize={1}
                    onTouchPhoto={() => { navigation.navigate("PostDetail", { post }) }}// truyền dữ liệu qua trang chi tiết bài post
                />
            </View>
            <View style={styles.boxInteract}>
                <View style={styles.boxIcons2}>
                    <View style={styles.boxIcons3}>
                        <Icon2 name="like" size={25} color="black" />
                    </View>
                    <Text>Thích</Text>
                </View>
                <View style={styles.boxIcons2}>
                    <TouchableOpacity onPress={() => { console.log("Mở BottomSheet..."), openBottomSheet(100, comment()) }} style={{ flexDirection: "row" }}>
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
        </View>
    )
}

export default Post

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#fff",
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
    }
})