import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { useDispatch } from 'react-redux';
import { deletePost } from '../../rtk/API';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const { width, height } = Dimensions.get('window');
const emojis = ['😍', '😂', '❤️', '🔥', '😮', '😢'];

const Story = () => {
  const route = useRoute();
  const { StoryView, currentUserId, onDeleteStory } = route.params || {};
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [videoDuration, setVideoDuration] = useState(5000);
  const [stories, setStories] = useState(StoryView?.stories || []);
  const emojiScale = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const progressBars = useRef([]);

  // Đồng bộ progressBars với stories
  useEffect(() => {
    progressBars.current = stories.map(() => new Animated.Value(0));
  }, [stories]);

  const isVideo = (media) => {
    return media?.toLowerCase().endsWith('.mp4') || stories[currentIndex]?.type === 'video';
  };

  const startProgress = (index) => {
    if (!stories[index] || !progressBars.current[index]) return; // Kiểm tra an toàn
    progressBars.current[index].setValue(0);
    const duration = isVideo(stories[index].medias[0]) ? videoDuration : 5000;

    Animated.timing(progressBars.current[index], {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && !isVideo(stories[index].medias[0])) {
        handleNextStory();
      }
    });
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < stories.length) {
      startProgress(currentIndex);
    }
  }, [currentIndex, videoDuration, stories]);

  const handleNextStory = () => {
    if (currentIndex + 1 < stories.length) {
      progressBars.current[currentIndex]?.setValue(1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedEmoji(null);
      setVideoDuration(5000);
    } else {
      navigation.goBack();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      progressBars.current[currentIndex]?.setValue(0);
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setSelectedEmoji(null);
      setVideoDuration(5000);
    }
  };

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
    if (locationX < width / 2) {
      handlePrevStory();
    } else {
      handleNextStory();
    }
  };

  const handleSelectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    emojiScale.setValue(1);
    Animated.sequence([
      Animated.timing(emojiScale, {
        toValue: 1.5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const onVideoLoad = (data) => {
    if (data.duration) {
      setVideoDuration(data.duration * 1000);
    }
  };

  const onVideoEnd = () => {
    handleNextStory();
  };

  const callDeleteStory = async (ID_story) => {
    try {
      await dispatch(deletePost({ _id: ID_story }))
        .unwrap()
        .then(response => {
          console.log('Xóa story vĩnh viễn thành công:', response);
          const newStories = stories.filter(story => story._id !== ID_story);
          setStories(newStories);
          if (onDeleteStory) {
            onDeleteStory(ID_story);
          }
          // Điều chỉnh currentIndex nếu cần
          if (currentIndex >= newStories.length && currentIndex > 0) {
            setCurrentIndex(newStories.length - 1);
          }
        })
        .catch(error => {
          console.log('Lỗi khi xóa story:', error);
          throw error;
        });
    } catch (error) {
      console.log('Lỗi trong callDeleteStory:', error);
      throw error;
    }
  };

  const handleDeleteStory = () => {
    if (currentUserId !== StoryView.user._id) {
      Alert.alert("Thông báo", "Bạn chỉ có thể xóa story của chính mình!");
      return;
    }

    Alert.alert(
      "Xác nhận",
      "Bạn có chắc muốn xóa vĩnh viễn story này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          onPress: async () => {
            try {
              const storyId = stories[currentIndex]._id;
              await callDeleteStory(storyId);
              Alert.alert("Thành công", "Story đã được xóa vĩnh viễn!");
              navigation.replace(oStackHome.TabHome.name, { isDeleted: true, deletedStoryId: storyId });
            }
               catch (error) {
              Alert.alert("Lỗi", "Không thể xóa story. Vui lòng thử lại!");
              console.error("Lỗi xóa story:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  if (!StoryView || !stories || stories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Không có dữ liệu Story</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressBars.current[index]?.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }) || '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        {isVideo(stories[currentIndex]?.medias[0]) ? (
          <Video
            ref={videoRef}
            source={{ uri: stories[currentIndex]?.medias[0] }}
            style={styles.image}
            resizeMode="cover"
            onLoad={onVideoLoad}
            onEnd={onVideoEnd}
            repeat={false}
          />
        ) : (
          <Image
            source={{ uri: stories[currentIndex]?.medias[0] }}
            style={styles.image}
          />
        )}

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: StoryView.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>
              {StoryView.user.first_name + ' ' + StoryView.user.last_name}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
      {currentUserId === StoryView.user._id && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteStory}>
          <Icon name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <Icon name="close-outline" size={30} color="white" />
      </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emojiContainer}>
          {emojis.map((emoji, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectEmoji(emoji)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedEmoji && (
          <Animated.View
            style={[styles.selectedEmojiContainer, { transform: [{ scale: emojiScale }] }]}
          >
            <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
          </Animated.View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 15,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressBarBackground: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#fff',
  },
  image: {
    width,
    height,
    resizeMode: 'cover',
  },
  headerContainer: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    padding: 8,
    borderRadius: 20,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  exitText: {
    fontSize: 20,
    color: 'white',
  },
  deleteText: {
    fontSize: 20,
    color: 'white',
  },
  emojiContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  emoji: {
    fontSize: 30,
    marginHorizontal: 10,
    color: '#fff',
  },
  selectedEmojiContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
  },
  selectedEmoji: {
    fontSize: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
});

export default Story;