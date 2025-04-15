import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Modal,
  FlatList,
  PanResponder,
  Alert,
} from 'react-native';
import { addPost, searchYouTubeMusic } from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';
import { launchCamera } from "react-native-image-picker";
import axios from 'axios';
import { TextInput } from 'react-native-gesture-handler';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddasyg5z3/upload';
const UPLOAD_PRESET = 'ml_default';

const { width, height } = Dimensions.get('window');

const Story = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [previewMedia, setPreviewMedia] = useState(null);
  const [mediaType, setMediaType] = useState('photo');
  const [uploadedMediaUrl, setUploadedMediaUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPosted, setIsPosted] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false); // State để hiển thị StoriesModal
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);
  const [scale] = useState(new Animated.Value(1));
  const pan = useRef(new Animated.ValueXY()).current;

  const me = useSelector(state => state.app.user);
  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: 'Công khai',
  });
  const [modalVisible, setModalVisible] = useState(false);

  const statusOptions = [
    { status: 1, name: 'Công khai' },
    { status: 2, name: 'Bạn bè' },
    { status: 3, name: 'Chỉ mình tôi' },
  ];

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'mixed',
        quality: 1,
        videoQuality: 'high',
        durationLimit: 10,
      },
      (response) => {
        if (response.didCancel) {
          setErrorMessage('Bạn đã hủy chụp');
          setShowFailedModal(true);
          setTimeout(() => setShowFailedModal(false), 1500);
        } else if (response.errorCode) {
          setErrorMessage(`Lỗi khi mở camera: ${response.errorMessage}`);
          setShowFailedModal(true);
          setTimeout(() => setShowFailedModal(false), 1500);
        } else if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];
          setPreviewMedia(asset.uri);
          setMediaType(asset.type.includes('video') ? 'video' : 'photo');
        }
      }
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({ x: pan.x._value, y: pan.y._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
      },
    })
  ).current;

  useEffect(() => {
    if (route.params?.newStory && route.params?.mediaType) {
      setPreviewMedia(route.params.newStory);
      setMediaType(route.params.mediaType);
    }
  }, [route.params?.newStory, route.params?.mediaType]);

  const callAddPost = async () => {
    if (!previewMedia) {
      setErrorMessage('Vui lòng chọn media trước khi đăng!');
      setShowFailedModal(true);
      setTimeout(() => setShowFailedModal(false), 1500);
      return;
    }

    if (isPosted) {
      return;
    }

    setLoading(true);
    try {
      const uploadedUrl = await uploadToCloudinary(previewMedia);
      if (!uploadedUrl) {
        setErrorMessage('Không thể tải media!');
        setShowFailedModal(true);
        setTimeout(() => setShowFailedModal(false), 2000);
        return;
      }

      const paramsAPI = {
        ID_user: me._id,
        caption: text,
        medias: [uploadedUrl],
        status: selectedOption.name,
        type: 'Story',
        mediaType: mediaType,
        ID_post_shared: null,
        tags: [],
      };

      await dispatch(addPost(paramsAPI)).unwrap();
      setIsPosted(true);

      // Hiển thị StoriesModal khi đăng thành công
      setShowSuccessModal(true);

      // Tự động ẩn StoriesModal sau 2 giây và điều hướng về TabHome
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.replace(oStackHome.TabHome.name);
      }, 2000);

    } catch (error) {
      setErrorMessage('Đăng bài thất bại. Vui lòng thử lại!');
      setShowFailedModal(true);
      setTimeout(() => setShowFailedModal(false), 2000);
      console.log("Lỗi đăng bài:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadToCloudinary = async (mediaUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: mediaUri,
      type: mediaType === 'photo' ? 'image/jpeg' : 'video/mp4',
      name: mediaType === 'photo' ? 'upload.jpg' : 'upload.mp4',
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const mediaUrl = response.data.secure_url;
      setUploadedMediaUrl(mediaUrl);
      console.log(`${mediaType === 'photo' ? 'Ảnh' : 'Video'} đã tải lên:`, mediaUrl);
      return mediaUrl;
    } catch (error) {
      console.log('Lỗi upload:', error);
      return null;
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        {previewMedia ? (
          mediaType === 'photo' ? (
            <Image source={{ uri: previewMedia }} style={styles.image} />
          ) : (
            <Video
              source={{ uri: previewMedia }}
              style={styles.image}
              resizeMode="cover"
              paused={true}
            />
          )
        ) : (
          <Text style={{ color: 'white', fontSize: 16 }}>Chưa có media</Text>
        )}

        {showText && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.draggableTextContainer,
              { transform: pan.getTranslateTransform() },
            ]}>
            <TextInput
              style={styles.draggableText}
              onChangeText={setText}
              value={text}
              placeholder="Nhập văn bản..."
              placeholderTextColor="white"
            />
          </Animated.View>
        )}

        {/* <TouchableOpacity
          style={styles.addTextButton}
          onPress={() => setShowText(true)}>
          <Text style={{ color: 'white' }}>Thêm Text</Text>
        </TouchableOpacity> */}

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: me?.avatar }} style={styles.avatar} />
            <Text style={styles.username}>
              {me?.first_name} {me?.last_name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Icon name="close-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="lock-closed" size={20} color="white" />
          <Text style={styles.privacyText}>{selectedOption.name}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.CameraBtn} onPress={openCamera}>
          <Icon name="camera" size={24} color="white" />
          <Text style={{ color: 'white', marginLeft: 5 }}>Chụp media</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.postButton,
            (loading || isPosted) && styles.disabledButton,
          ]}
          onPress={callAddPost}
          disabled={loading || isPosted}
        >
          <Text style={styles.postText}>
            {loading ? 'Đang đăng...' : isPosted ? 'Đã đăng' : 'Đăng'}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn quyền riêng tư</Text>
              <FlatList
                data={statusOptions}
                keyExtractor={item => item.status.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.optionItem}
                    onPress={() => {
                      setSelectedOption(item);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.optionText}>{item.name}</Text>
                    {selectedOption.status === item.status && (
                      <Icon name="checkmark" size={20} color="blue" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>

        {/* Success Modal */}
        {showSuccessModal && <SuccessModal message={'Đăng story thành công'} />}

        {/* Failed Modal */}
        {showFailedModal && <FailedModal message={errorMessage} />}

      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  image: {
    width: width * 0.8, // Thu nhỏ chiều rộng xuống 80% kích thước màn hình
    height: height * 0.8,
    aspectRatio: 1, // Giữ tỷ lệ ảnh (có thể thay đổi tùy theo tỷ lệ thực tế của ảnh)
    marginTop: 30,
    resizeMode: 'contain', // Đảm bảo ảnh không bị cắt, thay vì 'cover'
  },
  headerContainer: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  exitButton: { padding: 8, borderRadius: 20 },
  exitText: { fontSize: 20, color: 'white' },
  privacyButton: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  CameraBtn: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  privacyText: { color: 'white', marginLeft: 10, fontSize: 14 },
  postButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#71AFD8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
    opacity: 0.7,
  },
  postText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, olor: 'black' },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: { fontSize: 16, color: 'black' },
  addTextButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  draggableTextContainer: {
    position: 'absolute',
    top: height / 3,
    left: width / 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 10,
  },
  draggableText: { color: 'white', fontSize: 20 },
});

export default Story;