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
    ActivityIndicator,
    Alert
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
import CommentS from '../../styles/components/items/CommentS';
import { oStackHome } from '../../navigations/HomeNavigation';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import { ScrollView } from 'react-native-gesture-handler';
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
    //AI
    const [prompt, setPrompt] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [modalVisibleAI, setModalVisibleAI] = useState(false);

    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [isPosting, setIsPosting] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [filtered, setFiltered] = useState([]);




    // Mô hình tạo ảnh
    const MODEL_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
    const API_KEY = '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'; // Thay bằng API key của bạn

    // AI tạo ảnh
    const generateImage = async () => {
        if (!prompt) return;

        try {
            setLoading(true);

            const response = await fetch(MODEL_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ inputs: prompt }),
            });

            // Chuyển đổi response thành base64
            const arrayBuffer = await response.arrayBuffer();
            const base64 = arrayBufferToBase64(arrayBuffer);
            const imageUri = `data:image/jpeg;base64,${base64}`;
            setImage(imageUri);

            // Chuyển Base64 thành file tạm thời để tải lên Cloudinary
            const file = {
                uri: imageUri,
                type: 'image/jpeg',
                fileName: 'ai-generated-image.jpg'
            };

            // Gọi hàm uploadFile để tải ảnh lên Cloudinary
            const uploadedUrl = await uploadFile(file);

            if (uploadedUrl) {
                setMedias(prev => [...prev, uploadedUrl]); // Thêm URL thật vào danh sách ảnh để đăng bài
            }



        } catch (error) {
            Alert.alert('Thông báo', 'Không thể tạo ảnh. Vui lòng thử lại sau.');
            console.error('Error generating image:', error);
        } finally {
            setLoading(false);
        }
    };


    // Hàm chuyển đổi ArrayBuffer thành base64
    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };


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

    //bỏ chọn ảnh
    const handleRemoveMedia = (index) => {
        setMedias((prev) => prev.filter((_, i) => i !== index));
    };

    const hasMedia = medias?.length > 0;
    const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');
    const renderMediaGrid = (medias) => {
        const mediaCount = medias.length;
    
        if (mediaCount === 0) return null;
    
        return (
            <View style={CommentS.mediaContainer}>
            {medias.slice(0, 5).map((uri, index) => (
                <View key={index} style={getMediaStyle(mediaCount, index)}>
                    {isVideo(uri) ? (
                        <View style={CommentS.videoWrapper}>
                            <Video source={{ uri }} style={CommentS.video} resizeMode="cover" paused />
                            <View style={CommentS.playButton}>
                                <Icon name="play-circle" size={40} color="white" />
                            </View>
                        </View>
                    ) : (
                        <Image source={{ uri }} style={CommentS.image} resizeMode="cover" />
                    )}

                    {/* Nút Xóa */}
                    <TouchableOpacity
                        style={CommentS.removeButton}
                        onPress={() => handleRemoveMedia(index)}
                    >
                        <Icon name="close-circle" size={24} color="red" />
                    </TouchableOpacity>

                    {index === 4 && mediaCount > 5 && (
                        <View style={CommentS.overlay}>
                            <Text style={CommentS.overlayText}>+{mediaCount - 5}</Text>
                        </View>
                    )}
                </View>
            ))}
        </View>
        );
    };

    const getMediaStyle = (count, index) => {
        if (count === 1) {
            return CommentS.singleMedia;
        } else if (count === 2) {
            return CommentS.doubleMedia;
        } else if (count === 3) {
            return index === 0 ? CommentS.tripleMediaFirst : CommentS.tripleMediaSecond;
        } else if (count === 4) {
            return CommentS.quadMedia;
        } else { // 5+ media
            if (index < 2) return CommentS.fivePlusMediaFirstRow;
            else if (index === 2) return CommentS.fivePlusMediaSecondRowLeft;
            else if (index === 3) return CommentS.fivePlusMediaSecondRowMiddle;
            else return CommentS.fivePlusMediaSecondRowRight;
        }
    };

    // Hàm tải lên một file lên Cloudinary
    const uploadFile = async (file) => {
        try {
            setLoadingUpload(true);
            const data = new FormData();
            data.append('file', {
                uri: file.uri,
                type: file.type,
                name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.png'),
            });
            data.append('upload_preset', 'ml_default');

            const response = await axios.post('https://api.cloudinary.com/v1_1/ddasyg5z3/upload', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);
            return fileUrl;
        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("Lỗi khi tải file");
            return null;
        } finally {
            setLoadingUpload(false);
        }
    };


    // Hàm tải lên nhiều file cùng lúc
    const uploadMultipleFiles = async (files) => {
        try {
            setLoadingUpload(true);
            const uploadedUrls = await Promise.all(files.map(file => uploadFile(file)));
            const validUrls = uploadedUrls.filter(url => url !== null);
            setMedias(prev => [...prev, ...validUrls]);
        } catch (error) {
            console.log('uploadMultipleFiles -> ', error);
        } finally {
            setLoadingUpload(false);
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
        if (caption == '' && medias.length == 0) {
            setFailedModalVisible(true);
            console.log('Chưa có dữ liệu');
            setTimeout(() => setFailedModalVisible(false), 2000);
            return;
        }

        setIsPosting(true);

        try {
            const paramsAPI = {
                ID_user: me._id,
                caption: caption,
                medias: medias,
                status: selectedOption.name,
                type: typePost,
                ID_post_shared: null,
                tags: tags,
            };

            console.log("Push", paramsAPI);
            await dispatch(addPost(paramsAPI))
                .unwrap()
                .then((response) => {
                    console.log('API response:', response);

                    setSuccessModalVisible(true);
                    setTimeout(() => {
                        setSuccessModalVisible(false);
                        navigation.navigate('TabHome', {
                            screen: 'Home',
                            params: {
                                refresh: true, // Thêm tham số refresh để thông báo cho Home
                            },
                        });
                        // Reset form
                        setCaption('');
                        setMedias([]);
                        setTags([]);
                        setTypePost('Normal');
                        setSelectedOption({ status: 1, name: "Công khai" });
                    }, 2000);
                })
                .catch((error) => {
                    console.log('Error addPost:', error);
                    setFailedModalVisible(true);
                    setTimeout(() => setFailedModalVisible(false), 2000);
                });
        } catch (error) {
            console.log(error);
            setFailedModalVisible(true);
            setTimeout(() => setFailedModalVisible(false), 2000);
        } finally {
            setIsPosting(false);
        }
    };


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
    //tách dấu
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize('NFD') // Tách dấu ra khỏi chữ
            .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };
    //search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFiltered(friends || []);
        } else {
            const filteredFriends = friends.filter(user => {
                // Xác định ai là bạn bè của bạn
                const friend = user.ID_userA._id === me._id ? user.ID_userB : user.ID_userB._id === me._id ? user.ID_userA : null;

                // Nếu không tìm thấy bạn bè (myId không có trong cặp), bỏ qua
                if (!friend) return false;

                // Lấy tên đầy đủ của bạn bè để lọc
                const fullName = `${friend.first_name || ''} ${friend.last_name || ''}`.toLowerCase();
                return normalizeText(fullName).includes(normalizeText(searchQuery).toLowerCase());
            });
            setFiltered(filteredFriends);
        }
    }, [searchQuery, friends, me]); // Thêm myId vào dependencies nếu nó có thể thay đổi


    return (
        <View style={UpPostS.Container}>
            <SuccessModal
                visible={successModalVisible}
                message={"Đăng bài thành công"} />
            <FailedModal
                visible={failedModalVisible}
                message="Đăng bài thất bại. Vui lòng thử lại!"
            />
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
                    style={(caption == '' && medias.length == 0) || isPosting ? UpPostS.btnPost : UpPostS.btnPost2}
                    onPress={callAddPost}
                    disabled={(caption == '' && medias.length == 0) || isPosting}
                >
                    {isPosting ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={(caption == '' && medias.length == 0) ? UpPostS.txtUpPost : UpPostS.txtUpPost2}>Đăng bài</Text>
                    )}
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
                    {loading && <ActivityIndicator size="large" color="#0000ff" />}
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

                    <TouchableOpacity style={UpPostS.btnIcon} onPress={() => setModalVisibleAI(true)}>
                        <View style={UpPostS.boxItems}>
                            <Image
                                style={{ width: 25, height: 25 }}
                                source={require('../../../assets/images/ai.png')}
                            />
                            {
                                Flag == true ? <Text></Text> : <Text style={UpPostS.txtIcon}>Tạo ảnh bằng AI</Text>
                            }
                        </View>
                    </TouchableOpacity>
                    {
                        Flag == true ? <View></View> : <View style={UpPostS.line}></View>
                    }
                </View>
            </View>
            {/* Modal để hiển thị danh sách */}


            {loadingUpload && (
                <View style={{ position: 'absolute', top: '50%', left: '50%', marginLeft: -25, marginTop: -25 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}

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
                        <View style={UpPostS.modalContainerTag}>
                            <View >
                                <View style={{ flexDirection: 'column' }}>
                                    {/* <Image source={{ uri: me?.avatar }} style={UpPostS.avatar} /> */}
                                    {/* <View style={{ marginLeft: 10 }}> */}
                                    {/* <Text style={UpPostS.name}>{me?.first_name + " " + me?.last_name}</Text> */}
                                    <View style={UpPostS.boxTag}>
                                        <View style={UpPostS.search}>
                                            <TouchableOpacity>
                                                <Icon name="search-outline" size={30} color='black' />
                                            </TouchableOpacity>
                                            <TextInput
                                                placeholder='Tìm kiếm'
                                                placeholderTextColor={'black'}
                                                value={searchQuery}
                                                onChangeText={setSearchQuery}
                                                style={{ color: 'black' }} />
                                        </View>
                                        <TouchableOpacity style={UpPostS.btnTag} onPress={() => handleAddTag()}>
                                            <Text style={UpPostS.tag}>
                                                Gắn thẻ
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={filtered}
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
                                        showsVerticalScrollIndicator={false}
                                    />
                                    {/* </View> */}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            {/* Modal AI */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisibleAI}
                onRequestClose={() => setModalVisibleAI(false)}
            >
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={() => setModalVisibleAI(false)}
                >
                    <View style={styles.modalContainer}>
                        <Text style={styles.title}>Nhập mô tả</Text>

                        {/* Ô nhập liệu */}
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập nội dung..."
                            placeholderTextColor={'black'}
                            value={prompt}
                            onChangeText={setPrompt}
                        />

                        {/* Nút gửi */}
                        {/* <TouchableOpacity title="Gửi" onPress={() => {
              console.log("Nội dung nhập:", inputValue);
              setModalVisible(false);
            }} /> */}
                        <TouchableOpacity style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10 }} onPress={() => { generateImage(), setModalVisibleAI(false) }}>
                            <Text style={{ color: 'white' }}>Tạo ảnh</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    )
}

export default UpPost

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        color: 'black',
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        color: "black",
    },
    container: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền bán trong suốt
        borderRadius: 12,
        padding: 2,
        zIndex: 1, // Đảm bảo nút nằm trên media
    },
});