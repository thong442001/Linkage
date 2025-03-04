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
import { addPost, searchYouTubeMusic } from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Video from 'react-native-video';

import axios from 'axios';
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

  const [text, setText] = useState('');
  const [showText, setShowText] = useState(false);
  const [scale, setScale] = useState(new Animated.Value(1));

  const pan = useRef(new Animated.ValueXY()).current;

  const [stories, setStories] = useState([]);
  const [medias, setMedias] = useState([]);
  const [typePost, setTypePost] = useState('Story');
  const me = useSelector(state => state.app.user);

  const [selectedSongUrl, setSelectedSongUrl] = useState(null);

  const [musicList, setMusicList] = useState([]);

  // Quản lý trạng thái của quyền riêng tư
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

  // Gesture xử lý kéo/thả
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
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

  const uploadToCloudinary = async imageUri => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = response.data.secure_url;
      setUploadedImageUrl(imageUrl);
      console.log('Ảnh đã tải lên:', imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Lỗi upload:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // const MusicPlayer = ({ songUrl }) => {
  //   const [paused, setPaused] = useState(false);
  //   console.log("🎶 Đang phát nhạc:", songUrl);

  //   return (
  //     <View>
  //       {songUrl && (
  //         <Video
  //           source={{ uri: songUrl }}
  //           audioOnly={true}
  //           controls={true}
  //           paused={paused}
  //           playInBackground={true}
  //           playWhenInactive={true}
  //           onError={(error) => console.error("❌ Lỗi phát nhạc:", error)}
  //           style={{ width: 0, height: 0 }}
  //         />
  //       )}
  //       {songUrl && (
  //         <TouchableOpacity onPress={() => setPaused(!paused)}>
  //           <Text style={{ color: "white" }}>{paused ? "▶️ Phát" : "⏸️ Dừng"}</Text>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   );
  // };


  // const searchYouTubeMusic = async (query) => {
  //   const API_KEY = "AIzaSyCFElZOCK_3MtbZzKOdT_oK0K0RgPKmcRc";
  //   try {
  //     console.log("🔎 Đang tìm kiếm:", query);

  //     const response = await axios.get(
  //       `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query} music&type=video&key=${API_KEY}`
  //     );

  //     console.log("📃 Kết quả YouTube API:", response.data.items);

  //     const videoId = response.data.items[0]?.id.videoId;
  //     if (videoId) {
  //       console.log("🎬 Video ID:", videoId);

  //       // Gửi yêu cầu tới Y2Mate để lấy link chuyển đổi
  //       const y2mateResponse = await axios.post(
  //         "https://www.y2mate.com/mates/analyzeV2/ajax",
  //         new URLSearchParams({
  //           k_query: `https://www.youtube.com/watch?v=${videoId}`,
  //           k_page: "home",
  //           hl: "en",
  //         }),
  //         { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  //       );

  //       console.log("📃 Phản hồi từ Y2Mate:", y2mateResponse.data);

  //       const audioUrl = `https://www.snappea.com/api/button/mp3/${videoId}`;
  //       if (audioUrl) {
  //         setSelectedSongUrl(audioUrl);
  //         console.log("🎵 Link MP3:", audioUrl);
  //       } else {
  //         alert("Không tìm thấy link MP3 từ Y2Mate");
  //       }
  //     } else {
  //       alert("Không tìm thấy bài hát trên YouTube");
  //     }
  //   } catch (error) {
  //     console.error("❌ Lỗi lấy nhạc YouTube:", error);
  //   }
  // };



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
          onPress={() => setShowText(true)}>
          <Text style={{ color: 'white' }}>Thêm Text</Text>
        </TouchableOpacity>

        {/* Text có thể kéo thả và thu phóng */}
        {showText && (
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.draggableTextContainer,
              { transform: pan.getTranslateTransform() },
            ]}
          >
            <TextInput
              style={styles.draggableText}
              onChangeText={setText}
              value={text}
              placeholder="Nhập văn bản..."
              placeholderTextColor="white"
            />
          </Animated.View>
        )}
        {/* Avatar & Nút Thoát */}
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
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Chọn Quyền Riêng Tư */}
        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => setModalVisible(true)}>
          <Icon name="lock-closed" size={20} color="white" />
          <Text style={styles.privacyText}>{selectedOption.name}</Text>
        </TouchableOpacity>

        {/* Nút Đăng Story */}
        <TouchableOpacity
          style={styles.postButton}
          onPress={callAddPost}
          disabled={loading}>
          <Text style={styles.postText}>
            {loading ? 'Đang đăng...' : 'Đăng'}
          </Text>
        </TouchableOpacity>

        {/* Modal Chọn Quyền Riêng Tư */}
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
        {/* <TouchableOpacity onPress={() => searchYouTubeMusic('bray')}>
          <Text style={styles.musicButton}>🎵 Chọn nhạc</Text>
        </TouchableOpacity>

        <Modal
          visible={musicList.length > 0}
          animationType="slide"
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={{color: 'white', fontSize: 18}}>
                🎵 Chọn bài hát
              </Text>
              <FlatList
                data={musicList}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.musicItem}
                    onPress={() => {
                      setSelectedSongUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");

                      setMusicList([]); // Đóng modal sau khi chọn
                    }}>
                    <Image
                      source={{uri: item.thumbnail}}
                      style={{width: 50, height: 50, marginRight: 10}}
                    />
                    <Text style={styles.musicText}>{item.title}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={() => setMusicList([])}>
                <Text style={{color: 'red', textAlign: 'center'}}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <MusicPlayer songUrl={selectedSongUrl} /> */}
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
  image: { width, height, resizeMode: 'cover' },
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

  musicButton: {
    position: 'absolute',
    bottom: 180,
    right: 20,
    backgroundColor: '#71AFD8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: { fontSize: 16 },
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
  draggableTextContainer: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
  },
  draggableText: {
    color: "white",
    fontSize: 18,
  },
});

export default Story;