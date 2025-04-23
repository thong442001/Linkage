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
import Video from 'react-native-video';
import {useSelector, useDispatch} from 'react-redux';
import {
  addComment_Reaction, // api tạo comment_reaction
  deleteComment_reaction, // api delete reaction
} from '../../rtk/API';
import {useBottomSheet} from '../../context/BottomSheetContext'; // Import BottomSheetContext
import Icon from 'react-native-vector-icons/Ionicons'; // Import icon cho bottom sheet
import SuccessModal from '../../utils/animation/success/SuccessModal'; // Import modal thành công
import FailedModal from '../../utils/animation/failed/FailedModal'; // Import modal thất bại

const {width, height} = Dimensions.get('window');

const ListCommentReply = memo(
  ({comment, onReply, level = 0, onEdit, onDelete}) => {
    const dispatch = useDispatch();
    const reactions = useSelector(state => state.app.reactions);
    const me = useSelector(state => state.app.user);
    const {openBottomSheet, closeBottomSheet} = useBottomSheet(); // Sử dụng BottomSheetContext

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
    const [replyHeights, setReplyHeights] = useState([]);
    const [mediaModalVisible, setMediaModalVisible] = useState(false);
    const [mediaContent, setMediaContent] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [successModalVisible, setSuccessModalVisible] = useState(false); // State cho modal thành công
    const [failedModalVisible, setFailedModalVisible] = useState(false); // State cho modal thất bại

    const handleLayout = (index, event) => {
      const {height} = event.nativeEvent.layout;
      setReplyHeights(prev => {
        const newHeights = [...prev];
        newHeights[index] = height;
        return newHeights;
      });
    };

    const baseHeight = 0;
    const extraHeight = 110;
    const totalHeight =
      replyHeights.reduce((sum, height) => sum + (height || 0), 0) + baseHeight;

    const renderReply = useCallback(
      ({item, index}) => (
        <ListCommentReply
          comment={item}
          onReply={e => onReply(e)}
          isReply={true}
          level={level + 1}
          onEdit={onEdit} // Truyền callback chỉnh sửa
          onDelete={onDelete} // Truyền callback xóa
        />
      ),
      [onReply, onEdit, onDelete],
    );

    useEffect(() => {
      const updateDiff = () => {
        const now = Date.now();
        const createdTime = new Date(comment.createdAt).getTime();
        if (isNaN(createdTime)) {
          setTimeAgo('Không xác định');
          return;
        }
        const diffMs = now - createdTime;
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
      };
      updateDiff();
    }, []);

    useEffect(() => {
      setReplys(comment.replys ? [...comment.replys] : []);
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

    // Hàm xử lý nhấn giữ bình luận trả lời để mở bottom sheet
    const handleLongPressComment = () => {
      if (comment.ID_user._id === me._id) {
        openBottomSheet(
          25,
          <View style={styles.bottomSheetContent}>
            <TouchableOpacity
              style={styles.bottomSheetItem}
              onPress={() => {
                closeBottomSheet();
                onEdit(comment); // Gọi callback chỉnh sửa
              }}>
              <Icon name="pencil" size={20} color="black" />
              <Text style={styles.bottomSheetText}>Chỉnh sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottomSheetItem}
              onPress={() => {
                closeBottomSheet();
                onDelete(comment._id); // Gọi callback xóa
              }}>
              <Icon name="trash" size={20} color="black" />
              <Text style={styles.bottomSheetText}>Xóa</Text>
            </TouchableOpacity>
          </View>,
        );
      }
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
        const paramsAPI = {_id: ID_comment_reaction};
        await dispatch(deleteComment_reaction(paramsAPI))
          .unwrap()
          .then(() => {
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

    return (
      <View style={[styles.container, level > 0 && styles.replyContainer]}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            marginTop: 10,
            maxWidth: '78%',
            paddingLeft: level === 1 ? 60 : level === 2 ? 60 : 130,
          }}
          onLongPress={handleLongPressComment} // Thêm sự kiện nhấn giữ
          activeOpacity={0.8}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={styles.avatar}
              source={{uri: comment.ID_user.avatar}}
            />
          </View>
          <View style={{width: '100%'}}>
            <View>
              <View style={styles.boxContent}>
                <Text style={styles.name}>
                  {comment.ID_user.first_name} {comment.ID_user.last_name}
                </Text>
                {comment.type === 'text' ? (
                  <Text style={styles.commentText}>
                    {comment.content}
                    {comment.isPending && (
                      <Text style={styles.pendingIndicator}>
                        {' '}
                        (Đang gửi...)
                      </Text>
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
                    style={
                      userReaction ? {color: '#FF9D00'} : {color: 'black'}
                    }>
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
                  <View style={{flexDirection: 'row'}}>
                    {comment_reactions.length > 0 && (
                      <Text style={styles.reactionText}>
                        {comment_reactions.length}
                      </Text>
                    )}
                    {topReactions.map((reaction, index) => (
                      <View key={index}>
                        <Text style={styles.reactionText}>
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
        <SuccessModal visible={successModalVisible} message={'Thành công!'} />
        <FailedModal visible={failedModalVisible} message={'Thất bại!'} />
        <FlatList
          data={replys}
          renderItem={renderReply}
          keyExtractor={item => item._id.toString()}
        />
      </View>
    );
  },
);

export default ListCommentReply;

const styles = StyleSheet.create({
  avatar: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
  },
  container: {
    marginVertical: height * 0.005,
    flex: 1,
  },
  replyContainer: {
    position: 'relative',
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
    width: '110%',
    flexWrap: 'wrap',
  },
  boxContent: {
    marginLeft: width * 0.04,
    padding: width * 0.03,
    backgroundColor: '#d9d9d990',
    borderRadius: width * 0.05,
    paddingLeft: width * 0.04,
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  name: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    marginBottom: height * 0.005,
    color: 'black',
  },
  commentText: {
    lineHeight: height * 0.03,
    color: 'black',
  },
  messageImage: {
    width: width * 0.4,
    height: width * 0.5,
    borderRadius: width * 0.02,
  },
  messageVideo: {
    width: width * 0.5,
    height: width * 0.6,
    borderRadius: width * 0.02,
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
  lineContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginRight: width * 0.04,
  },
  line2: {
    width: width * 0.002,
    height: height * 0.03,
    backgroundColor: 'gray',
  },
  line: {
    width: width * 0.08,
    height: width * 0.002,
    backgroundColor: 'gray',
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
