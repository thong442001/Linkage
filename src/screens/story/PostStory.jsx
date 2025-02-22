import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, PermissionsAndroid, Platform, ActivityIndicator, Alert } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import axios from "axios";
import { oStackHome } from "../../navigations/HomeNavigation";

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/ddbolgs7p/upload'; // Thay <your-cloud-name> bằng tên Cloudinary của bạn
const UPLOAD_PRESET = 'ml_default'; // Thay bằng upload preset đã cấu hình trên Cloudinary

const PostStory = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    pickImage(); // Khi mở trang, tự động chọn ảnh
  }, []);

  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn("Lỗi cấp quyền:", err);
        return false;
      }
    }
    return true; // iOS không cần xin quyền
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      alert("Bạn cần cấp quyền để truy cập thư viện ảnh!");
      return;
    }
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, async (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        await uploadToCloudinary(imageUri);
      } else {
        navigation.goBack(); // Nếu hủy chọn ảnh, quay lại trang trước
      }
    });
  };

  const uploadToCloudinary = async (imageUri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg", // Hoặc có thể là 'image/png'
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
    navigation.replace(oStackHome.Story.name, { newStory: imageUrl }); // Chuyển sang màn hình Story với URL ảnh
  };

  return (
    <View style={styles.container}>
      {loading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
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
