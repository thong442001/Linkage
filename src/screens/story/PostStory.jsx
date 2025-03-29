import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import Video from 'react-native-video'; // Import Video từ react-native-video
import { launchImageLibrary } from 'react-native-image-picker';
import axios from "axios";
import { oStackHome } from "../../navigations/HomeNavigation";
import LoadingTron from "../../utils/animation/loadingTron/LoadingTron";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddbolgs7p/upload';
const UPLOAD_PRESET = 'ml_default';

const PostStory = ({ navigation }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'photo' or 'video'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    openMediaPicker();
  }, []);

  const openMediaPicker = () => {
    const options = {
      mediaType: 'mixed', // Allows both photos and videos
      quality: 1,
      includeBase64: false, // Remove base64 to handle videos better
      videoQuality: 'high',
      durationLimit: 30, // Limit video duration to 30 seconds
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("Đã hủy chọn media");
        navigation.goBack();
      } else if (response.errorMessage) {
        Alert.alert("Lỗi", "Không thể mở thư viện!");
      } else {
        const selectedFile = response.assets[0];
        // Determine if it's a video or photo based on file type
        const isVideo = selectedFile.type.includes('video');
        setMediaType(isVideo ? 'video' : 'photo');
        setSelectedMedia(selectedFile.uri);
        uploadToCloudinary(selectedFile.uri, isVideo ? 'video' : 'photo');
      }
    });
  };

  const uploadToCloudinary = async (mediaUri, type) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: mediaUri,
      type: type === 'photo' ? "image/jpeg" : "video/mp4",
      name: type === 'photo' ? "upload.jpg" : "upload.mp4",
    });
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const mediaUrl = response.data.secure_url;
      console.log(`${type === 'photo' ? 'Ảnh' : 'Video'} đã tải lên:`, mediaUrl);
      postStory(mediaUrl, type);
    } catch (error) {
      Alert.alert("Lỗi", `Không thể tải ${type === 'photo' ? 'ảnh' : 'video'} lên, vui lòng thử lại!`);
      console.error("Lỗi upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const postStory = (mediaUrl, type) => {
    navigation.replace(oStackHome.Story.name, { 
      newStory: mediaUrl,
      mediaType: type 
    });
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingTron />}
      
      {selectedMedia && !loading && (
        mediaType === 'photo' ? (
          <Image source={{ uri: selectedMedia }} style={styles.image} />
        ) : (
          <Video
            source={{ uri: selectedMedia }}
            style={styles.video}
            controls={true}
            resizeMode="contain"
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 400,
    marginVertical: 20,
  },
  video: {
    width: 300,
    height: 400,
    marginVertical: 20,
  },
});

export default PostStory;