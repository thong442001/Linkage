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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
const emojis = ['😍', '😂', '❤️', '🔥', '😮', '😢'];

const Story = () => {
  const route = useRoute();
  const { StoryView, currentUserId } = route.params || {};
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const emojiScale = useRef(new Animated.Value(1)).current; // Giá trị scale ban đầu

  const progressBars = useRef(StoryView.stories.map(() => new Animated.Value(0))).current;

  if (!StoryView || !StoryView.stories || StoryView.stories.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'white' }}>Không có dữ liệu Story</Text>
      </View>
    );
  }

  const startProgress = (index) => {
    progressBars[index].setValue(0);
    Animated.timing(progressBars[index], {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) handleNextStory();
    });
  };

  useEffect(() => {
    startProgress(currentIndex);
  }, [currentIndex]);

  const handleNextStory = () => {
    if (currentIndex + 1 < StoryView.stories.length) {
      progressBars[currentIndex].setValue(1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedEmoji(null); // Reset emoji khi chuyển story
    } else {
      navigation.goBack();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      progressBars[currentIndex].setValue(0);
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setSelectedEmoji(null); // Reset emoji khi chuyển story
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

  // Xử lý chọn emoji và thêm hiệu ứng nảy lên
  const handleSelectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    emojiScale.setValue(1); // Reset scale về ban đầu
    Animated.sequence([
      Animated.timing(emojiScale, {
        toValue: 1.5, // Nảy lên
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(emojiScale, {
        toValue: 1, // Trở lại kích thước bình thường
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <View style={styles.progressBarContainer}>
          {StoryView.stories.map((_, index) => (
            <View key={index} style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    width: progressBars[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <Image
          source={{ uri: StoryView.stories[currentIndex]?.medias[0] }}
          style={styles.image}
        />

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: StoryView.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>
              {StoryView.user.first_name + ' ' + StoryView.user.last_name}
            </Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emojiContainer}>
          {emojis.map((emoji, index) => (
            <TouchableOpacity key={index} onPress={() => handleSelectEmoji(emoji)}>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Emoji được chọn với hiệu ứng animation */}
        {selectedEmoji && (
          <Animated.View style={[styles.selectedEmojiContainer, { transform: [{ scale: emojiScale }] }]}>
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
  exitText: {
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
