import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    FlatList,
    ScrollView
} from 'react-native'
import React, { useEffect, useState, useMemo, useRef } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon3 from 'react-native-vector-icons/FontAwesome5'
import ProfilePage from '../../components/items/ProfilePage'
import Friends from '../../components/items/Friends'
import ProfileS from '../../styles/screens/profile/ProfileS'
import HomeS from '../../styles/screens/home/HomeS'
import { useDispatch, useSelector } from 'react-redux';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import {
    joinGroupPrivate,
    getUser,
} from '../../rtk/API';

const Profile = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [user, setUser] = useState(null);
    //const [posts, setPosts] = useState([]);


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
    };

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


    // bottomsheet
    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ["30%"], []);
    // const [isSheetOpen, setIsSheetOpen] = useState(false);

    const btnUnfriends = () => {
        setCheck(check + 1)
        setFrag(true)
        // setIsSheetOpen(true);
        bottomSheetRef.current?.snapToIndex(0); // Mở ngay 100%
    };

    const unfriend = () => {
        setFrag(false),
            setCheck(0)
    }

    //btnFriends
    const [frag, setFrag] = useState(false)
    const [check, setCheck] = useState(0)


    const headerFriends = () => {
        return (
            <View style={ProfileS.container1}>
                <View style={ProfileS.boxHeader}>
                    <View >
                        <View>
                            <Image style={ProfileS.backGroundImage} source={require('./../../../assets/images/phongcanh.jpg')} />
                            <Image style={ProfileS.avata} source={{ uri: user?.avatar }} />
                        </View>
                        <View style={ProfileS.boxBackground}>
                            <Text style={ProfileS.name}>{user?.first_name} {user?.last_name}</Text>
                            <View style={ProfileS.boxInformation}>
                                <Text style={ProfileS.friendNumber}>500 </Text>
                                <Text style={[ProfileS.friendNumber, { color: "#D6D6D6" }]}> Người bạn</Text>
                            </View>

                            {/* btn me vs friend */}
                            {
                                user && (user._id !== me._id ? (
                                    <View>
                                        <TouchableOpacity style={frag ? ProfileS.btnAddStory2 : ProfileS.btnAddStory} onPress={btnUnfriends}>
                                            <View>
                                                {frag ? <Icon3 name="user-friends" size={20} color="#FFFFFF" /> : <Icon name="person-add" size={20} color="#FFFFFF" />}
                                            </View>
                                            <Text style={ProfileS.textAddStory}>{frag ? "Đã là bạn bè" : "Thêm bạn bè"}</Text>
                                        </TouchableOpacity>
                                        <View style={ProfileS.boxEdit}>
                                            <TouchableOpacity
                                                style={frag ? ProfileS.btnEdit2 : ProfileS.btnEdit}
                                                onPress={onChat}
                                            >
                                                <Text style={frag ? ProfileS.textEdit : ProfileS.textEdit2}>Nhắn tin</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ProfileS.btnMore}>
                                                <Icon name="ellipsis-horizontal" size={25} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ) : (
                                    <View>
                                        <TouchableOpacity style={ProfileS.btnAddStory}>
                                            <Text style={ProfileS.textAddStory}>+ Thêm vào tin</Text>
                                        </TouchableOpacity>
                                        <View style={ProfileS.boxEdit}>
                                            <TouchableOpacity style={ProfileS.btnEdit}>
                                                <Text style={ProfileS.textEdit}>Chỉnh sửa trang cá nhân</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={ProfileS.btnMore}>
                                                <Icon name="ellipsis-horizontal" size={25} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            }


                        </View>
                    </View>
                </View>
                <View style={[ProfileS.boxHeader, { marginVertical: 7 }]}>
                    <View style={ProfileS.boxFriends}>
                        <View style={ProfileS.title}>
                            <View>
                                <Text style={ProfileS.textFriend}>Bạn bè</Text>
                                <Text style={ProfileS.textFriendNumber2}>500 Người bạn</Text>
                            </View>
                            <Text style={ProfileS.textSeeAll}>Xem tất cả bạn bè</Text>
                        </View>
                        <View style={ProfileS.listFriends}>
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

                <View style={[ProfileS.boxHeader, { marginBottom: 7 }]}>
                    <View style={ProfileS.boxLive}>
                        <View style={ProfileS.title2}>
                            <Text style={{ fontSize: 16, fontWeight: "bold" }}>Bài viết</Text>
                            <Text style={{ fontSize: 15, color: '#0064E0' }}>Bộ lọc</Text>
                        </View>
                        <View style={ProfileS.boxAllThink}>
                            <View style={ProfileS.boxThink}>
                                <Image style={ProfileS.avataStatus} source={require('./../../../assets/images/person.jpg')} />
                                <Text style={{ fontSize: 13, marginLeft: 10 }}>Bạn đang nghĩ gì?</Text>
                            </View>
                            <Icon name="image" size={30} color="#3FF251" />
                        </View>

                    </View>
                    <View style={ProfileS.boxLivestream}>
                        <TouchableOpacity style={ProfileS.btnLivestream}>
                            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                                <Icon name="videocam" size={20} color="red" />
                                <Text>   Phát trực tiếp</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={ProfileS.btnManage}>
                        <View style={ProfileS.boxManange}>
                            <Icon2 name="comment-text" size={17} color="black" />
                            <Text style={{ fontSize: 13 }}>  Quản lí bài viết</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={ProfileS.container}>
                <View style={ProfileS.boxHeader}>
                    <View style={ProfileS.header}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                        >
                            <View >
                                <Icon name="chevron-back" size={20} color="black" />
                            </View>
                        </TouchableOpacity>
                        <Text style={ProfileS.titleName}>{user?.first_name} {user?.last_name}</Text>
                        <View>
                            <Icon name="search" size={20} color="black" />

                        </View>
                    </View>
                </View>
                <View style={HomeS.line}></View>

                <View style={[ProfileS.boxHeader]}>
                    <View>
                        <View style={ProfileS.post}>
                            <FlatList
                                data={dataPost}
                                renderItem={({ item }) => <ProfilePage post={item} />}
                                keyExtractor={(item) => item.id}
                                showsHorizontalScrollIndicator={false}
                                ListHeaderComponent={headerFriends}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 50 }}
                            />
                        </View>
                    </View>
                </View>
            </View>

            {check >= 2 && (
                <BottomSheet
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                // onClose={() => setIsSheetOpen(false)}
                >
                    <BottomSheetView style={{ height: "auto" }}>
                        <TouchableOpacity onPress={unfriend}>
                            <View style={{ padding: 20, flexDirection: 'row', alignItems: 'center' }}>
                                <View>
                                    <Icon name="person-remove-sharp" size={20} color="black" />
                                </View>
                                <Text style={{ fontSize: 18, fontWeight: "bold", marginLeft: 15 }}>Hủy kết bạn</Text>
                            </View>
                        </TouchableOpacity>
                    </BottomSheetView>
                </BottomSheet>
            )}
        </GestureHandlerRootView>
    )
}

export default Profile

