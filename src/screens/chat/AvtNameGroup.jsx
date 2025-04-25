import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    TextInput,
    Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
    getGroupID,
} from '../../rtk/API';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useSocket } from '../../context/socketContext';
import LoadingChatList from '../../utils/animation/loadingChatList/LoadingChatList';
const AvtNameGroup = (props) => { // cần ID_group (param)
    const { route, navigation } = props;
    const { params } = route;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);

    const [AvtGroup, setAvtGroup] = useState(null);
    const [nameGroup, setNameGroup] = useState(null);
    const [isEditing, setIsEditing] = useState(false);// input name
    const [isLoading, setIsLoading] = useState(false)
    const { socket } = useSocket();

    useEffect(() => {

        socket.emit("joinGroup", params?.ID_group);


        socket.on("lang_nghe_chat_edit_avt_name_group", (data) => {
            console.log("lang_nghe_chat_edit_avt_name_group")
        });

        return () => {
            socket.off("lang_nghe_chat_edit_avt_name_group");
        };
    }, [params?.ID_group]);

    useEffect(() => {
        // Call API khi lần đầu vào trang
        callGetGroupID();

        // Thêm listener để gọi lại API khi quay lại trang
        const focusListener = navigation.addListener('focus', () => {
            callGetGroupID();
        });

        // Cleanup listener khi component bị unmount
        return () => {
            focusListener();
        };
    }, [navigation]);

    //call api getGroupID
    const callGetGroupID = async () => {
        try {
            await dispatch(getGroupID({ ID_group: params.ID_group, token: token }))
                .unwrap()
                .then((response) => {
                    console.log(response.group)
                    setAvtGroup(response.group.avatar);
                    if (response.group.name == null) {
                        setNameGroup("Nhóm chưa có tên");
                    } else {
                        setNameGroup(response.group.name);
                    }

                })
                .catch((error) => {
                    console.log('Error1 getGroupID:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    //call api editAvtNameGroup
    const callEditAvtNameGroup = async () => {
        if (!socket) return;
        const payload = {
            ID_group: params.ID_group,
            avatar: AvtGroup,
            name: nameGroup == "Nhóm chưa có tên" ? null : nameGroup,
        };
        socket.emit('edit_avt_name-group', payload);
        navigation.navigate("SettingChat", { ID_group: params.ID_group })
    }

    //up lên cloudiary
    const uploadFile = async (file) => {
        try {
            setIsLoading(true)
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.png'),
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post('https://api.cloudinary.com/v1_1/ddasyg5z3/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileUrl = response.data.secure_url;
            //console.log('🌍 Link file Cloudinary:', fileUrl);
            setAvtGroup(fileUrl);
        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("lỗi khi tải file")
        }
        finally {
            setIsLoading(false)
        }
    };

    //mở thư viện
    const onOpenGallery = async () => {
        try {
            const options = {
                mediaType: 'mixed',
                quality: 1,
            };

            launchImageLibrary(options, async (response) => {
                //console.log(response);
                if (response.didCancel) {
                    console.log("đã hủy")
                } else if (response.errorMessage) {
                    console.log("lỗi khi mở thư viện")
                } else {
                    const selectedFile = response.assets[0];
                    //console.log('📂 File đã chọn:', selectedFile.uri);

                    await uploadFile(selectedFile);
                }
            });
        } catch (error) {
            console.log('onOpenGallery -> ', error);
        }
    };



    const goBack = () => {
        // để load lại trang chat khi thay đổi 
        navigation.navigate("SettingChat", { ID_group: params.ID_group })
    };

    return (
        <View style={styles.container}>

            {/* header */}
            {
                AvtGroup != null
                && (
                    <View
                        style={styles.vHeader}
                    >
                        {/* Nút quay lại */}
                        <TouchableOpacity onPress={goBack}>
                            <Text style={styles.headerBlue}>Hủy</Text>
                        </TouchableOpacity>
                        <Text style={styles.header}>Thông tin nhóm</Text>
                        {/* Nút tạo group */}
                        <TouchableOpacity
                            onPress={callEditAvtNameGroup}
                        >
                            <Text style={styles.headerBlue}>Lưu</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {/* Ảnh đại diện nhóm */}
            {
                AvtGroup != null
                && (
                    <View style={styles.groupAvatarContainer}>
                        <View style={styles.avatarWrapper}>
                        <Image source={{ uri: AvtGroup }} style={styles.avatar} />
                        {isLoading && (
                            <View style={styles.loadingOverlay}>
                                <LoadingChatList visible={isLoading} />
                            </View>
                        )}
                    </View>
                        {/* Name group */}
                        <TextInput
                            style={styles.searchBox}
                            value={nameGroup}
                            // onFocus={() => {
                            //     if (!isEditing) {
                            //         setNameGroup("");
                            //         setIsEditing(true);
                            //     }
                            // }}
                            onChangeText={setNameGroup}
                        />
                        <TouchableOpacity
                            style={styles.addMemberButton}
                            onPress={onOpenGallery}
                        >
                            <View style={styles.boxUpImage}>
                                <Icon name="image" size={30} color="black" />
                            </View>
                            <Text style={styles.addMemberText}>Tải ảnh lên</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
            {/* Nút vào thư viện */}
            {/* {
                AvtGroup != null
                && (
                    
                )
            } */}

        </View>
    );
};

const styles = StyleSheet.create({
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', 
        borderRadius: 60,
    },
    avatarWrapper: {
        position: 'relative', // Để chứa loading overlay
    },
    containerAll: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    container: {
        marginTop: 20,
        flexDirection: 'column',
    },
    vHeader: {
        flexDirection: 'row',
        //width: Dimensions.get('window').width,
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    headerBlue: {
        fontSize: 16,
        color: "blue",
        textAlign: 'center',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "black",
        width: Dimensions.get('window').width * 0.5,
        textAlign: 'center',
    },

    backButton: {
        position: "absolute",
        top: 20,
        left: 10,
        padding: 10,
    },
    groupAvatarContainer: {
        alignItems: "center",
        marginTop: 50,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 60,
    },
    groupName: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 10,
    },
    changeGroupInfo: {
        color: "blue",
        marginTop: 5,
    },
    addMemberButton: {
        alignItems: "center",
        marginTop: 20,

    },
    addMemberText: {
        fontSize: 14,
        color: "black",
        marginTop: 5,
    },
    boxUpImage: {
        backgroundColor: '#d9d9d960',
        padding: 10,
        borderRadius: 100
    },
    searchBox: {
        // borderColor: 'gray',
        // borderRadius: 10,
        borderWidth: 0.5,
        padding: 10,
        marginTop: 20,
        //

        //flex: 1,
        height: 40,
        paddingHorizontal: 15,
        borderRadius: 10,
        marginHorizontal: 10,
        color: 'black',
        backgroundColor: '#E1E6EA'

    }
});

export default AvtNameGroup
