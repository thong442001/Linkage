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


const HomeChat = (props) => {
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [groups, setGroups] = useState(null);

    useEffect(() => {
        // Call API khi lần đầu vào trang
        callGetAllGroupOfUser(me._id);

        // Thêm listener để gọi lại API khi quay lại trang
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


            <TextInput style={styles.searchBox} placeholder="Tìm kiếm" />
            {/* groups */}
            <FlatList
                data={groups}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => onChat(item._id)} key={item._id}>
                        <Groupcomponent item={item} />
                    </TouchableOpacity>
                )}
            />
        </View >
    )
}

export default HomeChat

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "black",
        width: Dimensions.get('window').width * 0.5,
        textAlign: 'center',
    },
    searchBox: {
        backgroundColor: '#eee',
        borderRadius: 20,
        padding: 10,
        marginBottom: 15,
    },
    vHeader: {
        flexDirection: 'row',
        //width: Dimensions.get('window').width,
        justifyContent: 'space-around',
        marginBottom: 10,
    },
});