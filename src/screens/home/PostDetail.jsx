import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Clipboard,
  RefreshControl
} from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import styles from '../../styles/components/items/CommentS';
import ListComment from '../../components/items/ListComment';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useSocket } from '../../context/socketContext';
import GroupcomponentShare from '../../components/chat/GroupcomponentShare';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChiTietPost,
  addPost_Reaction, // thả biểu cảm
  deletePost_reaction,// xóa biểu cảm
  addPost, // api share
  addComment, // api tạo comment
  changeDestroyPost,
  getAllGroupOfUser, //xoa post
} from '../../rtk/API';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import LoadingModal from '../../utils/animation/loading/LoadingModal';
import LoadingTron from '../../utils/animation/loadingTron/LoadingTron';
import { set } from '@react-native-firebase/database';
import { oStackHome, oTab } from '../../navigations/HomeNavigation';
const { width, height } = Dimensions.get('window');
import NoAccessModal from '../../utils/animation/no_access/NoAccessModal';
import styleShared from '../../styles/screens/postItem/PostItemS';
import SuccessModal from '../../utils/animation/success/SuccessModal';
import FailedModal from '../../utils/animation/failed/FailedModal';
import LoadingChatList from '../../utils/animation/loadingChatList/LoadingChatList';
import DeletedPost from '../../utils/animation/postdeleted/DeletedPost';


// Component SharedPost

