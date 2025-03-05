import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { memo } from 'react';
import { oStackHome } from '../../navigations/HomeNavigation';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const Stories = memo(({ StoryPost }) => {

  // console.log('Props received in Stories:', StoryPost.user._id); // Kiểm tra props nhận được

  const navigation = useNavigation();
  // if (!StoryPost) return null; // Kiểm tra nếu stories không tồn tại

  const allMedias = StoryPost.stories.flatMap(story => story.medias);
  // console.log("Danh sách ảnh từ tất cả stories:", allMedias);

  const firstImages = StoryPost.stories.map(story => story.medias?.[0] || null);
  // console.log("firstImage:", firstImages); // Kiểm tra props nhận được

  return (
    <TouchableOpacity
      style={styles.boxStory}
      onPress={() => navigation.navigate(oStackHome.StoryViewer.name, { StoryView: StoryPost, currentUserId: StoryPost.user._id })}>
      <Image style={styles.imageStories} source={{ uri: firstImages[0] }} />

      <Image
        style={styles.avataStories}
        source={{ uri: StoryPost.user.avatar }}
      />
      <View style={styles.backGround}></View>
      <Text style={styles.name}>
        {StoryPost?.user?.first_name + ' ' + StoryPost?.user?.last_name}
      </Text>
    </TouchableOpacity>
  );
});
export default Stories;

const styles = StyleSheet.create({
  boxStory: {
    marginLeft: width * 0.025, // Khoảng cách 2.5% chiều rộng màn hình
  },
  imageStories: {
    width: width * 0.32, // 32% chiều rộng màn hình
    height: height * 0.25, // 24% chiều cao màn hình
    borderRadius: width * 0.025, // Bo góc theo tỷ lệ màn hình
  },
  avataStories: {
    width: width * 0.1, // 10% chiều rộng màn hình
    height: width * 0.1, // Vuông với chiều rộng
    borderRadius: width * 0.1 / 2, // Làm tròn avatar
    borderWidth: 2,
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
