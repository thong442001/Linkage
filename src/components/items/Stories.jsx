import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import { oStackHome } from '../../navigations/HomeNavigation';
import { useNavigation } from '@react-navigation/native';
const Stories = ({StoryPost}) => {
  console.log('Props received in Stories:', StoryPost.user._id); // Kiểm tra props nhận được

  const navigation = useNavigation();
  // if (!StoryPost) return null; // Kiểm tra nếu stories không tồn tại

  const allMedias = StoryPost.stories.flatMap(story => story.medias);
  // console.log("Danh sách ảnh từ tất cả stories:", allMedias);

  const firstImages = StoryPost.stories.map(story => story.medias?.[0] || null);
  // console.log("firstImage:", firstImages); // Kiểm tra props nhận được

  return (
    <TouchableOpacity
      style={styles.boxStory}
      onPress={() => navigation.navigate(oStackHome.StoryViewer.name, {StoryView: StoryPost , currentUserId: StoryPost.user._id})}>
      <Image style={styles.imageStories} source={{uri: firstImages[0]}} />

      <Image
        style={styles.avataStories}
        source={{uri: StoryPost.user.avatar}}
      />
      <View style={styles.backGround}></View>
      <Text style={styles.name}>
        {StoryPost?.user?.first_name + ' ' + StoryPost?.user?.last_name}
      </Text>
    </TouchableOpacity>
  );
};
export default Stories;

const styles = StyleSheet.create({
  boxStory: {
    marginLeft: 10,
  },
  imageStories: {
    width: 123,
    height: 192,
    borderRadius: 10,
  },
  avataStories: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1190FF',
    position: 'absolute',
    left: 8,
    top: 7,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 9,
    left: 8,
  },
  backGround: {
    width: 123,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.1)',
    position: 'absolute',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    bottom: 0,
  },
  selectedBorder: {
    borderColor: 'gray', // Viền xám khi được chọn
  },
});
