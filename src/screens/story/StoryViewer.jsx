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
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Video from 'react-native-video';
import { useDispatch, useSelector } from 'react-redux';
import { deletePost, storyViewerOfStory, addStoryViewer_reaction } from '../../rtk/API';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import { useBottomSheet } from '../../context/BottomSheetContext';

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
  const [videoDuration, setVideoDuration] = useState(0);
  const [stories, setStories] = useState(StoryView?.stories || []);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewers, setViewers] = useState([]);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [progressValue, setProgressValue] = useState(0);
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const emojiScale = useRef(new Animated.Value(1)).current;
  const videoRef = useRef(null);
  const reactionRef = useRef(null);
  const progressBars = useRef([]);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [isLongPress, setIsLongPress] = useState(false); // Cờ để xác định giữ lâu
  const longPressTimer = useRef(null); // Timer để kiểm tra giữ lâu 
  

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  useEffect(() => {
    progressBars.current = stories.map(() => new Animated.Value(0));
  }, [stories]);

  useEffect(() => {
    callStoryViewerOfStory();
  }, [currentIndex]);
// console.log('StoryView', route.params);
  const callStoryViewerOfStory = async () => {
    try {
      const response = await dispatch(storyViewerOfStory({ ID_post: stories[currentIndex]._id, ID_user: me._id })).unwrap();
      console.log('Full response: ', response);
      if (response && response.storyViewers) {
        setViewers(response.storyViewers);
        console.log('Set viewers with: ', response.storyViewers);
      } else {
        console.log('No storyViewers found in response');
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

  // Chỉ chạy progress cho ảnh, không tự động chạy cho video
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < stories.length && !isBottomSheetOpen) {
      if (!isVideo(stories[currentIndex]?.medias[0])) {
        startProgress(currentIndex);
      }
    }
  }, [currentIndex, stories, isBottomSheetOpen]);

  // Xử lý lần đầu load cho ảnh
  useEffect(() => {
    if (currentIndex >= 0 && currentIndex < stories.length && isFirstLoad && currentIndex === 0) {
      if (!isVideo(stories[currentIndex]?.medias[0])) {
        setIsFirstLoad(false);
        startProgress(0);
      }
    }
  }, [currentIndex, stories, isFirstLoad]);

// Khi giữ màn hình
const handlePressIn = () => {
  // Đặt timer để xác định giữ lâu (300ms)
  longPressTimer.current = setTimeout(() => {
    setIsLongPress(true);
    setIsPaused(true);
    if (progressBars.current[currentIndex]) {
      progressBars.current[currentIndex].stopAnimation((value) => {
        setProgressValue(value);
      });
    }
  }, 300); // Ngưỡng 300ms để coi là giữ lâu
};

// Khi thả ra
const handlePressOut = () => {
  clearTimeout(longPressTimer.current); // Hủy timer khi thả tay
  if (isLongPress) {
    // Nếu là giữ lâu, tiếp tục progress
    setIsPaused(false);
    if (!isVideo(stories[currentIndex]?.medias[0])) {
      startProgress(currentIndex, progressValue);
    } else if (videoRef.current) {
      startProgress(currentIndex, progressValue);
      videoRef.current.seek(progressValue * videoDuration / 1000);
    }
    setIsLongPress(false); // Reset trạng thái giữ lâu
  }
};
  
// Chuyển qua story tiếp theo
const handleNextStory = () => {
  if (currentIndex + 1 < stories.length) {
    progressBars.current[currentIndex]?.setValue(1); // Đặt progress của story hiện tại thành 100%
    setCurrentIndex((prevIndex) => prevIndex + 1);
    setSelectedEmoji(null);
    setVideoDuration(0); // Reset videoDuration, sẽ được cập nhật lại trong onVideoLoad
    setProgressValue(0); // Reset progress để bắt đầu từ đầu cho story mới
    setIsPaused(true); // Tạm dừng để chờ video mới tải (nếu là video)
  } else if (navigation.isFocused()) {
    navigation.goBack();
  }
};

// Quay lại story trước
const handlePrevStory = () => {
  if (currentIndex > 0) {
    progressBars.current[currentIndex]?.setValue(0); // Đặt progress của story hiện tại thành 0%
    setCurrentIndex((prevIndex) => prevIndex - 1);
    setSelectedEmoji(null);
    setVideoDuration(0); // Reset videoDuration, sẽ được cập nhật lại trong onVideoLoad
    setProgressValue(0); // Reset progress để bắt đầu từ đầu cho story trước
    setIsPaused(true); // Tạm dừng để chờ video mới tải (nếu là video)
  }
};