const SharedPost = ({
  me,
  callAddPostShare,
  copyToClipboard,
  post,
  width,
  styleShared,
  setShareVisible,
}) => {
  const token = useSelector((state) => state.app.token);
  const dispatch = useDispatch();
  const [captionShare, setCaptionShare] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false); // Thêm trạng thái loading
  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: 'Công khai',
  });
  const [groups, setGroups] = useState([]);
  const { socket } = useSocket();
  const deeplinkPost = `https://linkage.id.vn/deeplink?url=linkage://post-chi-tiet?ID_post=${post._id.toString()}`;

  const status = [
    { status: 1, name: 'Công khai', icon: 'user-alt' },
    { status: 2, name: 'Bạn bè', icon: 'user-friends' },
    { status: 3, name: 'Chỉ mình tôi', icon: 'user-lock' },
  ];

  const handleSelectOption = (option) => {
    console.log('Selected option:', option);
    setSelectedOption(option);
    setModalVisible(false);
  };

  useEffect(() => {
    callGetAllGroupOfUser(me._id);
  }, []);

  const callGetAllGroupOfUser = async (ID_user) => {
    try {
      setIsLoadingGroups(true);

      const response = await dispatch(getAllGroupOfUser({ ID_user, token })).unwrap();
      setGroups(response.groups);


      setTimeout(() => {
        setIsLoadingGroups(false);
      }, 2000);
    } catch (error) {
      console.log('Error:', error);
      setIsLoadingGroups(false);
    }
  };


  const sendMessage = async (ID_group) => {
    await socket.emit('joinGroup', ID_group);
    if (socket == null) {
      console.log('Socket không joinGroup được');
      return;
    }
    const payload = {
      ID_group: ID_group,
      sender: me._id,
      content: deeplinkPost,
      type: 'text',
      ID_message_reply: null,
    };
    socket.emit('send_message', payload);
  };

  const renderContact = ({ item }) => {
    // Giới hạn tên nhóm tối đa 10 ký tự

    return (
      <TouchableOpacity onPress={() => sendMessage(item._id)} key={item._id}>
        <GroupcomponentShare item={item}
        />
      </TouchableOpacity>
    );
  };

  const handleSharePress = async () => {
    setIsButtonLoading(true);
    await callAddPostShare(captionShare, selectedOption.name);
    setIsButtonLoading(false);
  };

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <View style={styleShared.rectangle}>
        <View style={styleShared.lineBottomSheet}></View>
      </View>

      <View
        style={{
          flexDirection: 'column',
          backgroundColor: '#ecf0f0',
          borderRadius: 10,
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: width * 0.9,
          marginVertical: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            borderRadius: 10,
            marginHorizontal: 15,
          }}
        >
          <Image source={{ uri: me?.avatar }} style={styleShared.avatar} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ top: 10, color: 'black', fontWeight: 'bold' }}>
              {me?.first_name + ' ' + me?.last_name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#dce0e0',
                  paddingVertical: 2,
                  borderRadius: 5,
                  paddingHorizontal: 10,
                }}
                onPress={() => setModalVisible(true)}
              >
                <Text style={{ color: 'black', fontSize: 14 }}>{selectedOption.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSharePress}
                style={[
                  styleShared.shareButton,
                  {
                    marginHorizontal: 10,
                    marginRight: 5,
                    paddingVertical: 2,
                    paddingHorizontal: 10,
                    backgroundColor: '#0064E0',
                    borderRadius: 5,
                    opacity: isButtonLoading ? 0.6 : 1,
                  },
                ]}
                disabled={isButtonLoading}
              >

                <Text
                  style={[
                    styleShared.shareButtonText,
                    { fontSize: 14, color: 'white' },
                  ]}
                >
                  Chia sẻ ngay
                </Text>

              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
          <TextInput
            editable={true}
            multiline={true}
            scrollEnabled={true}
            placeholder="Hãy nói gì đó về nội dung này"
            placeholderTextColor="gray"
            style={[
              styleShared.contentShare,
              {
                flexShrink: 1,
                maxHeight: 100,
                minHeight: 40,
                marginHorizontal: 10,
                textAlignVertical: 'top',
                overflow: 'hidden',
              },
            ]}
            value={captionShare}
            onChangeText={(text) => setCaptionShare(text)}
            color="black"
            maxLength={500}
          />
        </View>
      </View>

      <View style={{ marginBottom: 10 }}>
        <View style={styleShared.sectionContainer}>
          <Text style={styleShared.sectionTitle}>Gửi bằng Chat</Text>
          {isLoadingGroups ? (
            <LoadingChatList />
          ) : (
            <FlatList
              data={groups}
              pointerEvents="auto"
              renderItem={renderContact}
              keyExtractor={(item) => item._id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={styleShared.contactList}
            />
          )}
        </View>

        <View style={styleShared.sectionContainer}>
          <Text style={styleShared.sectionTitle}>Chia sẻ lên</Text>
          <View style={{ marginHorizontal: 10 }}>
            <TouchableOpacity
              onPress={() => {
                copyToClipboard(deeplinkPost.toString());
              }}
              style={styleShared.copyLinkButton}
            >
              <Text style={styleShared.copyLinkText}>Sao chép liên kết</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styleShared.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styleShared.modalContent1}>
            {status.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styleShared.optionButton,
                  selectedOption.status === option.status && { backgroundColor: '#e0e0e0' },
                ]}
                onPress={() => handleSelectOption(option)}
              >
                <View
                  style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 5 }}
                >
                  <Text style={styleShared.optionText}>{option.name}</Text>
                  <FontAwesome5 name={option.icon} size={15} color={'black'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};


  const PostDetail = (props) => {
    const { navigation } = props
    const route = useRoute();
    const { ID_post, typeClick: initialTypeClick } = route.params || {}
    const [typeClick, setTypeClick] = useState(initialTypeClick); // Khởi tạo typeClick từ params
    const dispatch = useDispatch()
    const me = useSelector(state => state.app.user);
    const reactions = useSelector(state => state.app.reactions)

    const { openBottomSheet, closeBottomSheet } = useBottomSheet();
    const token = useSelector(state => state.app.token);
    const [isSharing, setIsSharing] = useState(false);
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [countComments, setCountComments] = useState(0)
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const [reply, setReply] = useState(null);
    const [isReplying, setIsReplying] = useState(false); // Thêm trạng thái trả lời
    const textInputRef = useRef(null); // Thêm ref cho TextInput

    const [post, setPost] = useState(null)

    const [timeAgo, setTimeAgo] = useState();
    const [timeAgoShare, setTimeAgoShare] = useState();

    const [reactionsVisible, setReactionsVisible] = useState(false);
    const [shareVisible, setShareVisible] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    // trang thai
    const [modalVisible, setModalVisible] = useState(false);

    const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
    const reactionRef = useRef(null); // ref để tham chiếu tới tin nhắn


    // Cảnh
    // post_reactions: list của reaction của post
    const [reactionsOfPost, setReactionsOfPost] = useState([]);
    const [selectedTab, setSelectedTab] = useState('all');
    const [isFirstRender, setIsFirstRender] = useState(true);

    //hien len anh
    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalVisible, setImageModalVisible] = useState(false);

    //loading
    const [isSending, setIsSending] = useState(false);
    const [failedModalVisible, setFailedModalVisible] = useState(false);

    //có quyền xem bài post hay ko
    const [isPermission, setIsPermission] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [dialogCopyVisible, setDialogCopyVisible] = useState(false);

    //refresh dữ liệu 
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Hàm sao chép liên kết
    const copyToClipboard = text => {
      Clipboard.setString(text);
      setDialogCopyVisible(true);
    };


    // Hàm kiểm tra bài viết hợp lệ
    const isPostValid = () => {
      return post && isPermission && (!post._destroy || me._id === post.ID_user._id);
    };


    //call api chi tiet bai post
    const callGetChiTietPost = async (ID_post) => {
      try {
        setIsLoading(true);
        //console.log("ID_post:", ID_post);
        await dispatch(getChiTietPost({ ID_post, ID_user: me._id, token }))
          .unwrap()
          .then((response) => {
            if (response.post) {
              setPost(response.post);
              setComments(response.post.comments)
              setReactionsOfPost(response.post.post_reactions)
              setCountComments(response.post.countComments);
            } else {
              setIsPermission(false)
            }
          })
          .catch((error) => {
            console.log('API không trả về bài viết: ' + error.message);
          });
      } catch (error) {
        console.log('Lỗi khi lấy chi tiết bài viết:', error);
      }
      finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    // Hàm xử lý khi kéo để làm mới
    const onRefresh = useCallback(() => {
      setIsRefreshing(true);
      callGetChiTietPost(ID_post);
    }, [ID_post]);

    //api delete post
    const callChangeDestroyPost = async ID_post => {
      try {
        await dispatch(changeDestroyPost({ _id: ID_post }))
          .unwrap()
          .then(response => {
          })
          .catch(error => {
            console.log('Lỗi khi xóa bài viết:', error);
          });
      } catch (error) {
        console.log('Lỗi trong callChangeDestroyPost:', error);
      }
    };

    const addReplyToComment = (commentsList, newReply) => {
      return commentsList.map((comment) => {
        if (comment._id === newReply.ID_comment_reply._id) {
          return {
            ...comment,
            replys: [...(comment.replys ?? []), newReply], // ✅ Đảm bảo replys luôn là mảng
          };
        }
        if (Array.isArray(comment.replys) && comment.replys.length > 0) {
          return {
            ...comment,
            replys: addReplyToComment(comment.replys, newReply),
          };
        }
        return comment;
      });
    };


    //call api chi tiet bai post
    const callAddComment = async (type, content) => {
      try {
        addComment
        if ((content == '' && type === 'text') || post == null) {
          console.log('thiếu ')
          return null;
        }
        setIsSending(true);
        const paramsAPI = {
          ID_user: me._id,
          ID_post: post._id,
          content: content,
          type: type,
          ID_comment_reply: reply?._id || null,
        };

        await dispatch(addComment(paramsAPI))
          .unwrap()
          .then((response) => {
            if (response.comment.ID_comment_reply) {
              setComments((prevComments) => [...addReplyToComment(prevComments, response.comment)]);
            } else {
              setComments((prevComments) => [...prevComments, response.comment]);
            }
            setCountComments(countComments + 1);
            setComment('');
            setReply(null);
            setIsReplying(false); // Reset trạng thái trả lời
          })
          .catch((error) => {
            console.log('Error1 addComment:', error);
          })
          .finally(() => {
            // Đặt lại isSending thành false sau khi hoàn tất (thành công hoặc thất bại)
            setIsSending(false);
          });
      } catch (error) {
        console.log('Lỗi khi callAddComment:', error);
        setIsSending(false); // Đảm bảo dừng trạng thái gửi nếu có lỗi
      }
    };

    //up lên cloudiary
    const uploadFile = async (file) => {
      try {
        const data = new FormData();
        data.append('file', {
          uri: file.uri,
          type: file.type,
          name: file.fileName || (file.type.startsWith('video/') ? 'video.mp4' : 'image.png'),
        });
        data.append('upload_preset', 'ml_default');

        const response = await axios.post('https://api.cloudinary.com/v1_1/ddasyg5z3/upload', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        //console.log(file.type.type);
        const fileUrl = response.data.secure_url;
        console.log('🌍 Link file Cloudinary:', fileUrl);

        if (file.type.startsWith('image/')) {
          console.log("image");
          callAddComment('image', fileUrl)
        }
        if (file.type.startsWith('video/')) {
          console.log("video");
          callAddComment('video', fileUrl)
        }

      } catch (error) {
        console.log('uploadFile -> ', error.response ? error.response.data : error.message);
        console.log("lỗi khi tải file")
      }
    };

    //mở thư viện
    const onOpenGallery = async () => {
      try {
        const options = {
          mediaType: 'mixed',
          quality: 1,
        };

        launchImageLibrary(options, async (response) => {
          //console.log(response);
          if (response.didCancel) {
            console.log("đã hủy")
          } else if (response.errorMessage) {
            console.log("lỗi khi mở thư viện")
          } else {
            const selectedFile = response.assets[0];
            console.log('📂 File đã chọn:', selectedFile.uri);

            await uploadFile(selectedFile);
          }
        });
      } catch (error) {
        console.log('onOpenGallery -> ', error);
      }
    };

    //xoa post
    const onDelete = () => {
      callChangeDestroyPost(ID_post)
    }

    useEffect(() => {
      //console.log("ID_post nhận được:", ID_post); // Kiểm tra ID có đúng không
      if (ID_post) {
        callGetChiTietPost(ID_post);
      }
    }, [ID_post]);

    // Khi selectedTab thay đổi, cập nhật nội dung BottomSheet
    useEffect(() => {
      if (isFirstRender) {
        setIsFirstRender(false);
        return; // Bỏ qua lần chạy đầu tiên
      }

      if (selectedTab !== null) {
        openBottomSheet(50, renderBottomSheetContent());
      }
    }, [selectedTab]);


    const renderBottomSheetContent = () => {
      return (
        <View style={styles.container}>
          <View style={styles.headerReaction}>
            <TouchableOpacity style={styles.backButton} onPress={closeBottomSheet}>
              <Icon4 name="angle-left" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Người đã bày tỏ cảm xúc</Text>
          </View>

          {/* Tabs */}
          <View style={styles.tabContainer}>
            <FlatList
              data={tabs}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.tab, selectedTab === item.id && styles.selectedTab]}
                  onPress={() => setSelectedTab(item.id)}>
                  <Text style={styles.tabIcon}>{item.icon}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.id}
            />
          </View>

          {/* Danh sách người dùng */}
          <FlatList
            data={filteredUsers}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.container_listReaction}>
                  <Text style={styles.nameItemReaction}>{item.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.nameItemReaction}>{item.reactionIcon}</Text>
                    <Text style={{ marginLeft: 5, color: 'black' }}>{item.quantity}</Text>
                  </View>
                </View>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      );
    };

    //   Tạo danh sách tab từ uniqueReactions
    const uniqueReactions_tab = Array.from(
      new Map(
        reactionsOfPost.map(reaction => [
          reaction.ID_reaction._id,
          reaction.ID_reaction,
        ]),
      ).values(),
    );

    const tabs = [
      { id: 'all', icon: 'Tất cả' },
      ...uniqueReactions_tab.map(reaction => ({
        id: reaction._id,
        icon: reaction.icon,
      })),
    ];

    // Lọc danh sách người dùng theo reaction được chọn
    const filteredUsers = reactionsOfPost
      .filter(
        reaction =>
          selectedTab === 'all' || reaction.ID_reaction._id === selectedTab,
      )
      .map(reaction => ({
        id: `${reaction.ID_user._id}-${reaction._id}`, // Tạo key duy nhất
        userId: reaction.ID_user._id, // ID của người dùng
        name: `${reaction.ID_user.first_name} ${reaction.ID_user.last_name}`,
        avatar: reaction.ID_user.avatar,
        reactionId: reaction.ID_reaction._id,
        reactionIcon: reaction.ID_reaction.icon,
        quantity: reaction.quantity,
      }));


    // lọc reactions 
    // const uniqueReactions = Array.from(
    //   new Map(
    //     reactionsOfPost
    //       .filter(reaction => reaction.ID_reaction !== null)
    //       .map(reaction => [reaction.ID_reaction._id, reaction])
    //   ).values()
    // );

    // Nhóm reaction theo ID và đếm số lượng
    const reactionCount = reactionsOfPost.reduce((acc, reaction) => {
      if (!reaction.ID_reaction) return acc; // Bỏ qua reaction null
      const id = reaction.ID_reaction._id;
      acc[id] = acc[id] ? { ...acc[id], count: acc[id].count + 1 } : { ...reaction, count: 1 };
      return acc;
    }, {});

    // Chuyển object thành mảng và lấy 2 reaction có số lượng nhiều nhất
    const topReactions = Object.values(reactionCount)
      .sort((a, b) => b.count - a.count) // Sắp xếp giảm dần theo count
      .slice(0, 2); // Lấy 2 reaction có số lượng nhiều nhất

    // Tìm reaction của chính người dùng hiện tại
    const userReaction = reactionsOfPost.find(
      (reaction) => reaction.ID_user._id === me._id
    );

    const handleLongPress = () => {
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




    useEffect(() => {
      const updateDiff = () => {
        const now = Date.now();
        const createdTime = new Date(post?.createdAt).getTime(); // Chuyển từ ISO sang timestamp

        let createdTimeShare = null;
        if (post?.ID_post_shared?.createdAt) {
          createdTimeShare = new Date(post?.ID_post_shared.createdAt).getTime();
        }

        if (isNaN(createdTime)) {
          setTimeAgo("Không xác định");
          setTimeAgoShare("Không xác định");
          return;
        }

        // Tính thời gian cho bài viết chính
        const diffMs = now - createdTime;
        if (diffMs < 0) {
          setTimeAgo("Vừa xong");
        } else {
          const seconds = Math.floor(diffMs / 1000);
          const minutes = Math.floor(seconds / 60);
          const hours = Math.floor(minutes / 60);
          const days = Math.floor(hours / 24);

          if (days > 0) {
            setTimeAgo(`${days} ngày trước`);
          } else if (hours > 0) {
            setTimeAgo(`${hours} giờ trước`);
          } else if (minutes > 0) {
            setTimeAgo(`${minutes} phút trước`);
          } else {
            setTimeAgo(`${seconds} giây trước`);
          }
        }

        // Nếu bài viết là chia sẻ, tính thời gian cho bài gốc
        if (createdTimeShare !== null) {
          const diffMsShare = now - createdTimeShare;
          if (diffMsShare < 0) {
            setTimeAgoShare("Vừa xong");
          } else {
            const seconds = Math.floor(diffMsShare / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);

            if (days > 0) {
              setTimeAgoShare(`${days} ngày trước`);
            } else if (hours > 0) {
              setTimeAgoShare(`${hours} giờ trước`);
            } else if (minutes > 0) {
              setTimeAgoShare(`${minutes} phút trước`);
            } else {
              setTimeAgoShare(`${seconds} giây trước`);
            }
          }
        }
      };

      updateDiff();
      // const interval = setInterval(updateDiff, 1000);

      // return () => clearInterval(interval);
    }, [post]);

    const callAddPost_Reaction = async (ID_reaction, name, icon) => {
      try {
        const paramsAPI = {
          ID_post: post._id,
          ID_user: me._id,
          ID_reaction: ID_reaction,
        };
        await dispatch(addPost_Reaction(paramsAPI))
          .unwrap()
          .then(response => {
            //console.log(response.post_reaction._id);
            const newReaction = {
              _id: ID_reaction,
              name: name,
              icon: icon,
            };
            updatePostReaction(
              newReaction,
              response.post_reaction._id,
            )
          })
          .catch(error => {
            console.log('Lỗi call api addPost_Reaction', error);
          });
      } catch (error) {
        console.log('Lỗi trong addPost_Reaction:', error);
      }
    };

    // Hàm cập nhật bài post sau khi thả biểu cảm
    const updatePostReaction = (newReaction, ID_post_reaction) => {
      if (userReaction) {
        //userReaction có thì sửa userReaction trong reactionsOfPost
        const updatedReactions = reactionsOfPost.map(reaction =>
          reaction.ID_user._id === me._id
            ? {
              _id: ID_post_reaction, // ID của reaction mới từ server
              ID_user: {
                _id: me._id,
                first_name: me.first_name,
                last_name: me.last_name,
                avatar: me.avatar,
              },
              ID_reaction: newReaction
            }
            : reaction
        );
        setReactionsOfPost(updatedReactions)
      } else {
        // chưa thêm vào
        setReactionsOfPost([...reactionsOfPost, {
          _id: ID_post_reaction, // ID của reaction mới từ server
          ID_user: {
            _id: me._id,
            first_name: me.first_name,
            last_name: me.last_name,
            avatar: me.avatar,
          },
          ID_reaction: newReaction
        }])
      }
    };

    // Hàm cập nhật bài post sau khi xóa biểu cảm
    const deletPostReaction = (ID_post_reaction) => {
      const updatedReactions = reactionsOfPost.filter(reaction =>
        reaction._id !== ID_post_reaction
      );
      setReactionsOfPost(updatedReactions)
    };

    const callDeletePost_reaction = async (ID_post_reaction) => {
      try {
        const paramsAPI = {
          _id: ID_post_reaction
        };
        await dispatch(deletePost_reaction(paramsAPI))
          .unwrap()
          .then(response => {
            // params: ID_post_reaction
            deletPostReaction(
              ID_post_reaction
            )
          })
          .catch(error => {
            console.log('Lỗi call api callDeletePost_reaction', error);
          });
      } catch (error) {
        console.log('Lỗi trong callDeletePost_reaction:', error);
      }
    };

    const hasCaption = post?.caption?.trim() !== '';

    const hasMedia = post?.medias?.length > 0 || post?.ID_post_shared?.medias?.length > 0;

    const getIcon = (status) => {
      switch (status) {
        case 'Bạn bè':
          return <Icon name="people" size={12} color="gray" />;
        case 'Công khai':
          return <Icon name="earth" size={12} color="gray" />;
        case 'Chỉ mình tôi':
          return <Icon name="lock-closed" size={12} color="gray" />;
        default:
          return <Icon name="lock-closed" size={12} color="gray" />; // mặc định
      }
    }
    const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');


    //render anh
    const renderMediaGrid = (medias) => {
      const mediaCount = medias.length;
      if (mediaCount === 0) return null;
      return (
        <View style={styles.mediaContainer}>
          {medias.slice(0, 5).map((uri, index) => (
            <TouchableOpacity key={index} style={getMediaStyle(mediaCount, index)}
              onPress={() => {
                setSelectedImage(uri);
                if (mediaCount > 5) {
                  setTypeClick("image");
                } else {
                  setImageModalVisible(true);
                }
              }}
            >
              {isVideo(uri) ? (
                <View style={styles.videoWrapper}>
                  <Video source={{ uri }} style={styles.video} resizeMode="cover" paused />
                  <View style={styles.playButton}>
                    <Icon name="play-circle" size={40} color="white" />
                  </View>
                </View>
              ) : (
                <Image source={{ uri }} style={styles.image} resizeMode="cover" />
              )}

              {index === 4 && mediaCount > 5 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{mediaCount - 5}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      );
    };

    const renderMediaSDetail = (medias) => {
      const mediaCount = medias.length;
      if (mediaCount === 0) return null;

      return (
        <FlatList
          data={medias}
          keyExtractor={(uri, index) => `${uri}-${index}`}
          renderItem={({ item: uri, index }) => (
            <TouchableOpacity
              style={styles.mediaItemDetail}
              onPress={() => {
                setSelectedImage(uri);
                setImageModalVisible(true);
              }}
            >
              {isVideo(uri) ? (
                <View style={styles.videoWrapperDetail}>
                  <Video source={{ uri }} style={styles.videoDetail} resizeMode="cover" paused />
                  <View style={styles.playButtonDetail}>
                    <Icon name="play-circle" size={40} color="white" />
                  </View>
                </View>
              ) : (
                <Image source={{ uri }} style={styles.imageDetail} resizeMode="cover" />
              )}

              {/* {index === 4 && mediaCount > 5 && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>+{mediaCount - 5}</Text>
                </View>
              )} */}
            </TouchableOpacity>
          )}
        />
      );
    };

    const getMediaStyle = (count, index) => {
      if (count === 1) {
        return styles.singleMedia;
      } else if (count === 2) {
        return styles.doubleMedia;
      } else if (count === 3) {
        return index === 0 ? styles.tripleMediaFirst : styles.tripleMediaSecond;
      } else if (count === 4) {
        return styles.quadMedia;
      } else { // 5+ media
        if (index < 2) return styles.fivePlusMediaFirstRow;
        else if (index === 2) return styles.fivePlusMediaSecondRowLeft;
        else if (index === 3) return styles.fivePlusMediaSecondRowMiddle;
        else return styles.fivePlusMediaSecondRowRight;
      }
    };


    //call api addPost
    const callAddPostShare = async (captionShare, status) => {
      if (!me || !me._id) {
        console.log('Người dùng chưa đăng nhập hoặc thông tin người dùng không hợp lệ');
        setFailedModalVisible(true);
        setTimeout(() => {
          setFailedModalVisible(false);
        }, 1500);
        return;
      }

      if (!post || !post._id) {
        console.log('Bài viết không hợp lệ');
        setFailedModalVisible(true);
        setTimeout(() => {
          setFailedModalVisible(false);
        }, 1500);
        return;
      }

      try {
        setIsSharing(true);
        console.log('Sharing with status:', status);
        const paramsAPI = {
          ID_user: me._id,
          caption: captionShare,
          medias: [],
          status: status,
          type: 'Share',
          ID_post_shared: post.ID_post_shared ? post.ID_post_shared._id : post._id,
          tags: [],
        };
        await dispatch(addPost(paramsAPI))
          .unwrap()
          .then((response) => {
            setShareVisible(false);
            setSuccessModalVisible(true);
            setTimeout(() => {
              setSuccessModalVisible(false);
            }, 1500);
          })
          .catch((error) => {
            console.log('Lỗi khi share bài viết:', error);
            setShareVisible(false);
            setFailedModalVisible(true);
            setTimeout(() => {
              setFailedModalVisible(false);
            }, 1500);
          });
      } catch (error) {
        console.log('Lỗi share bài viết:', error);
        setShareVisible(false);
        setFailedModalVisible(true);
        setTimeout(() => {
          setFailedModalVisible(false);
        }, 1500);
      } finally {
        setIsSharing(false);
        closeBottomSheet();
      }
    };

    const renderComment = useCallback(({ item }) => (
      <ListComment
        comment={item}
        onReply={(replyData) => {
          setReply(replyData);
          setIsReplying(true);
          setComment(`${replyData.ID_user.first_name} ${replyData.ID_user.last_name} `);
          textInputRef.current?.focus(); // Tập trung vào TextInput
        }}
      />
    ), []);

    const header = () => {
      if (isLoading) {
        return (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        );
      }


     // Nếu bài viết không hợp lệ, không hiển thị nội dung bài viết
    if (!isPostValid()) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: height, // Đảm bảo chiếm toàn bộ chiều cao màn hình
          }}
        >
          <Text style={{ fontWeight: '500', fontSize: 16, color: 'black' }}>
            {post && post._destroy && me._id !== post.ID_user._id
              ? 'Bài viết đã bị xóa.'
              : 'Bạn không có quyền truy cập vào bài viết!'}
          </Text>
        </View>
      );
    }
      return (
        <View style={styles.postContainer}>
          <View>
            {/* Header share  */}
            {
              post.ID_post_shared &&
              <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
                <View style={styles.header}>
                  <View style={styles.userInfo}>
                    <View style={{ marginRight: width * 0.04 }}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate(oStackHome.TabHome);
                        }}
                      >
                        <Icon name="arrow-back" size={25} color="black" />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('TabHome', {
                        screen: 'Profile',
                        params: { _id: post?.ID_user?._id },
                      })}
                    >
                      <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                    </TouchableOpacity>
                    <View style={{ marginLeft: width * 0.05 }}>
                      <Text style={styles.name}
                        onPress={() => navigation.navigate('TabHome', {
                          screen: 'Profile',
                          params: { _id: post?.ID_user?._id },
                        })}
                      >{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text>
                      <View style={styles.boxName}>
                        <Text style={styles.time}>{timeAgo}</Text>
                        {/* <Icon name="earth" size={12} color="gray" /> */}
                        {
                          getIcon(post.status)
                        }
                      </View>

                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      openBottomSheet(
                        25,
                        <View style={{ backgroundColor: '#d9d9d960', borderRadius: 10, padding: 10 }}>
                          {
                            me._id != post.ID_user._id ? (
                              <TouchableOpacity
                                onPress={() => {
                                  closeBottomSheet()
                                  navigation.navigate('Report', { ID_post: post._id, ID_user: null })
                                }}
                                style={[styles.deleteButton]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                  <View>
                                    <Icon name="alert-circle" size={20} color="black" />
                                  </View>
                                  <Text style={[styles.deleteText,]}
                                  >{
                                      !post._destroy
                                      && (
                                        "Báo cáo"
                                      )
                                    }
                                  </Text>
                                </View>

                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity onPress={() => { onDelete(), closeBottomSheet(), navigation.navigate(oStackHome.TabHome) }}
                                style={[styles.deleteButton, post._destroy && { backgroundColor: "blue" }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                  {
                                    post._destroy ?
                                      <View>
                                        <Icon name="refresh-sharp" size={20} color="black" />
                                      </View>
                                      :
                                      <View>
                                        <Icon name="trash" size={20} color="black" />
                                      </View>
                                  }
                                  <Text style={[styles.deleteText,]}
                                  >{
                                      post._destroy ? (
                                        "Phục hồi"
                                      ) : "Xóa bài viết"
                                    }
                                  </Text>
                                </View>

                              </TouchableOpacity>
                            )
                          }

                          {
                            post._destroy && (
                              <TouchableOpacity
                                onPress={() => {
                                  onDeleteVinhVien()
                                  closeBottomSheet()
                                }}
                                style={styles.deleteButton}>
                                <Text style={styles.deleteText}
                                >Xóa vĩnh viễn
                                </Text>
                              </TouchableOpacity>
                            )
                          }
                        </View>
                      )
                    }

                  >
                    <Icon name="ellipsis-horizontal" size={22} color="black" />
                  </TouchableOpacity>
                </View>
                <View>
                  {
                    hasCaption && <Text style={[styles.captionShare, { color: 'black' }]}>{post.caption}</Text>
                  }
                </View>
              </View>

            }
            {/* Header goc  */}
            <View style={post.ID_post_shared ? styles.header1 : styles.header2} >
              <View style={styles.header}>
                <View style={styles.boxInfor1}>
                  {
                    post.ID_post_shared
                      ?
                      <View style={styles.userInfo}>
                        {/* {
                        typeClick === "image" && ( // Nếu là chi tiết ảnh thì hiển thị nút Back
                          <TouchableOpacity
                            style={{ marginRight: width * 0.04 }}
                            onPress={() => {
                              navigation.goBack(); // Quay lại màn trước
                            }}
                          >
                            <Icon name="arrow-back" size={25} color="black" />
                          </TouchableOpacity>
                        )
                      } */}
                        <TouchableOpacity onPress={() =>
                          navigation.navigate('TabHome', {
                            screen: 'Profile',
                            params: { _id: post?.ID_post_shared?.ID_user?._id },
                          })}>
                          <Image source={{ uri: post.ID_post_shared.ID_user.avatar }} style={styles.avatar} />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 15 }}>
                          <Text style={styles.name}
                            onPress={() =>
                              navigation.navigate('TabHome', {
                                screen: 'Profile',
                                params: { _id: post?.ID_post_shared?.ID_user?._id },
                              })}
                          >
                            {post.ID_post_shared.ID_user.first_name} {post.ID_post_shared.ID_user.last_name}
                            {post.ID_post_shared.tags.length > 0 && (
                              <Text>
                                <Text style={{ color: 'gray' }}> cùng với </Text>
                                <Text style={[styles.name]}
                                  onPress={() => navigation.navigate('TabHome', {
                                    screen: "Profile", params: { _id: post.ID_post_shared.tags[0]._id }
                                  })}
                                >
                                  {post.ID_post_shared.tags[0]?.first_name} {post.ID_post_shared.tags[0]?.last_name}
                                </Text>
                                {post.ID_post_shared.tags.length > 1 && (
                                  <>
                                    <Text style={{ color: 'gray' }}> và </Text>
                                    <Text onPress={() => navigation.navigate('ListTag', { ListTag: post.ID_post_shared.tags })} style={[styles.name]}>
                                      {post.ID_post_shared.tags.length - 1} người khác
                                    </Text>
                                  </>
                                )}
                              </Text>
                            )}
                          </Text>
                          {/* <Text style={styles.name}>{post.ID_post_shared.ID_user.first_name + " " + post.ID_post_shared.ID_user.last_name}</Text> */}
                          <View style={styles.boxName}>
                            <Text style={styles.time}>{timeAgoShare}</Text>
                            {/* <Icon name="earth" size={12} color="gray" /> */}
                            {
                              getIcon(post.ID_post_shared.status)
                            }
                          </View>
                        </View>
                      </View>
                      :
                      <View style={styles.userInfo}>
                        <View style={{ marginRight: width * 0.04 }}>
                          <TouchableOpacity
                            onPress={() => {
                              navigation.navigate(oStackHome.TabHome);// back về
                            }}
                          >
                            <Icon name="arrow-back" size={25} color="black" />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() =>
                          navigation.navigate('TabHome', {
                            screen: 'Profile',
                            params: { _id: post?.ID_user?._id },
                          })}>
                          <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                        </TouchableOpacity>
                        <View style={{ marginLeft: 15 }}>
                          <Text style={styles.name}
                            onPress={() =>
                              navigation.navigate('TabHome', {
                                screen: 'Profile',
                                params: { _id: post?.ID_user?._id },
                              })}>
                            {post.ID_user.first_name} {post.ID_user.last_name}
                            {post.tags.length > 0 && (
                              <Text>
                                <Text style={{ color: 'gray' }}> cùng với </Text>
                                <Text onPress={() => navigation.navigate('TabHome', { screen: "Profile", params: { _id: post.tags[0]._id } })} style={[styles.name]}>
                                  {post.tags[0]?.first_name} {post.tags[0]?.last_name}
                                </Text>
                                {post.tags.length > 1 && (
                                  <>
                                    <Text style={{ color: 'gray' }}> và </Text>
                                    <Text onPress={() => navigation.navigate('ListTag', { ListTag: post.tags })} style={[styles.name]}>
                                      {post.tags.length - 1} người khác
                                    </Text>
                                  </>
                                )}
                              </Text>
                            )}
                          </Text>
                          {/* <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text> */}
                          <View style={styles.boxName}>
                            <Text style={styles.time}>{timeAgo}</Text>
                            {/* <Icon name="earth" size={12} color="gray" /> */}
                            {
                              getIcon(post.status)
                            }
                          </View>
                        </View>
                      </View>
                  }
                </View>

                {
                  !post.ID_post_shared &&
                  <View style={{ marginRight: 15 }}>
                    <TouchableOpacity
                      // disabled={me._id != post.ID_user._id}
                      onPress={() =>
                        openBottomSheet(
                          25,
                          <View style={{ backgroundColor: '#d9d9d960', borderRadius: 10, padding: 10 }}>
                            {
                              me._id != post.ID_user._id ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    closeBottomSheet()
                                    navigation.navigate('Report', { ID_post: post._id, ID_user: null })
                                  }}
                                  style={[styles.deleteButton]}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    <View>
                                      <Icon name="alert-circle" size={20} color="black" />
                                    </View>
                                    <Text style={[styles.deleteText,]}
                                    >{
                                        !post._destroy
                                        && (
                                          "Báo cáo"
                                        )
                                      }
                                    </Text>
                                  </View>

                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity onPress={() => { onDelete(), closeBottomSheet(), navigation.navigate(oStackHome.TabHome) }}
                                  style={[styles.deleteButton]}>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
                                    {
                                      post._destroy ?
                                        <View>
                                          <Icon name="refresh-sharp" size={20} color="black" />
                                        </View>
                                        :
                                        <View>
                                          <Icon name="trash" size={20} color="black" />
                                        </View>
                                    }
                                    <Text style={[styles.deleteText,]}
                                    >{
                                        post._destroy ? (
                                          "Phục hồi"
                                        ) : "Xóa bài viết"
                                      }
                                    </Text>
                                  </View>

                                </TouchableOpacity>
                              )
                            }
                            {
                              post._destroy && (
                                <TouchableOpacity
                                  onPress={() => {
                                    onDeleteVinhVien()
                                    closeBottomSheet()
                                  }}
                                  style={styles.deleteButton}>
                                  <Text style={styles.deleteText}
                                  >Xóa vĩnh viễn
                                  </Text>
                                </TouchableOpacity>
                              )
                            }
                          </View>,
                        )
                      }
                    >
                      <Icon name="ellipsis-horizontal" size={22} color="black" />
                    </TouchableOpacity>
                  </View>
                }
              </View>
              {
                post.ID_post_shared
                  ? (
                    <Text style={styles.caption}>{post?.ID_post_shared.caption}</Text>
                  )
                  :
                  (
                    <Text style={styles.caption}>{post?.caption}</Text>
                  )
              }
            </View>
          </View >
          {
            typeClick == "image"
              ? (hasMedia && renderMediaSDetail(post.ID_post_shared ? post.ID_post_shared.medias : post.medias))
              : (hasMedia && renderMediaGrid(post.ID_post_shared ? post.ID_post_shared.medias : post.medias))
          }
          {
            !post._destroy &&
            <View style={styles.interactions}>
              <TouchableOpacity
                ref={reactionRef} // Gắn ref vào đây
                style={[
                  styles.action,
                  userReaction &&
                  { backgroundColor: 'white' }
                ]}
                onLongPress={() => {
                  handleLongPress();
                }}
                onPress={() => userReaction
                  ? callDeletePost_reaction(userReaction._id)
                  : callAddPost_Reaction(reactions[0]._id, reactions[0].name, reactions[0].icon)
                }
              >
                {/* <Icon5 name="like2" size={25} color="black" /> */}
                <Text
                  style={styles.actionText}
                >
                  {userReaction ? userReaction.ID_reaction.icon : <Icon5 name="like2" size={20} color="black" />} {/* Nếu đã react, hiển thị icon đó */}
                </Text>
                <Text
                  style={[
                    styles.actionText,
                    userReaction &&
                    { color: '#0064E0' }
                  ]}
                >
                  {userReaction ? userReaction.ID_reaction.name : reactions[0].name} {/* Nếu đã react, hiển thị icon đó */}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.action}
                onPress={() => {
                  openBottomSheet(55, (
                    <SharedPost
                      me={me}
                      callAddPostShare={callAddPostShare}
                      copyToClipboard={copyToClipboard}
                      post={post}
                      width={width}
                      styleShared={styleShared}
                      setShareVisible={setShareVisible}
                    />
                  ));
                }}>
                <Icon4 name="share-alt" size={20} color="black" />
                <Text style={styles.actionText}>Chia sẻ</Text>
              </TouchableOpacity>


            </View>
          }

          {/* reactions biểu cảm */}
          < Modal
            visible={reactionsVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setReactionsVisible(false)}
          >
            <TouchableWithoutFeedback
              onPress={() => setReactionsVisible(false)}
            >
              <View style={styles.overlay}>
                <View
                  style={[
                    {
                      position: "absolute",
                      top: menuPosition.top,
                      left: 10,
                    }
                  ]} // Cập nhật vị trí reactions
                >
                  <View
                    style={[styles.reactionBar]}
                  >
                    {
                      reactions.map((reaction, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.reactionButton}
                          onPress={() => {
                            callAddPost_Reaction(reaction._id, reaction.name, reaction.icon)
                            setReactionsVisible(false);
                          }}
                        >
                          <Text style={styles.reactionText}>{reaction.icon}</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal >



          {/* Modal hiển thị ảnh */}
          <Modal
            visible={isImageModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setImageModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setImageModalVisible(false)}>
              <View style={styles.modalOverlay}>
                {isVideo(selectedImage) ? (
                  <Video
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                    resizeMode="contain"
                    controls={true} // Hiển thị nút điều khiển cho video
                    paused={false} // Tự động phát khi mở modal
                    onError={(e) => console.log("Video error:", e)} // Xử lý lỗi nếu có
                  />
                ) : (
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.fullImage}
                    resizeMode="contain"
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          <View style={[styles.line, { marginBottom: 20 }]}></View>

          {/* reaction of post */}
          <View
            style={[
              styles.boxHeader,
              {
                justifyContent: 'space-between',
                marginHorizontal: 20,
              },
            ]}>
            <TouchableOpacity
              onPress={() => {
                //console.log(detail_reactions);
                //openBottomSheet(50, detail_reactions);
              }}>
              {/* reactions of post */}

              <View style={[styles.vReactionsOfPost]}>
                <View>
                  {
                    reactionsOfPost.length > 0
                    && (
                      <TouchableOpacity
                        style={{ flexDirection: "row" }}
                        onPress={() => { openBottomSheet(50, renderBottomSheetContent()), setIsVisible(true) }}
                      >
                        {topReactions.map((reaction, index) => (
                          <Text key={index} style={{ color: 'black' }}>
                            {reaction.ID_reaction.icon}
                          </Text>
                        ))}
                        <Text style={styles.slReactionsOfPost}>
                          {reactionsOfPost.some(reaction => reaction.ID_user._id === me._id)
                            ? reactionsOfPost.length === 1
                              ? `${me?.first_name + " " + me?.last_name}`
                              : `Bạn và ${reactionsOfPost.length - 1} người khác`
                            : `${reactionsOfPost.length}`}
                        </Text>
                      </TouchableOpacity>
                    )
                  }
                </View>
                <View>
                  {
                    comments.length > 0
                    && (
                      <View>
                        {/*so luong  bình luận */}
                        {
                          countComments > 0
                          && (
                            <Text style={[styles.slReactionsOfPost]}>
                              {countComments} bình luận
                            </Text>
                          )
                        }
                      </View>
                    )
                  }
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View >
      );
    };

    //comments
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {isLoading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : isPostValid() ? (
          <>
            <FlatList
              data={comments}
              renderItem={renderComment}
              keyExtractor={(item) => item._id.toString()}
              extraData={comments}
              ListHeaderComponent={header}
              contentContainerStyle={{ paddingBottom: '17%' }}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={onRefresh}
                  colors={['#007bff']} // Màu của vòng xoay làm mới
                  tintColor="#007bff" // Màu trên iOS
                />
              }
            />
            {/* Ô nhập bình luận */}
            {typeClick === 'comment' && (
              <View style={styles.boxInputText}>
                {reply && (
                  <View style={styles.replyPreview}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.replyTitle}>Đang phản hồi</Text>
                      <Text style={[styles.replyContent, { fontWeight: 'bold' }]}>
                        {` ${reply.ID_user.first_name} ${reply.ID_user.last_name} `}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.replyRight}
                      onPress={() => {
                        setReply(null);
                        setIsReplying(false);
                        setComment('');
                      }}
                    >
                      <Text style={styles.replyTitle}>Hủy</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={styles.boxCommentAll}>
                  <View style={styles.boxComment}>
                    <View style={styles.librarySelect}>
                      <TouchableOpacity onPress={onOpenGallery}>
                        <Icon name="image" size={25} color="#007bff" />
                      </TouchableOpacity>
                    </View>
                    <TextInput
                      ref={textInputRef}
                      style={styles.textInput}
                      placeholder={
                        isReplying
                          ? `Trả lời ${reply?.ID_user.first_name} ${reply?.ID_user.last_name}`
                          : 'Viết bình luận'
                      }
                      multiline={true}
                      value={comment}
                      onChangeText={setComment}
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => callAddComment('text', comment)}
                        style={styles.sendButton}
                        disabled={isSending}
                      >
                        <Icon name="send" size={25} color="#007bff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontWeight: '500', fontSize: 16, color: 'black' }}>
              {post && post._destroy && me._id !== post.ID_user._id
                ? 'Bài viết đã bị xóa.'
                : 'Bạn không có quyền truy cập vào bài viết!'}
            </Text>
          </View>
        )}
        <SuccessModal visible={successModalVisible} message={'Đã chia sẻ bài viết!'} />
        <FailedModal visible={failedModalVisible} message={'Đã có lỗi khi chia sẻ bài viết!'} />
        <LoadingModal visible={isSharing} />
      </View>
    );
  };

export default PostDetail;
