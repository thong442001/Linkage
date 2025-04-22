import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, storyViewerOfStory, addStoryViewer_reaction } from '../../rtk/API';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const Story = () => {
  const route = useRoute();
  const { StoryView, currentUserId, onDeleteStory } = route.params || {};
  const me = useSelector(state => state.app.user);
  const reactions = useSelector(state => state.app.reactions);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [selectedReactionId, setSelectedReactionId] = useState(null); // Thêm trạng thái để theo dõi reaction được chọn
  const [videoDuration, setVideoDuration] = useState(0);
  const [stories, setStories] = useState(StoryView?.stories || []);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [isLongPress, setIsLongPress] = useState(false);
  const longPressTimer = useRef(null);

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const emojiScale = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const progressBars = useRef([]);

  useEffect(() => {
    progressBars.current = stories.map(() => new Animated.Value(0));
  }, [stories]);

  useEffect(() => {
    callStoryViewerOfStory();
  }, [currentIndex]);

  const callStoryViewerOfStory = async () => {
    try {
      const response = await dispatch(storyViewerOfStory({ ID_post: stories[currentIndex]._id, ID_user: me._id })).unwrap();
      if (response && response.storyViewers) {
        // Hợp nhất danh sách viewers để loại bỏ trùng lặp
        const uniqueViewers = [];
        const seenUserIds = new Set();
        for (const viewer of response.storyViewers) {
          if (!seenUserIds.has(viewer.ID_user._id)) {
            uniqueViewers.push(viewer);
            seenUserIds.add(viewer.ID_user._id);
          } else {
            // Nếu đã có user, giữ bản ghi mới nhất (hoặc có reaction)
            const existingIndex = uniqueViewers.findIndex(v => v.ID_user._id === viewer.ID_user._id);
            if (viewer.ID_reaction && (!uniqueViewers[existingIndex].ID_reaction || new Date(viewer.createdAt) > new Date(uniqueViewers[existingIndex].createdAt))) {
              uniqueViewers[existingIndex] = viewer;
            }
          }
        }
        setViewers(uniqueViewers);
      }
    } catch (error) {
      console.log('Lỗi khi callStoryViewerOfStory:', error);
    }
  };

  const isVideo = (media) => {
    return media?.toLowerCase().endsWith('.mp4') || stories[currentIndex]?.type === 'video';
  };

  const startProgress = (index, fromValue = 0) => {
    if (!stories[index] || !progressBars.current[index]) return;
    progressBars.current[index].setValue(fromValue);
    const duration = isVideo(stories[index].medias[0]) ? videoDuration : 5000;
    const remainingDuration = duration * (1 - fromValue);

    Animated.timing(progressBars.current[index], {
      toValue: 1,
      duration: remainingDuration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished && navigation.isFocused() && !isBottomSheetOpen) {
        handleNextStory();
      }
    });
  };

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < stories.length && !isBottomSheetOpen) {
      if (!isVideo(stories[currentIndex]?.medias[0])) {
        startProgress(currentIndex);
      }
    }
  }, [currentIndex, stories, isBottomSheetOpen]);

  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < stories.length && isFirstLoad && currentIndex === 0) {
      if (!isVideo(stories[currentIndex]?.medias[0])) {
        setIsFirstLoad(false);
        startProgress(0);
      }
    }
  }, [currentIndex, stories, isFirstLoad]);

  const handlePressIn = () => {
    longPressTimer.current = setTimeout(() => {
      setIsLongPress(true);
      setIsPaused(true);
      if (progressBars.current[currentIndex]) {
        progressBars.current[currentIndex].stopAnimation((value) => {
          setProgressValue(value);
        });
      }
    }, 300);
  };

  const handlePressOut = () => {
    clearTimeout(longPressTimer.current);
    if (isLongPress) {
      setIsPaused(false);
      if (!isVideo(stories[currentIndex]?.medias[0])) {
        startProgress(currentIndex, progressValue);
      } else if (videoRef.current) {
        startProgress(currentIndex, progressValue);
        videoRef.current.seek(progressValue * videoDuration / 1000);
      }
      setIsLongPress(false);
    }
  };

  const handleNextStory = () => {
    if (currentIndex + 1 < stories.length) {
      progressBars.current[currentIndex]?.setValue(1);
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSelectedEmoji(null);
      setSelectedReactionId(null); // Reset reaction được chọn khi chuyển story
      setVideoDuration(0);
      setProgressValue(0);
      setIsPaused(true);
    } else if (navigation.isFocused()) {
      navigation.goBack();
    }
  };

  const handlePrevStory = () => {
    if (currentIndex > 0) {
      progressBars.current[currentIndex]?.setValue(0);
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setSelectedEmoji(null);
      setSelectedReactionId(null); // Reset reaction được chọn khi chuyển story
      setVideoDuration(0);
      setProgressValue(0);
      setIsPaused(true);
    }
  };

  const handlePress = (event) => {
    if (isLongPress) return;
    const { locationX } = event.nativeEvent;
    if (isFirstLoad && currentIndex === 0 && isVideo(stories[currentIndex]?.medias[0])) {
      setIsFirstLoad(false);
      if (videoRef.current) {
        startProgress(0);
      }
    } else {
      if (locationX < width / 2) {
        handlePrevStory();
      } else {
        handleNextStory();
      }
    }
  };

  const handleSelectReaction = async (ID_reaction, name, icon) => {
    setSelectedEmoji(icon);
    setSelectedReactionId(ID_reaction); // Cập nhật ID của reaction được chọn

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

    try {
      const data = {
        ID_post: stories[currentIndex]._id,
        ID_user: me._id,
        ID_reaction: ID_reaction,
      };
      await dispatch(addStoryViewer_reaction(data)).unwrap();
    } catch (error) {
      console.error('Lỗi khi thêm biểu cảm:', error);
    }
  };

  const onVideoLoad = (data) => {
    if (data.duration) {
      setVideoDuration(data.duration * 1000);
      if (isFirstLoad && currentIndex === 0) {
        setIsFirstLoad(false);
      }
      setIsPaused(false);
    }
  };

  const onVideoEnd = () => {
    handleNextStory();
  };

  const onVideoProgress = (data) => {
    if (videoDuration > 0 && progressBars.current[currentIndex]) {
      const progress = data.currentTime / (videoDuration / 1000);
      progressBars.current[currentIndex].setValue(progress);
      setProgressValue(progress);
    }
  };

  const callDeleteStory = async (ID_story) => {
    try {
      await dispatch(deletePost({ _id: ID_story })).unwrap().then(response => {
        const newStories = stories.filter(story => story._id !== ID_story);
        setStories(newStories);
        if (onDeleteStory) {
          onDeleteStory(ID_story);
        }
        if (currentIndex >= newStories.length && currentIndex > 0) {
          setCurrentIndex(newStories.length - 1);
        }
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigation.replace(oStackHome.TabHome.name, { isDeleted: true, deletedStoryId: ID_story });
        }, 1000);
      });
    } catch (error) {
      console.log('Lỗi trong callDeleteStory:', error);
    }
  };

  const handleDeleteStory = async () => {
    if (currentUserId !== StoryView.user._id) {
      console.log("Bạn chỉ có thể xóa story của chính mình!");
      return;
    }
    try {
      const storyId = stories[currentIndex]._id;
      await callDeleteStory(storyId);
    } catch (error) {
      console.error("Không thể xóa story:", error);
    }
  };

  const handleCloseBottomSheet = useCallback(() => {
    closeBottomSheet();
    setIsBottomSheetOpen(false);
    if (!isVideo(stories[currentIndex]?.medias[0])) {
      startProgress(currentIndex, progressValue);
    } else {
      setIsPaused(false);
    }
  }, [closeBottomSheet, currentIndex, stories, progressValue]);

  const handleOpenBottomSheet = useCallback(() => {
    setIsBottomSheetOpen(true);
    if (progressBars.current[currentIndex]) {
      progressBars.current[currentIndex].stopAnimation((value) => {
        setProgressValue(value);
      });
    }
    openBottomSheet(50, (
      <View style={styles.bottomSheetContent}>
        <Text style={styles.bottomSheetTitle}>Danh sách người xem ({viewers.length})</Text>
        <FlatList
          data={viewers}
          renderItem={renderViewerItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
        />
      </View>
    ), handleCloseBottomSheet);
  }, [viewers, openBottomSheet, handleCloseBottomSheet, currentIndex, stories]);

  const renderViewerItem = ({ item }) => {
    if (item.ID_user._id === me._id) {
      return null;
    }
  
    return (
      <View style={styles.viewerItem}>
        <Image source={{ uri: item.ID_user.avatar }} style={styles.viewerAvatar} />
        <Text style={styles.viewerName}>
          {item.ID_user.first_name + ' ' + item.ID_user.last_name}
          {item.ID_reaction && <Text style={styles.reaction}> {item.ID_reaction.icon}</Text>}
        </Text>
      </View>
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
    <TouchableWithoutFeedback
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
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
            onProgress={onVideoProgress}
            repeat={false}
            paused={isPaused || isBottomSheetOpen}
          />
        ) : (
          <Image
            source={{ uri: stories[currentIndex]?.medias[0] }}
            style={styles.image}
          />
        )}

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { _id: StoryView?.user?._id })}>
              <Image source={{ uri: StoryView.user.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <Text style={styles.username} onPress={() => navigation.navigate('Profile', { _id: StoryView?.user?._id })}>
              {StoryView.user.first_name + ' ' + StoryView.user.last_name}
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            {me._id === StoryView.user?._id && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteStory}>
                <Icon name="trash-outline" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
              <Icon name="close-outline" size={30} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {me._id !== StoryView.user?._id && (
         <ScrollView
         horizontal={true} // Bật cuộn ngang
         showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn
         style={styles.reactionContainer}
         contentContainerStyle={styles.reactionContent}
         >
            {reactions && reactions.length > 0 ? (
              reactions.map((reaction, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reactionButton,
                    selectedReactionId === reaction._id ? styles.selectedReactionButton : null, // Áp dụng style nếu được chọn
                  ]}
                  onPress={() => handleSelectReaction(reaction._id, reaction.name, reaction.icon)}
                >
                  <Text style={styles.reactionText}>{reaction.icon}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{ color: '#fff' }}>Không có biểu cảm</Text>
            )}
          </ScrollView>
        )}

  

        {me._id === StoryView.user?._id && (
          <TouchableOpacity style={styles.viewersCountContainer} onPress={handleOpenBottomSheet}>
            <Text style={styles.viewersTitle}>Đã xem ({viewers.length - 1})</Text>
          </TouchableOpacity>
        )}

        {showSuccessModal && <SuccessModal message="Xóa story thành công" />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 10,
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
    width: width * 0.4,
    height: height * 0.65,
    marginBottom: height * 0.1,
    aspectRatio: 1,
    marginTop: 30,
    resizeMode: 'contain',
    alignSelf: 'center',
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
  selectedEmojiContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  selectedEmoji: {
    fontSize: 50,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  viewersCountContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  viewersTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSheetContent: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  bottomSheetTitle: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  viewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  viewerName: {
    color: '#000',
    fontSize: 16,
  },
  reaction: {
    fontSize: 16,
    marginLeft: 5,
  },
  reactionContainer: {
    position: 'absolute',
    bottom: 50,
    flexDirection: 'row',
    borderRadius: 20,
    padding: 5,
  },
  reactionButton: {
    padding: 0,
    borderRadius: 20,
    margin: 10,
  },
  selectedReactionButton: {
    backgroundColor: 'rgba(255,255,255,0.8)', 
  },
  reactionText: {
    fontSize: 24,
  },
});

export default Story;