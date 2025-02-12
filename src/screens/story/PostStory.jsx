import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, PermissionsAndroid, Platform } from "react-native";
import * as ImagePicker from "react-native-image-picker";
import { oStackHome } from "../../navigations/HomeNavigation";

const PostStory = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

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
    ImagePicker.launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.error && response.assets) {
        const imageUri = response.assets[0].uri;
        setSelectedImage(imageUri);
        postStory(imageUri); // Tự động đăng khi chọn ảnh
      } else {
        navigation.goBack(); // Nếu hủy chọn ảnh, quay lại trang trước
      }
    });
  };

  const postStory = (imageUri) => {
    navigation.replace(oStackHome.Story.name, { newStory: imageUri }); // Chuyển sang màn hình Story
  };

  return (
    <View style={styles.container}>
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
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