// Xử lý nhấn để chuyển trang
const handlePress = (event) => {
  if (isLongPress) return; // Nếu đang giữ lâu, không chuyển trang

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
    setReactionsVisible(false);

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
      await dispatch(addStoryViewer_reaction(data))
        .unwrap()
        .then(response => {
          console.log('Thêm biểu cảm thành công:', response);
        })
        .catch(error => {
          console.log('Lỗi khi thêm biểu cảm1:', error);
        });
      //await callStoryViewerOfStory();
    } catch (error) {
      console.error('Lỗi khi thêm biểu cảm2:', error);
    }
  };

  const handleLongPress = () => {
    if (reactionRef.current) {
      reactionRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({ top: pageY - 50, left: pageX - 50 });
        setReactionsVisible(true);
      });
    }
  };

  const onVideoLoad = (data) => {
    if (data.duration) {
      setVideoDuration(data.duration * 1000); // Cập nhật thời lượng video
      if (isFirstLoad && currentIndex === 0) {
        setIsFirstLoad(false);
      }
      setIsPaused(false); // Bắt đầu phát video sau khi tải
    }
  };

  const onVideoEnd = () => {
    handleNextStory();
  };

//theo dỗi tiến trình video
const onVideoProgress = (data) => {
  if (videoDuration > 0 && progressBars.current[currentIndex]) {
    const progress = data.currentTime / (videoDuration / 1000); // Tính tỷ lệ tiến trình
    progressBars.current[currentIndex].setValue(progress); // Cập nhật thanh progress
    setProgressValue(progress); // Lưu giá trị tiến trình
  }
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
          if (currentIndex >= newStories.length && currentIndex > 0) {
            setCurrentIndex(newStories.length - 1);
          }
          setShowSuccessModal(true);
          setTimeout(() => {
            setShowSuccessModal(false);
            navigation.replace(oStackHome.TabHome.name, { isDeleted: true, deletedStoryId: ID_story });
          },);
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
      setIsPaused(false); // Tiếp tục video
    }
  }, [closeBottomSheet, currentIndex, stories, progressValue]);

  const handleOpenBottomSheet = useCallback(() => {
    console.log('Opening Bottom Sheet with viewers:', viewers);
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

  const renderViewerItem = ({ item }) => (
    <View style={styles.viewerItem}>
      <Image source={{ uri: item.ID_user.avatar }} style={styles.viewerAvatar} />
      <Text style={styles.viewerName}>
        {item.ID_user.first_name + ' ' + item.ID_user.last_name}
        {item.ID_reaction && <Text style={styles.reaction}> {item.ID_reaction.icon}</Text>}
      </Text>
    </View>
  );

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
    onPressIn={handlePressIn} // Khi giữ màn hình
    onPressOut={handlePressOut} // Khi thả màn hình
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
            onProgress={onVideoProgress} // Theo dõi tiến trình video
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
            <Image source={{ uri: StoryView.user.avatar }} style={styles.avatar} />
            <Text style={styles.username}>
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
          <TouchableOpacity
            ref={reactionRef}
            style={styles.reactionTrigger}
            onLongPress={handleLongPress}
            onPress={() => {
              if (reactions && reactions.length > 0) {
                handleSelectReaction(reactions[0]._id, reactions[0].name, reactions[0].icon);
              }
            }}
          >
            <Text style={styles.reactionText}>
              {selectedEmoji || '👍'}
            </Text>
          </TouchableOpacity>
        )}

        <Modal
          visible={reactionsVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setReactionsVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setReactionsVisible(false)}>
            <View style={styles.overlay}>
              <View style={{ position: 'absolute', top: menuPosition.top, left: menuPosition.left }}>
                <View style={styles.reactionBar}>
                  {reactions && reactions.length > 0 ? (
                    reactions.map((reaction, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.reactionButton}
                        onPress={() => handleSelectReaction(reaction._id, reaction.name, reaction.icon)}
                      >
                        <Text style={styles.reactionText}>{reaction.icon}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={{ color: '#fff' }}>Không có biểu cảm</Text>
                  )}
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {selectedEmoji && (
          <Animated.View
            style={[styles.selectedEmojiContainer, { transform: [{ scale: emojiScale }] }]}
          >
            <Text style={styles.selectedEmoji}>{selectedEmoji}</Text>
          </Animated.View>
        )}

        {me._id === StoryView.user?._id && (
          <TouchableOpacity style={styles.viewersCountContainer} onPress={handleOpenBottomSheet}>
            <Text style={styles.viewersTitle}>Đã xem ({viewers.length})</Text>
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
    justifyContent: 'center', // Căn giữa theo chiều dọc
    alignItems: 'center', // Căn giữa theo chiều ngang
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
    height: height * 0.8,
    aspectRatio: 1,
    marginTop: 30,
        resizeMode: 'contain', // Đảm bảo ảnh không bị méo
    alignSelf: 'center', // Căn giữa theo chiều ngang
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
    bottom: 30,
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
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reactionTrigger: {
    position: 'absolute',
    bottom: 100,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  reactionBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    left: -75,
    padding: 5,
  },
  reactionButton: {
    padding: 10,
  },
  reactionText: {
    fontSize: 24,
  },
});

export default Story;