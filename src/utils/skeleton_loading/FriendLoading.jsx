import { Dimensions, StyleSheet, View } from 'react-native';
import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width, height } = Dimensions.get('window');

const FriendLoading = () => {
  return (
    <SkeletonPlaceholder
      backgroundColor="#E0E0E0" // Đồng bộ với ProfileLoading
      highlightColor="#F5F5F5" // Đồng bộ với ProfileLoading
    >
      <View style={HomeS.postBox}>
        <View style={HomeS.postHeader}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginHorizontal: 20,
            }}
          >
            <View style={HomeS.postInfo}>
              <View style={HomeS.namePlaceholder} />
              <View style={HomeS.timePlaceholder} />
            </View>
            <View style={HomeS.postInfo}>
              <View style={HomeS.timePlaceholder1} />
            </View>
          </View>
        </View>

        <View style={HomeS.imageGrid}>
          <View style={HomeS.postImage} />
          <View style={HomeS.postImage} />
          <View style={HomeS.postImage} />
        </View>
        <View style={HomeS.imageGrid}>
          <View style={HomeS.postImage} />
          <View style={HomeS.postImage} />
          <View style={HomeS.postImage} />
        </View>
      </View>
    </SkeletonPlaceholder>
  );
};

export default FriendLoading;

const HomeS = StyleSheet.create({
  container: {
    padding: 10,
    top: 30,
  },
  postBox: {
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
    backgroundColor: '#E0E0E0', // Đã khớp với ProfileLoading
  },
  postInfo: {
    justifyContent: 'center',
  },
  namePlaceholder: {
    width: width * 0.15,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // Đã khớp với ProfileLoading
  },
  timePlaceholder1: {
    width: width * 0.30,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // Đã khớp với ProfileLoading
    marginTop: 5,
  },
  timePlaceholder: {
    width: width * 0.20,
    height: 15,
    borderRadius: 4,
    backgroundColor: '#E0E0E0', // Đã khớp với ProfileLoading
    marginTop: 5,
  },
  imageGrid: {
    margin: '1%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  postImage: {
    width: 90,
    height: 88,
    margin: 5,
    borderRadius: 8,
    backgroundColor: '#E0E0E0', // Đã khớp với ProfileLoading
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