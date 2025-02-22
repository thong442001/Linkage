import React, { useEffect, useState } from "react";
import { 
  View, 
  Image, 
  StyleSheet, 
  ActivityIndicator, 
  Alert 
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import axios from "axios";
import { oStackHome } from "../../navigations/HomeNavigation";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddbolgs7p/upload'; 
const UPLOAD_PRESET = 'ml_default'; 

const PostStory = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    onOpenGallery();
  }, []);

  const onOpenGallery = async () => {
    const options = {
      mediaType: 'photo', 
      quality: 1,
      selectionLimit: 1, 
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log("Đã hủy chọn ảnh");
        navigation.goBack(); // Quay lại nếu không chọn ảnh
      } else if (response.errorMessage) {
        Alert.alert("Lỗi", "Không thể mở thư viện ảnh!");
        navigation.goBack();
      } else {
        const selectedFile = response.assets[0];
        setSelectedImage(selectedFile.uri);
        await uploadToCloudinary(selectedFile.uri);
      }
    });
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
      console.log("Ảnh đã tải lên:", imageUrl);
      postStory(imageUrl);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tải ảnh lên, vui lòng thử lại!");
      console.error("Lỗi upload:", error);
    } finally {
      setLoading(false);
    }
  };

  const postStory = (imageUrl) => {
    navigation.replace(oStackHome.Story.name, { newStory: imageUrl });
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {selectedImage && !loading && <Image source={{ uri: selectedImage }} style={styles.image} />}
    </View>
  );
};

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
});

export default PostStory;
