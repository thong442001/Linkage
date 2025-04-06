import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Fontisto';
import { useSelector } from 'react-redux';
import LottieView from 'lottie-react-native'; // Import LottieView
const { width, height } = Dimensions.get('window');

const ItemLive = ({ user }) => {
  const navigation = useNavigation();
  const me = useSelector(state => state.app.user);

  return (
    <TouchableOpacity
      style={styles.boxStory}
      onPress={() =>
        navigation.navigate('AudienceScreen', {
          userID: me._id,
          userName: me.first_name + me.last_name,
          liveID: user.liveID,
        })
      }
    >
      {/* Hiển thị avataStories */}
      <View style={styles.avatarContainer}>
        <Image style={styles.avataStories} source={{ uri: user.avatar }} />
      </View>

      {/* Bao bọc imageStories và LottieView để căn giữa animation */}
      <View style={styles.imageContainer}>
        <Image
          style={styles.imageStories}
          source={{
            uri: user.avatar,
          }}
        />
        <LottieView
          source={require('../../utils/animation/live/live.json')}
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>

      <View style={styles.backGround} />
      <Text style={styles.name}>{user.userName}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boxStory: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width * 0.035,
    borderColor: 'red',
    borderWidth: 1.5,
    marginLeft: width * 0.025,
    overflow: 'hidden', // Thêm overflow: 'hidden' để cắt bỏ phần tràn ra ngoài borderRadius
  },
  imageContainer: {
    position: 'relative',
    width: width * 0.31,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStories: {
    resizeMode: 'cover',
    width: width * 0.31,
    height: height * 0.25,
    borderRadius: width * 0.035, // Đảm bảo imageStories cũng có borderRadius giống boxStory
    position: 'absolute',
  },
  avatarContainer: {
    position: 'absolute',
    left: width * 0.02,
    top: height * 0.01,
    width: width * 0.1,
    height: width * 0.1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  avataStories: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.1 / 2,
    borderWidth: 2,
    borderColor: '#1190FF',
    position: 'absolute',
  },
  name: {
    fontWeight: 'bold',
    fontSize: width * 0.04,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: height * 0.012,
    left: width * 0.02,
  },
  backGround: {
    width: width * 0.32,
    height: height * 0.05,
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    borderBottomLeftRadius: width * 0.025,
    borderBottomRightRadius: width * 0.025,
    bottom: 0,
  },
  lottieAnimation: {
    width: width * 0.25,
    height: width * 0.25,
  },
  selectedBorder: {
    borderColor: 'gray',
  },
});

export default ItemLive;