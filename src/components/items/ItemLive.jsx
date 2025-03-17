import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Fontisto';

const { width, height } = Dimensions.get('window');

const ItemLive = ({ user }) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity
    style={styles.boxStory}
      onPress={() => navigation.navigate('HomeLive', { 
        userID: user.userID, 
        userName: user.userName, 
        liveID: user.liveID,
        avatar: user.avatar,
      })}>



      <Image style={styles.avataStories} source={{ uri: user.avatar }} />
    <Image style={styles.imageStories} source={{ uri: 'https://media.istockphoto.com/id/1161264391/vector/live-show.jpg?s=612x612&w=0&k=20&c=TGrPRaS2Zx5TIBXz6mO4mg_fyJxqDxKsKhHPlEs-6jY=' }} />
    <View style={styles.backGround}></View>
    <Text style={styles.name}>
      {user.userName}
    </Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boxStory: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.035, // Bo góc theo tỷ lệ màn hình
    borderColor: 'red',
    borderWidth: 1.5,
    marginLeft: width * 0.025, // Khoảng cách 2.5% chiều rộng màn hình
  },
  imageStories: {
    resizeMode: 'cover',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.31, // 32% chiều rộng màn hình
    height: height * 0.25, // 24% chiều cao màn hình
    borderRadius: width * 0.025, // Bo góc theo tỷ lệ màn hình
  },
  avataStories: {
    width: width * 0.1, // 10% chiều rộng màn hình
    height: width * 0.1, // Vuông với chiều rộng
    borderRadius: width * 0.1 / 2, // Làm tròn avatar
    borderWidth: 2,
    zIndex: 1,
    borderColor: '#1190FF',
    position: 'absolute',
    left: width * 0.02,
    top: height * 0.01,
  },
  name: {
    fontWeight: 'bold',
    fontSize: width * 0.04, // 4% chiều rộng màn hình
    color: '#FFFFFF',
    position: 'absolute',
    bottom: height * 0.012,
    left: width * 0.02,
  },
  backGround: {
    width: width * 0.32, // Phù hợp với `imageStories`
    height: height * 0.05, // 5% chiều cao màn hình
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    borderBottomLeftRadius: width * 0.025,
    borderBottomRightRadius: width * 0.025,
    bottom: 0,
  },
  selectedBorder: {
    borderColor: 'gray', // Viền xám khi được chọn
  },
});

export default ItemLive;