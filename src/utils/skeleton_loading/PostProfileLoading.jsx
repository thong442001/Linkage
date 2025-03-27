import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window');

const PostProfileLoading = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="#E0E0E0" // Màu nền giống HomeLoading
      highlightColor="#F5F5F5" // Màu nhấp nháy giống HomeLoading
    >
      <View style={HomeS.postBox}>
        <View style={HomeS.postHeader}>
          <View style={HomeS.postAvatar} />
          <View style={HomeS.postInfo}>
            <View style={HomeS.namePlaceholder} />
            <View style={HomeS.timePlaceholder} />
          </View>
        </View>

        <View style={HomeS.imageGrid}>
          <View style={HomeS.postImage} />
        </View>

        <View style={HomeS.postHeader}>
          <View style={HomeS.postAvatar} />
          <View style={HomeS.postInfo}>
            <View style={HomeS.namePlaceholder} />
            <View style={HomeS.timePlaceholder} />
          </View>
        </View>
        <View style={HomeS.imageGrid}>
          <View style={HomeS.postImage} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};


export default PostProfileLoading;

const HomeS = StyleSheet.create({
  container: {
    padding: 10,
    top: 30,
  },
  postBox: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  postHeader: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
    backgroundColor: '#E0E0E0', 
  },
  postInfo: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  namePlaceholder: {
    width: width * 0.25,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // Đảm bảo màu nền khớp với SkeletonPlaceholder
  },
  timePlaceholder: {
    width: width * 0.15,
    height: 12,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // Đảm bảo màu nền khớp với SkeletonPlaceholder
    marginTop: 5,
  },
  imageGrid: {
    flexDirection: 'column',
  },
  postImage: {
    width: '100%',
    height: height * 0.2,
    borderRadius: 8,
    backgroundColor: '#E0E0E0', // Đảm bảo màu nền khớp với SkeletonPlaceholder
  },
  story: {
    flexDirection: 'row',
    marginVertical: 9,
    marginHorizontal: 10,
  },
  imageStory: {
    width: width * 0.28,
    height: height * 0.22,
    borderRadius: 10,
  },
  backGround: {
    backgroundColor: '#fff',
    height: height * 0.07,
    width: '100%',
    position: 'absolute',
    bottom: -0.1,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    alignItems: 'center',
  },
  boxStory: {
    borderColor: '#D9D9D9',
    borderRadius: 11,
  },
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  image: {
    marginHorizontal: 10,
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
});