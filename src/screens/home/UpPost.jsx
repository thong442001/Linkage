import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    Modal,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import UpPostS from '../../styles/screens/home/UpPostS';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPost,
    getAllFriendOfID_user,
} from '../../rtk/API';
import FriendAdd from '../../components/chat/FriendAdd';
import Video from 'react-native-video';

const UpPost = (props) => {
    const { navigation } = props;

    const dispatch = useDispatch();
    const token = useSelector(state => state.app.token)
    const me = useSelector(state => state.app.user);

    const [modalVisible, setModalVisible] = useState(false);
    //tag
    const [tagVisible, setTagVisible] = useState(false);
    //friend
    const [friends, setFriends] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [membersGroup, setMembersGroup] = useState([]);


    //call api getAllFriendOfID_user (lấy danh sách bạn bè)
    const callGetAllFriendOfID_user = async () => {
        try {
            await dispatch(getAllFriendOfID_user({ me: me._id, token: token }))
                .unwrap()
                .then((response) => {
                    //console.log(response.groups)
                    setFriends(response.relationships);
                })
                .catch((error) => {
                    console.log('Error1 getAllFriendOfID_user:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        callGetAllFriendOfID_user()
    }, [tagVisible == true])


    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: "Công khai"
    });
    const [caption, setCaption] = useState('');
    const [medias, setMedias] = useState([]);
    const [typePost, setTypePost] = useState('Normal');
    const [tags, setTags] = useState([]);
    //de luu tam user duoc chon
    const [tempSelectedUsers, setTempSelectedUsers] = useState([]);

    const [Flag, setFlag] = useState(false)

    const toggleSelectUser = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((userId) => userId !== id)
                : [...prev, id]
        );
        setTags((prev) =>
            prev.includes(id)
                ? prev.filter((tagId) => tagId !== id) // Nếu đã có id, thì xóa nó khỏi mảng
                : [...prev, id]// Nếu chưa có, thì thêm vào mảng
        );
        setTempSelectedUsers((prev) =>
            prev.includes(id)
                ? prev.filter((userId) => userId !== id) // cũng giống cái setTags nhưng chỉ dùng để lưu trữ tạm rồi set lại vào cái setSelecterUsser 
                : [...prev, id]
        );
    };

    // Các tùy chọn trạng thái
    const status = [
        {
            status: 1,
            name: "Công khai"
        },
        {
            status: 2,
            name: "Bạn bè"
        },
        {
            status: 3,
            name: "Chỉ mình tôi"
        },
    ];


    const hasMedia = medias?.length > 0;
    const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');
    const renderMediaGrid = (medias) => {
        const mediaCount = medias.length;

        if (mediaCount === 0) return null;

        return (
            <View style={UpPostS.mediaContainer}>
                {medias.slice(0, 5).map((uri, index) => (
                    <TouchableOpacity key={index} style={getMediaStyle(mediaCount, index)}>
                        {isVideo(uri) ? (
                            <View style={UpPostS.videoWrapper}>
                                <Video source={{ uri }} style={UpPostS.video} resizeMode="cover" paused />
                                <View style={UpPostS.playButton}>
                                    <Icon name="play-circle" size={40} color="white" />
                                </View>
                            </View>
                        ) : (

                            <Image source={{ uri }} style={UpPostS.image} resizeMode="cover" />
                        )}

                        {index === 4 && mediaCount > 5 && (
                            <View style={UpPostS.overlay}>
                                <Text style={UpPostS.overlayText}>+{mediaCount - 5}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const getMediaStyle = (count, index) => {
        if (count === 1) {
            return UpPostS.singleMedia;
        } else if (count === 2) {
            return UpPostS.doubleMedia;
        } else if (count === 3) {
            return index === 0 ? UpPostS.tripleMediaFirst : UpPostS.tripleMediaSecond;
        } else if (count === 4) {
            return UpPostS.quadMedia;
        } else { // 5+ media
            if (index < 2) return UpPostS.fivePlusMediaFirstRow;
            else if (index === 2) return UpPostS.fivePlusMediaSecondRowLeft;
            else if (index === 3) return UpPostS.fivePlusMediaSecondRowMiddle;
            else return UpPostS.fivePlusMediaSecondRowRight;
        }
    };

    // Hàm tải lên một file lên Cloudinary
    const uploadFile = async (file) => {
        try {
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.png'),
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post('https://api.cloudinary.com/v1_1/ddbolgs7p/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);
            return fileUrl; // Trả về URL file đã tải lên
        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("Lỗi khi tải file");
            return null; // Trả về null nếu có lỗi
        }
    };

    // Hàm tải lên nhiều file cùng lúc
    const uploadMultipleFiles = async (files) => {
        try {
            const uploadedUrls = await Promise.all(files.map(file => uploadFile(file)));
            const validUrls = uploadedUrls.filter(url => url !== null); // Loại bỏ file lỗi
            setMedias(prev => [...prev, ...validUrls]); // Cập nhật danh sách medias
        } catch (error) {
            console.log('uploadMultipleFiles -> ', error);
        }
    };

    // Mở thư viện và chọn nhiều ảnh/video
    const onOpenGallery = async () => {
        try {
            const options = {
                mediaType: 'mixed', // Chọn cả ảnh và video
                quality: 1,
                selectionLimit: 0, // Cho phép chọn nhiều file
            };

            launchImageLibrary(options, async (response) => {
                if (response.didCancel) {
                    console.log("Đã hủy");
                } else if (response.errorMessage) {
                    console.log("Lỗi khi mở thư viện");
                } else {
                    const selectedFiles = response.assets;
                    console.log('📂 Các file đã chọn:', selectedFiles);
                    await uploadMultipleFiles(selectedFiles); // Gọi hàm upload tất cả file
                }
            });
        } catch (error) {
            console.log('onOpenGallery -> ', error);
        }
    };

    //call api addPost
    const callAddPost = async () => {
        try {
            if (caption == '' && medias.length == 0) {
                console.log('chưa có dữ liệu');
                return;
            }
            const paramsAPI = {
                ID_user: me._id,
                caption: caption,
                medias: medias,
                status: selectedOption.name,
                type: typePost,
                ID_post_shared: null,
                tags: tags,
            }
            console.log("push", paramsAPI);
            await dispatch(addPost(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log(response)
                    navigation.goBack()
                })
                .catch((error) => {
                    console.log('Error1 addPost:', error);
                });

        } catch (error) {
            console.log(error)
        }
    }

    const handleSelectOption = (option) => {
        setSelectedOption(option);
        setModalVisible(false);
    };

    //handle tag
    const handleModelTag = () => {
        setTagVisible(true);
        console.log(">>>>>>>", friends)
    }

    // Chuyển danh sách friends thành mảng chứa ID và thông tin
    const formattedFriends = friends?.map(friend => ({
        _id: friend.ID_userA._id === me._id ? friend.ID_userB._id : friend.ID_userA._id,
        first_name: friend.ID_userA._id === me._id ? friend.ID_userB.first_name : friend.ID_userA.first_name,
        last_name: friend.ID_userA._id === me._id ? friend.ID_userB.last_name : friend.ID_userA.last_name,
    })) || [];


    //add tag
    const handleAddTag = () => {
        setTypePost('Tag')
        setSelectedUsers(tempSelectedUsers); // Cập nhật danh sách user chính thức
        setTags(tempSelectedUsers); // Cập nhật danh sách tags
        setTagVisible(false); // Đóng modal
    }

    return (
        <View style={UpPostS.Container}>
            <View style={UpPostS.Header}>
                <View style={UpPostS.boxBack}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View>
                            <Icon name="chevron-back-outline" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                    <Text style={UpPostS.txtCreate}>Tạo bài viết</Text>
                </View>
                <TouchableOpacity
                    style={(caption == '' && medias.length == 0) ? UpPostS.btnPost : UpPostS.btnPost2}
                    onPress={callAddPost}
                    disabled={caption == '' && medias.length == 0} // Nếu caption rỗng thì không nhấn được
                >
                    {/* hi */}
                    <Text style={(caption == '' && medias.length == 0) ? UpPostS.txtUpPost : UpPostS.txtUpPost2}>Đăng bài</Text>
                </TouchableOpacity>
            </View>
            <View style={UpPostS.line}></View>
            <View style={[UpPostS.boxMargin, { flex: 1 }]}>
                <View style={UpPostS.boxInfor}>
                    <Image style={UpPostS.avatar}
                        source={{ uri: me.avatar }}
                    />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={UpPostS.txtName}>
                            {me.first_name} {me.last_name}
                            {tags.length > 0 && (
                                <>
                                    <Text style={{ color: 'gray' }}> cùng với </Text>
                                    <Text style={{ fontWeight: 'bold' }}>
                                        {(() => {
                                            const taggedUser = formattedFriends.find(friend => friend._id === tags[0]);
                                            return `${taggedUser?.first_name || ''} ${taggedUser?.last_name || ''}`;
                                        })()}
                                    </Text>
                                    {tags.length > 1 && (
                                        <>
                                            <Text style={{ color: 'gray' }}> và </Text>
                                            <Text style={{ fontWeight: 'bold' }}>{tags.length - 1} người khác</Text>
                                        </>
                                    )}
                                </>
                            )}
                        </Text>


                        <View style={UpPostS.boxStatus}>
                            <TouchableOpacity
                                style={UpPostS.btnStatus}
                                onPress={() => setModalVisible(true)}
                            >
                                <Text style={UpPostS.txtPublic}>{selectedOption.name}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[UpPostS.btnStatus, { marginLeft: 10 }]}>
                                <Text style={UpPostS.txtPublic}>+ Album</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
                <View>
                    <TextInput
                        value={caption}
                        onChangeText={setCaption}
                        placeholder='Bạn đang nghĩ gì?'
                        style={UpPostS.txtInput}
                        multiline={true}
                        placeholderTextColor={"gray"}
                        onPress={() => setFlag(true)}
                    />
                    {/* medias */}
                    {hasMedia && renderMediaGrid(medias)}
                </View>

            </View>




            <View style={UpPostS.boxItems2}>
                <View
                    style={Flag == true ? UpPostS.BoxInter : UpPostS.BoxInter1}
                >
                    {
                        Flag == true ? <View></View> : <View style={UpPostS.line}></View>
                    }

                    <TouchableOpacity
                        style={UpPostS.btnIcon}
                        onPress={onOpenGallery}
                    >
                        <View style={UpPostS.boxItems}>
                            <Icon name="image-outline" size={30} color="#33a850" />
                            {
                                Flag == true ? <Text></Text> : <Text style={UpPostS.txtIcon}>Ảnh/video</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    <View style={Flag == true ? UpPostS.line1 : UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon} onPress={() => handleModelTag()}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="pricetag" size={30} color="#48a1ff" />
                            {
                                Flag == true ? <Text></Text> : <Text style={UpPostS.txtIcon}>Gắn thẻ</Text>
                            }
                        </View>
                    </TouchableOpacity>

                    <View style={Flag == true ? UpPostS.line1 : UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="videocam-outline" size={30} color="#fcb13c" />
                            {
                                Flag == true ? <Text></Text> : <Text style={UpPostS.txtIcon}>Video trực tiếp</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        Flag == true ? <View></View> : <View style={UpPostS.line}></View>
                    }
                </View>
            </View>
            {/* Modal để hiển thị danh sách */}
            < Modal
                transparent={true}  // Cho phép nền của modal trong suốt, giúp nhìn thấy nền bên dưới modal.
                visible={modalVisible}  // Điều khiển việc modal có hiển thị hay không dựa trên trạng thái `modalVisible`.
                animationType="fade"  // Hiệu ứng khi modal xuất hiện. Ở đây là kiểu "slide" từ dưới lên.
                onRequestClose={() => setModalVisible(false)}  // Khi modal bị yêu cầu đóng (ví dụ trên Android khi bấm nút back), hàm này sẽ được gọi để đóng modal.
            >
                <TouchableOpacity
                    style={UpPostS.modalOverlay}  // Overlay của modal, tạo hiệu ứng làm mờ nền dưới modal.
                    onPress={() => setModalVisible(false)}  // Đóng modal khi người dùng chạm vào khu vực bên ngoài modal.
                >
                    {/* // Nội dung chính của modal, nơi hiển thị các tùy chọn. */}
                    <View style={UpPostS.modalContent}>
                        {
                            status.map((option, index) => (
                                <TouchableOpacity
                                    key={index}  // Mỗi phần tử trong danh sách cần có một key duy nhất.
                                    style={UpPostS.optionButton}  // Styling cho mỗi nút tùy chọn trong danh sách.
                                    onPress={() => handleSelectOption(option)}  // Khi người dùng chọn một tùy chọn, hàm này sẽ được gọi để cập nhật trạng thái và đóng modal.
                                >
                                    {/* // Hiển thị tên của tùy chọn. */}
                                    <Text style={UpPostS.optionText}>{option.name}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            </Modal >

            {/* Tag */}
            <Modal
                visible={tagVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setTagVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setTagVisible(false)}>
                    <View style={UpPostS.overlay1}>
                        <View style={UpPostS.modalContainer}>
                            <View >
                                <View style={{ flexDirection: 'column' }}>
                                    {/* <Image source={{ uri: me?.avatar }} style={UpPostS.avatar} /> */}
                                    {/* <View style={{ marginLeft: 10 }}> */}
                                    {/* <Text style={UpPostS.name}>{me?.first_name + " " + me?.last_name}</Text> */}
                                    <View style={UpPostS.boxTag}>
                                        <TouchableOpacity style={UpPostS.btnTag} onPress={() => handleAddTag()}>
                                            <Text style={UpPostS.tag}>
                                                Gắn thẻ
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={friends}
                                        keyExtractor={(item) => item._id}
                                        extraData={selectedUsers} // Cập nhật danh sách khi selectedUsers thay đổi
                                        renderItem={({ item }) => (
                                            <FriendAdd
                                                item={item}
                                                onToggle={toggleSelectUser}
                                                selectedUsers={selectedUsers}
                                                membersGroup={membersGroup}
                                            />
                                        )}
                                    />
                                    {/* </View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    )
}

export default UpPost
