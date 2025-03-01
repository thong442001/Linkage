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
} from 'react-native';
import { addPost } from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';

import axios from "axios";
import { TextInput } from 'react-native-gesture-handler';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddbolgs7p/upload';
const UPLOAD_PRESET = 'ml_default';

const { width, height } = Dimensions.get('window');

const Story = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [previewImage, setPreviewImage] = useState(null); // Ảnh hiển thị trước khi upload
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null); // Link ảnh sau khi upload
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState('Nhập text...');
  const [showText, setShowText] = useState(false);
  const [scale, setScale] = useState(new Animated.Value(1));

  const pan = useRef(new Animated.ValueXY()).current;


  const [stories, setStories] = useState([]);
  const [medias, setMedias] = useState([]);
  const [typePost, setTypePost] = useState('Story');
  const me = useSelector(state => state.app.user);
  
  // Quản lý trạng thái của quyền riêng tư
  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: 'Công khai'
  });
  const [modalVisible, setModalVisible] = useState(false);

  const statusOptions = [
    { status: 1, name: 'Công khai' },
    { status: 2, name: 'Bạn bè' },
    { status: 3, name: 'Chỉ mình tôi' },
  ];

    // Gesture xử lý kéo/thả
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        ),
        onPanResponderRelease: () => {
          pan.flattenOffset();
        },
      })
    ).current;  

useEffect(() => {
    if (route.params?.newStory) {
      setPreviewImage(route.params.newStory);
    }
  }, [route.params?.newStory]);

  const callAddPost = async () => {
    if (!previewImage) {
      console.log('Chưa có ảnh');
      return;
    }

    try {
      const uploadedUrl = await uploadToCloudinary(previewImage);
      if (!uploadedUrl) {
        console.log('Lỗi khi upload ảnh');
        return;
      }

      const paramsAPI = {
        ID_user: me._id,
        caption: '',
        medias: [uploadedUrl], 
        status: selectedOption.name,
        type: typePost,
        ID_post_shared: null,
        tags: [],
      };

      await dispatch(addPost(paramsAPI)).unwrap();
      navigation.navigate(oStackHome.TabHome.name);
    } catch (error) {
      console.log('Lỗi đăng bài:', error);
    }
  };
  
  const uploadToCloudinary = async (imageUri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = response.data.secure_url;
      setUploadedImageUrl(imageUrl);
      console.log("Ảnh đã tải lên:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error("Lỗi upload:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
      {previewImage ? (
          <Image source={{ uri: previewImage }} style={styles.image} />
        ) : (
          <Text style={{ color: 'white', fontSize: 16 }}>Chưa có ảnh</Text>
        )}

          {/* Nút thêm Text */}
      <TouchableOpacity
        style={styles.addTextButton}
        onPress={() => setShowText(true)}
      >
        <Text style={{ color: 'white' }}>Thêm Text</Text>
      </TouchableOpacity>

      {/* Text có thể kéo thả và thu phóng */}
      {showText && (
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.draggableTextContainer,
            { transform: [...pan.getTranslateTransform(), { scale }] },
          ]}
        >
          <TextInput
            style={styles.draggableText}
            onChangeText={setText}
            value={text}
            placeholder="Nhập text..."
            placeholderTextColor="white"
          />
        </Animated.View>
      )}
        {/* Avatar & Nút Thoát */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: me?.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{me?.first_name} {me?.last_name}</Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Chọn Quyền Riêng Tư */}
        <TouchableOpacity style={styles.privacyButton} onPress={() => setModalVisible(true)}>
          <Icon name="lock-closed" size={20} color="white" />
          <Text style={styles.privacyText}>{selectedOption.name}</Text>
        </TouchableOpacity>

        {/* Nút Đăng Story */}
        <TouchableOpacity style={styles.postButton} onPress={callAddPost} disabled={loading}>
          <Text style={styles.postText}>{loading ? 'Đang đăng...' : 'Đăng'}</Text>
        </TouchableOpacity>

        {/* Modal Chọn Quyền Riêng Tư */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
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
                    {selectedOption.status === item.status && <Icon name="checkmark" size={20} color="blue" />}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-start', alignItems: 'center', paddingTop: StatusBar.currentHeight || 0 },
  image: { width, height, resizeMode: 'cover' },
  headerContainer: { position: 'absolute', top: 30, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userInfoContainer: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  username: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  exitButton: { padding: 8, borderRadius: 20 },
  exitText: { fontSize: 20, color: 'white' },
  privacyButton: { position: 'absolute', bottom: 90, left: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20 },
  privacyText: { color: 'white', marginLeft: 10, fontSize: 14 },
  postButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#71AFD8', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  postText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  optionItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  optionText: { fontSize: 16 },
  addTextButton: { position: 'absolute', bottom: 30, left: 20, backgroundColor: '#007AFF', padding: 10, borderRadius: 10 },
  draggableTextContainer: { position: 'absolute', top: height / 3, left: width / 4, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 10 },
  draggableText: { color: 'white', fontSize: 20 },
});

export default Story;
