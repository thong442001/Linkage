import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { memo } from 'react';
import { oStackHome } from '../../navigations/HomeNavigation';
import { useNavigation } from '@react-navigation/native';
import Video from 'react-native-video'; // Import react-native-video

const { width, height } = Dimensions.get('window');

const Stories = memo(({ StoryPost }) => {
  const navigation = useNavigation();

  // Kiểm tra nếu StoryPost không tồn tại
  if (!StoryPost || !StoryPost.stories || !StoryPost.user) return null;

  const allMedias = StoryPost.stories.flatMap(story => story.medias);
  const firstImages = StoryPost.stories.map(story => story.medias?.[0] || null);

  // Hàm kiểm tra xem media tại index 0 có phải là video không
  const isVideoAtIndex0 = () => {
    const firstStory = StoryPost.stories[0];
    return (
      firstStory?.mediaType === 'video' ||
      firstStory?.medias[0]?.toLowerCase().endsWith('.mp4')
    );
  };

  return (
    <TouchableOpacity
      style={styles.boxStory}
      onPress={() =>
        navigation.navigate(oStackHome.StoryViewer.name, {
          StoryView: StoryPost,
          currentUserId: StoryPost.user._id,
        })
      }>
      {isVideoAtIndex0() ? (
        <Video
          source={{ uri: firstImages[0] }}
          style={styles.imageStories}
          paused={true} // Dừng video để hiển thị frame đầu tiên
          resizeMode="cover"
          posterResizeMode="cover"
          muted={true} // Tắt âm thanh
        />
      ) : (
        <Image style={styles.imageStories} source={{ uri: firstImages[0] }} />
      )}

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
    marginLeft: width * 0.025,
  },
  imageStories: {
    width: width * 0.32,
    height: height * 0.25,
    borderRadius: width * 0.025,
  },
  avataStories: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.1 / 2,
    borderWidth: 2,
    borderColor: '#1190FF',
    position: 'absolute',
    left: width * 0.02,
    top: height * 0.01,
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
  selectedBorder: {
    borderColor: 'gray',
  },
});