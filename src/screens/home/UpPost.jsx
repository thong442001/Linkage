import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    Modal,
} from 'react-native';
import React, { useState } from 'react';
import UpPostS from '../../styles/screens/home/UpPostS';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import {
    addPost,
} from '../../rtk/API';
const UpPost = (props) => {
    const { navigation } = props;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState({
        status: 1,
        name: "Công khai"
    });
    const [caption, setCaption] = useState('');
    const [medias, setMedias] = useState([]);

    const [tags, setTags] = useState([]);

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

    //up lên cloudiary
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
            //console.log(file.type.type);
            const fileUrl = response.data.secure_url;
            console.log('🌍 Link file Cloudinary:', fileUrl);
            setMedias((prev) => [...prev, fileUrl]);

        } catch (error) {
            console.log('uploadFile -> ', error.response ? error.response.data : error.message);
            console.log("lỗi khi tải file")
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
                    console.log('📂 File đã chọn:', selectedFile.uri);

                    await uploadFile(selectedFile);
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
                ID_post_shared: null,
                tags: tags,
            }
            console.log(paramsAPI);
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
                    style={UpPostS.btnPost}
                    onPress={callAddPost}
                >
                    <Text style={UpPostS.txtUpPost}>Đăng bài</Text>
                </TouchableOpacity>
            </View>
            <View style={UpPostS.line}></View>
            <View style={[UpPostS.boxMargin, { flex: 1 }]}>
                <View style={UpPostS.boxInfor}>
                    <Image style={UpPostS.avatar}
                        source={require("../../../assets/images/person.jpg")}
                    />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={UpPostS.txtName}>Kenny</Text>
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
                    />
                </View>
            </View>
            <View style={UpPostS.boxItems2}>
                <View >
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity
                        style={UpPostS.btnIcon}
                        onPress={onOpenGallery}
                    >
                        <View style={UpPostS.boxItems}>
                            <Icon name="image-outline" size={30} color="#33a850" />
                            <Text style={UpPostS.txtIcon}>Ảnh/video</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="pricetag" size={30} color="#48a1ff" />
                            <Text style={UpPostS.txtIcon}>Gắn thẻ</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                    {/* <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="happy-outline" size={30} color="#f9dd25" />
                            <Text style={UpPostS.txtIcon}>Cảm xúc</Text>
                        </View>

                    </TouchableOpacity> */}
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="videocam-outline" size={30} color="#fcb13c" />
                            <Text style={UpPostS.txtIcon}>Video trực tiếp</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                </View>
            </View>
            {/* Modal để hiển thị danh sách */}
            < Modal
                transparent={true}  // Cho phép nền của modal trong suốt, giúp nhìn thấy nền bên dưới modal.
                visible={modalVisible}  // Điều khiển việc modal có hiển thị hay không dựa trên trạng thái `modalVisible`.
                animationType="slide"  // Hiệu ứng khi modal xuất hiện. Ở đây là kiểu "slide" từ dưới lên.
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
        </View>
    )
}

export default UpPost
