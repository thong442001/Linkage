import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions,
    Image
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllGroupOfUser,
} from '../../rtk/API';
import Groupcomponent from '../../components/chat/Groupcomponent';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ChatHomeLoading from '../../utils/skeleton_loading/ChatHomeLoading';
import Icon from 'react-native-vector-icons/Ionicons'

const { width, height } = Dimensions.get('window');

const HomeChat = (props) => {// cần param
    const { route, navigation } = props;
    const { params } = route;
    const [loading, setloading] = useState(true)
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [groups, setGroups] = useState(null);

    useEffect(() => {
        callGetAllGroupOfUser(me._id);
    
        const focusListener = navigation.addListener('focus', () => {
            callGetAllGroupOfUser(me._id);
        });
    
        return () => {
            focusListener; // Sửa lỗi này
        };
    }, [navigation]);
    

    //call api getAllGroupOfUser
    const callGetAllGroupOfUser = async (ID_user) => {
        try {
            await dispatch(getAllGroupOfUser({ ID_user: ID_user, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response.groups)
                    setGroups(response.groups);
                    setloading(false)
                })
                .catch((error) => {
                    console.log('Error1:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }
    const onChat = (ID_group) => {
        ID_group != null ? navigation.navigate("Chat", { ID_group: ID_group })
            : console.log("ID_group: " + ID_group);
    }

    return (
        <View style={styles.container}>
            {/* header */}
            <View
                style={styles.vHeader}
            >
                {/* Nút quay lại */}
                <TouchableOpacity onPress={() => navigation.navigate("TabHome")}>
                    <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.header}>Đoạn chat</Text>
                  {/* Nút quét QR group */}
                <TouchableOpacity onPress={() => navigation.navigate("QRSannerAddGroup")} >
                <Icon name="scan-circle-outline" size={25} color="black" />
              </TouchableOpacity>
                {/* Nút tạo group */}
                <TouchableOpacity onPress={() => navigation.navigate("CreateGroup")}>
                    <MaterialIcons name="group-add" size={24} color="black" />
                </TouchableOpacity>
            </View>
            <View style={styles.inputSearch}>
                <View style={{ marginLeft: '3%' }}>
                    <Icon name="search-outline" size={25} color='black' />
                </View>
                <TextInput
                    style={styles.search}
                    placeholder='Search'
                    placeholderTextColor={"#ADB5BD"}
                />
            </View>
            {/* groups */}

            {
                (
                    loading ?
                        <ChatHomeLoading />

                        :<View>
                        <TouchableOpacity onPress={() => navigation.navigate('ChatBot')}>
                            <View style={styles.container_item}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={{ uri: 'https://static.vecteezy.com/system/resources/previews/010/054/157/non_2x/chat-bot-robot-avatar-in-circle-round-shape-isolated-on-white-background-stock-illustration-ai-technology-futuristic-helper-communication-conversation-concept-in-flat-style-vector.jpg' }}
                                        style={styles.img}
                                    />
                                    <Text style={styles.text_name_AI}>AI Chat</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    
                        {loading ? <ChatHomeLoading /> : (
                            <FlatList
                                data={groups}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                                        <Groupcomponent item={item} />
                                    </TouchableOpacity>
                                )}
                                ListEmptyComponent={
                                    <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                                        Bạn chưa có cuộc trò chuyện nào.
                                    </Text>
                                }
                                showsVerticalScrollIndicator={false}
                            />
                        )}
                    </View>
                    
                )
            }
        </View >
    )
}

export default HomeChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: width * 0.05, // 5% chiều rộng màn hình
    },
    header: {
        fontSize: width * 0.06, // 6% chiều rộng màn hình
        fontWeight: 'bold',
        color: "black",
        width: width * 0.5, // Chiếm 50% chiều rộng màn hình
        textAlign: 'center',
    },
    searchBox: {
        backgroundColor: '#eee',
        borderRadius: width * 0.05, // 5% chiều rộng màn hình
        padding: width * 0.025, // 2.5% chiều rộng màn hình
        marginBottom: height * 0.02, // 2% chiều cao màn hình
    },
    vHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: height * 0.025, // 2.5% chiều cao màn hình
    },
    inputSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7FC',
        padding: width * 0.01, // 1% chiều rộng màn hình
        borderRadius: width * 0.025, // 2.5% chiều rộng màn hình
        marginBottom: height * 0.025, // 2.5% chiều cao màn hình
    },
    search: {
        flex: 1,
        padding: width * 0.025, // 2.5% chiều rộng màn hình
    },
    container_item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 20
        // width: '100%',
        // height: '0%',
        // marginLeft: 12,
        // backgroundColor: 'black',
        // borderWidth: 5,
      },
      text_name_AI: {
        fontSize: 20,
        fontWeight: '500',
        marginLeft:10,
        color:"black",
      },
      img: {
        width: 60,
        height: 60 ,
        borderRadius: 50,
      },
});