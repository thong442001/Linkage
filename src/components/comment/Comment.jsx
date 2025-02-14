import { View, Text, Image, TouchableOpacity, FlatList, TextInput } from "react-native";
import { useState } from "react";
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/FontAwesome5'
import Icon5 from 'react-native-vector-icons/AntDesign'
import CommentS from "./CommentS";
import ListComment from "../items/ListComment";
import FBPhotoGrid from '@renzycode/react-native-fb-photo-grid';
import { useRoute } from "@react-navigation/native";
const Comment = (props) => {

    const route = useRoute();
    const post = route.params?.post || {}; // Lấy post từ navigation
    const { navigation } = props
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

    const header = () => {
        return (
            <View>
                <View style={{ marginVertical: 18 }}>
                    <View style={CommentS.post}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { navigation.goBack() }}>
                                <View style={{ marginRight: 10 }}>
                                    <Icon name="chevron-back-outline" size={25} color="black" />
                                </View>
                            </TouchableOpacity>
                            <Image style={CommentS.avata} source={{ uri: post.avata }} />
                            <View style={{ marginLeft: 20 }}>
                                <Text style={CommentS.name}>{post.name}</Text>
                                <View style={CommentS.boxName}>
                                    <Text style={CommentS.time}>{post.time}</Text>
                                    <Icon name="earth" size={12} color="gray" />
                                </View>
                            </View>
                        </View>
                        <View style={CommentS.boxIcons}>
                            <View style={{ marginRight: 10 }}>
                                <Icon name="ellipsis-horizontal" size={25} color="black" />
                            </View>
                        </View>
                    </View>
                    <View style={CommentS.title}>
                        <Text>{post.title}</Text>
                    </View>
                    <FBPhotoGrid
                        height={300}
                        gutterColor="#fff"
                        photos={Array.isArray(post.image) ? post.image : []} // Kiểm tra dữ liệu
                        gutterSize={1}
                        onTouchPhoto={() => { navigation.navigate("PostDetail", { post }) }}
                    />
                </View>
                <View style={[CommentS.boxInteract, { marginBottom: 30 }]}>
                    <View style={CommentS.boxIcons2}>
                        <View style={CommentS.boxIcons3}>
                            <Icon2 name="like" size={25} color="black" />
                        </View>
                        <Text>Thích</Text>
                    </View>
                    <View style={CommentS.boxIcons2}>
                        <TouchableOpacity onPress={() => { navigation.navigate("Comment", { post }) }} style={{ flexDirection: "row" }}>
                            <View style={CommentS.boxIcons3}>
                                <Icon3 name="comment" size={20} color="black" />
                            </View>
                            <Text>Bình luận</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[CommentS.boxIcons2,]}>
                        <View style={CommentS.boxIcons3}>
                            <Icon4 name="share-alt" size={20} color="black" />
                        </View>
                        <Text>Chia sẻ</Text>
                    </View>
                </View>
                <View style={[CommentS.line, {marginBottom: 20}]}></View>
                <View style={[CommentS.boxHeader, { justifyContent: 'space-between', marginBottom: 20, marginHorizontal: 20 }]}>
                    <View style={CommentS.boxHeader}>
                        <Icon5 name="like1" size={25} color="blue" />
                        <Text style={{ marginHorizontal: 10 }}>161 </Text>
                    </View>
                </View>

            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={dataComment}
                renderItem={({ item }) => <ListComment comment={item} />}
                keyExtractor={item => item.id}
                ListHeaderComponent={header}
                contentContainerStyle={{ paddingBottom: "17%" }}
            />
            <View style={CommentS.boxInputText}>
                <View style={CommentS.line}></View>
                <TextInput
                    style={CommentS.textInput}
                    placeholder="Viết bình luận "
                    multiline={true}
                />
            </View>
        </View>
    );
};

export default Comment;


