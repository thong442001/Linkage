import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    TouchableWithoutFeedback,
    Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import ProfilePage from '../../components/items/ProfilePage'
import Friends from '../../components/items/Friends'
import { useDispatch, useSelector } from 'react-redux';
import {
    joinGroupPrivate,
    getUser,
    getRelationshipAvsB,// relationships
} from '../../rtk/API';

const Profile = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [user, setUser] = useState(null);
    //const [posts, setPosts] = useState([]);
    const [relationship, setRelationship] = useState(null);
    // visible phản hồi kết bạn
    const [menuVisible, setMenuVisible] = useState(false);


    const onGetUser = async (userId) => {
        try {
            await dispatch(getUser({ userId: userId, token: token }))
                .unwrap()
                .then((response) => {
                    console.log(response);
                    setUser(response.user);
                })
                .catch((error) => {
                    console.log('Error:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    // const onGetPosts = async (userId) => {
    //     try {
    //         await dispatch(myPost({ userId: userId, token: token }))
    //             .unwrap()
    //             .then((response) => {
    //                 //console.log(response);
    //                 setPosts(response.posts);
    //             })
    //             .catch((error) => {
    //                 console.log('Error:', error);
    //             });

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const fetchData = async () => {
        let userId = params?._id || me?._id;  // Nếu có params._id thì là bạn bè, không thì là chính mình
        setUser(params?._id ? null : me); // Nếu là mình thì lấy từ Redux

        if (userId && params?._id) {
            await onGetUser(userId);
        }
        //await onGetPosts(userId);

        if (params?._id !== me._id) {
            if (params?._id != null || params?._id != '') {
                await getRelation();
            }
        }
    };

    //xác định mối quan hệ
    const getRelation = async () => {
        try {
            const paramsAPI = {
                ID_user: params?._id,
                me: me._id,
            }
            await dispatch(getRelationshipAvsB(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log(response);
                    setRelationship(response.relationship);
                })
                .catch((error) => {
                    console.log('Error2 getRelationshipAvsB:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //chat
    const getID_groupPrivate = async (user1, user2) => {
        try {
            const paramsAPI = {
                user1: user1,
                user2: user2,
            }
            await dispatch(joinGroupPrivate(paramsAPI))
                .unwrap()
                .then((response) => {
                    //console.log(response);
                    //setID_groupPrivate(response.ID_group);
                    navigation.navigate("Chat", { ID_group: response.ID_group })
                })
                .catch((error) => {
                    console.log('Error1:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }


    const onChat = async () => {
        await getID_groupPrivate(params?._id, me?._id)
    }

    useEffect(() => {
        fetchData();
    }, [params?._id, me]); // Chạy lại nếu params._id hoặc me thay đổi


    const dataPost = [
        {
            id: 1,
            name: 'Kenny',
            image: ['https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg'],
            avata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg',
            time: '1 giờ trước',
            title: 'Hôm nay trời đẹp quá',
        },
    ]

    const data = [
        {
            id: 1,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 2,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 3,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 4,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 5,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 6,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 7,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 8,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
        {
            id: 9,
            name: "Kenny",
            image: "https://t3.ftcdn.net/jpg/02/43/12/34/360_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"
        },
    ]

    const headerFriends = () => {
        return (
            <View style={styles.container1}>
                <View style={styles.boxHeader}>
                    <View >
                        <View>
                            <Image style={styles.backGroundImage} source={require('./../../../assets/images/phongcanh.jpg')} />
                            <Image style={styles.avata} source={{ uri: user?.avatar }} />
                        </View>
                        <View style={styles.boxBackground}>
                            <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
                            <View style={styles.boxInformation}>
                                <Text style={styles.friendNumber}>500 </Text>
                                <Text style={[styles.friendNumber, { color: "#D6D6D6" }]}> Người bạn</Text>
                            </View>

                            {/* btn me vs friend */}
                            {
                                user && (user._id !== me._id ? (
                                    <View>
                                        {
                                            relationship?.relationship == 'Người lạ'
                                            && <TouchableOpacity style={styles.btnAddStory}>
                                                <Text style={styles.textAddStory}>+ Thêm bạn bè</Text>
                                            </TouchableOpacity>
                                        }
                                        {
                                            relationship?.relationship == 'Bạn bè'
                                            && <TouchableOpacity style={styles.btnAddStory}>
                                                <Text style={styles.textAddStory}>Bạn bè</Text>
                                            </TouchableOpacity>
                                        }
                                        {
                                            ((relationship?.ID_userA == me._id
                                                && relationship?.relationship == 'A gửi lời kết bạn B')
                                                || (relationship?.ID_userB == me._id
                                                    && relationship?.relationship == 'B gửi lời kết bạn A'))
                                            && (
                                                <TouchableOpacity style={styles.btnAddStory}>
                                                    <Text style={styles.textAddStory}>Hủy lời mời</Text>
                                                </TouchableOpacity>
                                            )
                                        }
                                        {
                                            ((relationship?.ID_userA == me._id
                                                && relationship?.relationship == 'B gửi lời kết bạn A')
                                                || (relationship?.ID_userB == me._id
                                                    && relationship?.relationship == 'A gửi lời kết bạn B'))
                                            && (
                                                /* Nhấn để mở menu */
                                                < TouchableWithoutFeedback
                                                    style={styles.btnAddStory}
                                                    onPress={() => {
                                                        setMenuVisible(true);
                                                    }}>
                                                    <Text style={styles.textAddStory}>+ Phản hồi</Text>
                                                </TouchableWithoutFeedback>
                                            )
                                        }

                                        <View style={styles.boxEdit}>
                                            <TouchableOpacity
                                                style={styles.btnEdit}
                                                onPress={onChat}
                                            >
                                                <Text style={styles.textEdit}>Nhắn tin</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnMore}>
                                                <Icon name="ellipsis-horizontal" size={25} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <TouchableOpacity style={styles.btnAddStory}>
                                            <Text style={styles.textAddStory}>+ Thêm vào tin</Text>
                                        </TouchableOpacity>
                                        <View style={styles.boxEdit}>
                                            <TouchableOpacity style={styles.btnEdit}>
                                                <Text style={styles.textEdit}>Chỉnh sửa trang cá nhân</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.btnMore}>
                                                <Icon name="ellipsis-horizontal" size={25} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }


                        </View>
                    </View>
                </View>
                <View style={[styles.boxHeader, { marginVertical: 7 }]}>
                    <View style={styles.boxFriends}>
                        <View style={styles.title}>
                            <View>
                                <Text style={styles.textFriend}>Bạn bè</Text>
                                <Text style={styles.textFriendNumber2}>500 Người bạn</Text>
                            </View>
                            <Text style={styles.textSeeAll}>Xem tất cả bạn bè</Text>
                        </View>
                        <View style={styles.listFriends}>
                            <FlatList
                                data={data.slice(0, 6)}
                                renderItem={({ item }) => <Friends friends={item} />}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </View>
                </View>

                <View style={[styles.boxHeader]}>
                    <View style={styles.boxLive}>
                        <View style={styles.title2}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Bài viết</Text>
                            <Text style={{ fontSize: 15, color: '#0064E0' }}>Bộ lọc</Text>
                        </View>
                        <View style={styles.boxAllThink}>
                            <View style={styles.boxThink}>
                                <Image style={styles.avataStatus} source={require('./../../../assets/images/person.jpg')} />
                                <Text style={{ fontSize: 13, marginLeft: 10 }}>Bạn đang nghĩ gì?</Text>
                            </View>
                            <Icon name="image" size={30} color="#3FF251" />
                        </View>

                    </View>
                    <View style={styles.boxLivestream}>
                        <TouchableOpacity style={styles.btnLivestream}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <Icon name="videocam" size={20} color="red" />
                                <Text>   Phát trực tiếp</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.btnManage}>
                        <View style={styles.boxManange}>
                            <Icon2 name="comment-text" size={17} color="black" />
                            <Text style={{ fontSize: 13 }}>  Quản lí bài viết</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View >
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.boxHeader}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                    >
                        <View >
                            <Icon name="chevron-back" size={20} color="black" />
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.titleName}>{user?.first_name} {user?.last_name}</Text>
                    <View>
                        <Icon name="search" size={20} color="black" />
                    </View>
                </View>
            </View>

            <View style={[styles.boxHeader, { marginTop: 7 }]}>
                <View>
                    <View style={styles.post}>
                        <FlatList
                            data={dataPost}
                            renderItem={({ item }) => <ProfilePage post={item} />}
                            keyExtractor={(item) => item.id}
                            showsHorizontalScrollIndicator={false}
                            ListHeaderComponent={headerFriends}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                </View>
            </View>



            {/* Menu Phản hồi kết bạn */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableWithoutFeedback
                    onPress={() => setMenuVisible(false)}
                >
                    <View style={styles.overlay}>
                        <Text>Phản hồi</Text>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container1: {
        flex: 1,
        backgroundColor: "#A1A6AD"
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 11,
    },
    titleName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    boxHeader: {
        backgroundColor: "#fff",
    },
    backGroundImage: {
        height: 170,
        width: '100%',
    },
    avata: {
        width: 136,
        height: 136,
        borderRadius: 320,
        borderColor: '#fff',
        borderWidth: 2,
        position: 'absolute',
        bottom: -68,
        left: 20,
    },
    boxBackground: {
        marginHorizontal: 20,
        marginVertical: 20,
        marginTop: "20%",

    },
    boxInformation: {
        flexDirection: 'row',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    friendNumber: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    btnAddStory: {
        backgroundColor: '#0064E0',
        borderRadius: 8,
        marginVertical: 10,
    },
    textAddStory: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginVertical: 11,
    },
    boxEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    btnEdit: {
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        flex: 4,
        alignItems: 'center',
    },
    textEdit: {
        fontSize: 13,
        fontWeight: 'bold',
        marginVertical: 11,
    },
    btnMore: {
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        flex: 1,
        alignItems: 'center',
        padding: 8,
        marginLeft: 13,
    },
    boxFriends: {
        marginHorizontal: 20
    },
    title: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 14
    },
    textFriendNumber2: {
        fontSize: 12,
        color: "#BEBEBE",
        fontWeight: "bold"
    },
    textFriend: {
        fontSize: 16,
        fontWeight: "bold"
    },
    textSeeAll: {
        color: "#0064E099"
    },
    listFriends: {
        alignItems: "center",
        marginVertical: 19,
    },
    boxLive: {
        marginHorizontal: 20,
        marginVertical: 15
    },
    avataStatus: {
        width: 40,
        height: 40,
        borderRadius: 180,

    },
    boxAllThink: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10
    },
    boxThink: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    title2: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    boxLivestream: {
        paddingVertical: 17,
        backgroundColor: '#D9D9D999',
        marginVertical: 10
    },
    btnLivestream: {
        marginHorizontal: 20,
        backgroundColor: "#FFFFFF",
        width: 130,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 15,
    },
    boxManange: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnManage: {
        backgroundColor: '#D9D9D9',
        marginHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 10
    },
    //modal
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
})