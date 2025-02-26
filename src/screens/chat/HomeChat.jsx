import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Dimensions
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
        // Call API khi lần đầu vào trang
        callGetAllGroupOfUser(me._id);


        //Thêm listener để gọi lại API khi quay lại trang
        const focusListener = navigation.addListener('focus', () => {
            callGetAllGroupOfUser(me._id);
        });

        // Cleanup listener khi component bị unmount
        return () => {
            focusListener();

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
                        :
                        <FlatList
                            data={groups}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                                <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                                    <Groupcomponent item={item} />
                                </TouchableOpacity>
                            )}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
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
    }
});