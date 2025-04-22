import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import ListCommentReply from './ListCommentReply';
import {useSelector, useDispatch} from 'react-redux';
import Video from 'react-native-video';
import {
  addComment_Reaction,
  deleteComment_reaction,
  editComment,
} from '../../rtk/API';
import Svg, {Path} from 'react-native-svg';
import {useBottomSheet} from '../../context/BottomSheetContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';

const {width, height} = Dimensions.get('window');

const ListComment = memo(({comment, onReply, onEdit, onDelete}) => {
  const dispatch = useDispatch();
  const reactions = useSelector(state => state.app.reactions);
  const me = useSelector(state => state.app.user);
  const {openBottomSheet, closeBottomSheet} = useBottomSheet();

  const [comment_reactions, setComment_reactions] = useState(
    comment.comment_reactions || [],
  );
  const [replys, setReplys] = useState(comment.replys || []);
  const [timeAgo, setTimeAgo] = useState(comment.createdAt);
  const [reactionsVisible, setReactionsVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const reactionRef = useRef(null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [mediaContent, setMediaContent] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [failedModalVisible, setFailedModalVisible] = useState(false);

  useEffect(() => {
    const updateDiff = () => {
      const now = Date.now();
      const createdTime = new Date(comment.createdAt).getTime();

      if (isNaN(createdTime)) {
        setTimeAgo('Không xác định');
        return;
      }

      const diffMs = now - createdTime;
      if (diffMs < 0) {
        setTimeAgo('Vừa xong');
      } else {
        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
          setTimeAgo(`${days} ngày`);
        } else if (hours > 0) {
          setTimeAgo(`${hours} giờ`);
        } else if (minutes > 0) {
          setTimeAgo(`${minutes} phút`);
        } else {
          setTimeAgo(`${seconds} giây`);
        }
      }
    };

    updateDiff();
  }, []);

  useEffect(() => {
    setReplys(comment.replys ? comment.replys.filter(reply => !reply._destroy) : []);
  }, [comment.replys]);

  const userReaction = comment_reactions.find(
    reaction => reaction.ID_user._id === me._id,
  );

  const handleLongPressReaction = () => {
    if (reactionRef.current) {
      reactionRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY - 57,
          left: pageX,
          right: pageX,
        });
        setReactionsVisible(true);
      });
    }
  };

  const handleLongPressComment = () => {
    if (comment.ID_user._id === me._id) {
      openBottomSheet(
        25,
        <View style={styles.bottomSheetContent}>
          <TouchableOpacity
            style={styles.bottomSheetItem}
            onPress={() => {
              closeBottomSheet();
              handleEditComment();
            }}>
            <Icon name="pencil" size={20} color="black" />
            <Text style={styles.bottomSheetText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bottomSheetItem}
            onPress={() => {
              closeBottomSheet();
              onDelete(comment._id);
            }}>
            <Icon name="trash" size={20} color="black" />
            <Text style={styles.bottomSheetText}>Xóa</Text>
          </TouchableOpacity>
        </View>,
      );
    }
  };

  const handleEditComment = () => {
    // Pass the comment to the parent (PostDetail) to handle editing
    onEdit(comment);
  };

  const handleMediaPress = (content, type) => {
    setMediaContent(content);
    setMediaType(type);
    setMediaModalVisible(true);
  };

  const reactionCount = comment_reactions.reduce((acc, reaction) => {
    if (!reaction.ID_reaction) return acc;
    const id = reaction.ID_reaction._id;
    acc[id] = acc[id]
      ? {...acc[id], count: acc[id].count + 1}
      : {...reaction, count: 1};
    return acc;
  }, {});

  const topReactions = Object.values(reactionCount)
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  const callAddComment_Reaction = async (ID_reaction, name, icon) => {
    try {
      const paramsAPI = {
        ID_comment: comment._id,
        ID_user: me._id,
        ID_reaction: ID_reaction,
      };
      await dispatch(addComment_Reaction(paramsAPI))
        .unwrap()
        .then(response => {
          const newReaction = {
            _id: ID_reaction,
            name: name,
            icon: icon,
          };
          updateCommentReaction(newReaction, response.comment_reaction._id);
        })
        .catch(error => {
          console.log('Lỗi call api callAddComment_Reaction', error);
        });
    } catch (error) {
      console.log('Lỗi trong callAddComment_Reaction:', error);
    }
  };

  const updateCommentReaction = (newReaction, ID_comment_reaction) => {
    if (userReaction) {
      const updatedReactions = comment_reactions.map(reaction =>
        reaction.ID_user._id === me._id
          ? {
              _id: ID_comment_reaction,
              ID_user: {
                _id: me._id,
                first_name: me.first_name,
                last_name: me.last_name,
                avatar: me.avatar,
              },
              ID_reaction: newReaction,
            }
          : reaction,
      );
      setComment_reactions(updatedReactions);
    } else {
      setComment_reactions([
        ...comment_reactions,
        {
          _id: ID_comment_reaction,
          ID_user: {
            _id: me._id,
            first_name: me.first_name,
            last_name: me.last_name,
            avatar: me.avatar,
          },
          ID_reaction: newReaction,
        },
      ]);
    }
  };

  const callDeleteComment_reaction = async ID_comment_reaction => {
    try {
      const paramsAPI = {
        _id: ID_comment_reaction,
      };
      await dispatch(deleteComment_reaction(paramsAPI))
        .unwrap()
        .then(response => {
          deletCommentReaction(ID_comment_reaction);
        })
        .catch(error => {
          console.log('Lỗi call api callDeleteComment_reaction', error);
        });
    } catch (error) {
      console.log('Lỗi trong callDeleteComment_reaction:', error);
    }
  };

  const deletCommentReaction = ID_comment_reaction => {
    const updatedReactions = comment_reactions.filter(
      reaction => reaction._id !== ID_comment_reaction,
    );
    setComment_reactions(updatedReactions);
  };

  const renderReply = useCallback(
    ({item}) => (
      <ListCommentReply
        comment={item}
        onReply={e => onReply(e)}
        isReply={true}
        level={1}
      />
    ),
    [onReply],
  );

  const baseHeight = 25;
  const extraHeight = 110;
  const totalHeight = baseHeight + (replys.length - 1) * extraHeight;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{flexDirection: 'row', marginHorizontal: 5}}
        onLongPress={handleLongPressComment}
        activeOpacity={0.8}>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image style={styles.avatar} source={{uri: comment.ID_user.avatar}} />
        </View>

        <View style={{maxWidth: '90%'}}>
          <View>
            <View style={styles.boxContent}>
              <Text style={styles.name}>
                {comment.ID_user.first_name} {comment.ID_user.last_name}
              </Text>
              {comment.type === 'text' ? (
                <Text style={styles.commentText}>
                  {comment.content}
                  {comment.isPending && (
                    <Text style={styles.pendingIndicator}> (Đang gửi...)</Text>
                  )}
                </Text>
              ) : comment.type === 'image' ? (
                <TouchableOpacity
                  onPress={() => handleMediaPress(comment.content, 'image')}>
                  <Image
                    style={styles.messageImage}
                    source={{uri: comment.content}}
                  />
                </TouchableOpacity>
              ) : comment.type === 'video' ? (
                <TouchableOpacity
                  onPress={() => handleMediaPress(comment.content, 'video')}>
                  <Video
                    source={{uri: comment.content}}
                    style={styles.messageVideo}
                    controls={true}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          <View style={styles.boxInteract2}>
            <View style={styles.boxInteract}>
              <Text style={{color: 'black'}}>{timeAgo}</Text>
              <TouchableOpacity
                ref={reactionRef}
                onLongPress={handleLongPressReaction}
                onPress={() =>
                  userReaction
                    ? callDeleteComment_reaction(userReaction._id)
                    : callAddComment_Reaction(
                        reactions[0]._id,
                        reactions[0].name,
                        reactions[0].icon,
                      )
                }>
                <Text
                  style={userReaction ? {color: '#FF9D00'} : {color: 'black'}}>
                  {userReaction
                    ? userReaction.ID_reaction.name
                    : reactions[0].name}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onReply(comment)}>
                <Text style={{color: 'black'}}>Trả lời</Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {comment_reactions.length > 0 && (
                    <Text style={styles.reactionText}>
                      {comment_reactions.length}
                    </Text>
                  )}
                  {topReactions.map((reaction, index) => (
                    <View key={index}>
                      <Text style={styles.reactionText2}>
                        {reaction.ID_reaction.icon}
                      </Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Modal reactions */}
      <Modal
        visible={reactionsVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setReactionsVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setReactionsVisible(false)}>
          <View style={styles.overlay}>
            <View
              style={{
                position: 'absolute',
                top: menuPosition.top,
                left: width * 0.25,
              }}>
              <View style={styles.reactionBar}>
                {reactions.map((reaction, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.reactionButton}
                    onPress={() => {
                      callAddComment_Reaction(
                        reaction._id,
                        reaction.name,
                        reaction.icon,
                      );
                      setReactionsVisible(false);
                    }}>
                    <Text style={styles.reactionText}>{reaction.icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal hiển thị ảnh hoặc video */}
      <Modal
        visible={mediaModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMediaModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMediaModalVisible(false)}>
          <View style={styles.mediaModalOverlay}>
            <View style={styles.mediaModalContent}>
              {mediaType === 'image' && (
                <Image
                  source={{uri: mediaContent}}
                  style={styles.fullScreenMedia}
                  resizeMode="contain"
                />
              )}
              {mediaType === 'video' && (
                <Video
                  source={{uri: mediaContent}}
                  style={styles.fullScreenMedia}
                  controls={true}
                  resizeMode="contain"
                  paused={false}
                />
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Success and Failed Modals */}
      <SuccessModal
        visible={successModalVisible}
        message={'Chỉnh sửa bình luận thành công!'}
      />
      <FailedModal
        visible={failedModalVisible}
        message={'Chỉnh sửa bình luận thất bại!'}
      />

      <FlatList
        data={replys.filter(reply => !reply._destroy)} // Filter out deleted replies          renderItem={renderReply}
        keyExtractor={item => item._id.toString()}
        contentContainerStyle={{paddingBottom: 70}}
      />
    </View>
  );
});

export default ListComment;

// Styles remain the same
const styles = StyleSheet.create({
  avatar: {
    width: width * 0.12,
    height: width * 0.12,
    borderRadius: width * 0.06,
  },
  container: {
    marginVertical: height * 0.01,
    flex: 1,
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
  },
  boxInteract: {
    flexDirection: 'row',
    gap: width * 0.02,
    marginTop: height * 0.005,
  },
  boxInteract2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flexWrap: 'wrap',
  },
  boxContent: {
    marginLeft: width * 0.04,
    padding: width * 0.03,
    backgroundColor: '#d9d9d990',
    borderRadius: width * 0.05,
    paddingLeft: width * 0.04,
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  name: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
    color: 'black',
  },
  commentText: {
    lineHeight: height * 0.03,
    color: 'black',
  },
  messageImage: {
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.02,
  },
  messageVideo: {
    width: width * 0.5,
    height: width * 0.6,
    borderRadius: width * 0.02,
  },
  replyContainer: {
    flexDirection: 'row',
    paddingLeft: width * 0.05,
    position: 'relative',
  },
  threadLine: {
    position: 'absolute',
    left: width * 0.025,
    top: height * 0.01,
    bottom: height * 0.01,
    width: 2,
    backgroundColor: 'gray',
  },
  overlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  reactionBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFF',
    padding: width * 0.03,
    borderRadius: width * 0.05,
  },
  reactionButton: {
    marginHorizontal: width * 0.015,
  },
  reactionText: {
    fontSize: width * 0.04,
    color: '#000',
    alignSelf: 'flex-end',
  },
  reactionText2: {
    fontSize: width * 0.04,
    color: '#000',
    alignSelf: 'flex-end',
  },
  mediaModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaModalContent: {
    width: width * 0.9,
    height: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenMedia: {
    width: '100%',
    height: '100%',
  },
  bottomSheetContent: {
    backgroundColor: '#fff',
    padding: width * 0.04,
    borderRadius: width * 0.03,
  },
  bottomSheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
  },
  bottomSheetText: {
    fontSize: width * 0.04,
    color: 'black',
    marginLeft: width * 0.03,
  },
  pendingIndicator: {
    fontSize: width * 0.035,
    color: '#999',
  },
});
