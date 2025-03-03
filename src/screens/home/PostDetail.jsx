import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import styles from '../../styles/components/items/CommentS';
import ListComment from '../../components/items/ListComment';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '../../context/BottomSheetContext';
import { useDispatch, useSelector } from 'react-redux';
import {
  getChiTietPost,
  addPost_Reaction, // thả biểu cảm
  addPost, // api share
  addComment, // api tạo comment
} from '../../rtk/API';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

const PostDetail = (props) => {
  const { navigation } = props
  const route = useRoute();
  const { ID_post } = route.params || {}

  const dispatch = useDispatch()
  const me = useSelector(state => state.app.user)
  const reactions = useSelector(state => state.app.reactions)

  const { openBottomSheet, closeBottomSheet } = useBottomSheet();
  const token = useSelector(state => state.app.token);

  const [comments, setComments] = useState([])
  const [comment, setComment] = useState('')
  const [reply, setReply] = useState(null);
  const [post, setPost] = useState(null)

  const [timeAgo, setTimeAgo] = useState();
  const [timeAgoShare, setTimeAgoShare] = useState();

  const [reactionsVisible, setReactionsVisible] = useState(false);
  const [shareVisible, setShareVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // trang thai
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: "Công khai"
  });
  const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
  const reactionRef = useRef(null); // ref để tham chiếu tới tin nhắn

  //share 
  const [captionShare, setCaptionShare] = useState('');

  // Cảnh
  // post_reactions: list của reaction của post
  const [reactionsOfPost, setReactionsOfPost] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [isFirstRender, setIsFirstRender] = useState(true);


  //call api chi tiet bai post
  const callGetChiTietPost = async (ID_post) => {
    try {
      //console.log("ID_post:", ID_post);
      const response = await dispatch(getChiTietPost({ ID_post, token })).unwrap();

      if (response && response.post) {
        //console.log("API:", response.post);
        setPost(response.post);
        setComments(response.post?.comments)
        setReactionsOfPost(response.post.post_reactions)
      } else {
        console.log('API không trả về bài viết.');
      }
    } catch (error) {
      console.log('Lỗi khi lấy chi tiết bài viết:', error);
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
      if ((comment == null && type === 'text') || post == null) {
        console.log('thiếu ')
        return null;
      }
      const paramsAPI = {
        ID_user: me._id,
        ID_post: post._id,
        content: content,
        type: type,
        ID_comment_reply: reply || undefined,
      };

      await dispatch(addComment(paramsAPI))
        .unwrap()
        .then((response) => {
          if (response.comment?.ID_comment_reply) {
            setComments((prevComments) => [...addReplyToComment(prevComments, response.comment)]);
          } else {
            setComments((prevComments) => [...prevComments, response.comment]);
          }
          setComment('');
          setReply(null);
        })
        .catch((error) => {
          console.error('Error1 addComment:', error);
        });
    } catch (error) {
      console.log('Lỗi khi callAddComment:', error);
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

      const response = await axios.post('https://api.cloudinary.com/v1_1/ddbolgs7p/upload', data, {
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

  useEffect(() => {
    console.log("ID_post nhận được:", ID_post); // Kiểm tra ID có đúng không
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
  const uniqueReactions = Array.from(
    new Map(
      reactionsOfPost
        .filter(reaction => reaction.ID_reaction !== null)
        .map(reaction => [reaction.ID_reaction._id, reaction])
    ).values()
  );

  // Tìm reaction của chính người dùng hiện tại
  const userReaction = post?.post_reactions.find(
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

  //share
  const handleShare = () => {
    if (reactionRef.current) {
      reactionRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY - 57,
          left: pageX,
          right: pageX,
        });
        setShareVisible(true);
      });
    }
  }

  // Các tùy chọn trạng thái
  const status = [
    {
      status: 1,
      name: "Công khai"
    },
    {
      status: 2,
      name: "Bạn bè"
    },
    {
      status: 3,
      name: "Chỉ mình tôi"
    },
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
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
          //console.log(response.message);
          callGetChiTietPost(post._id);
        })
        .catch(error => {
          console.log('Lỗi call api addPost_Reaction', error);
        });
    } catch (error) {
      console.log('Lỗi trong addPost_Reaction:', error);
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

  const renderMediaGrid = (medias) => {
    const mediaCount = medias.length;

    if (mediaCount === 0) return null;

    return (
      <View style={styles.mediaContainer}>
        {medias.slice(0, 5).map((uri, index) => (
          <TouchableOpacity key={index} style={getMediaStyle(mediaCount, index)}>
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
  const callAddPostShare = async () => {
    try {
      const paramsAPI = {
        ID_user: me._id,
        caption: captionShare,
        medias: [],
        status: selectedOption.name,
        type: 'Share',
        ID_post_shared: post.ID_post_shared ? post.ID_post_shared._id : post._id,//nếu share bài post share thì share bài gốc 
        tags: [],
      }
      //console.log("push", paramsAPI);
      await dispatch(addPost(paramsAPI))
        .unwrap()
        .then((response) => {
          //console.log(response)
          setShareVisible(false)
        })
        .catch((error) => {
          console.log('Error1 callAddPostShare:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  const header = () => {
    if (!post) {
      return <Text>Đang tải dữ liệu...</Text>;
    }
    return (
      <View>
        {/* Header share  */}
        {
          post.ID_post_shared &&
          <View style={styles.header}>
            <View style={styles.userInfo}>
              <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.name}>{post?.ID_user?.first_name + " " + post?.ID_user?.last_name}</Text>
                <View style={styles.boxName}>
                  <Text style={styles.time}>{timeAgo}</Text>
                  {/* <Icon name="earth" size={12} color="gray" /> */}
                  {
                    getIcon(post.status)
                  }
                </View>
                {
                  hasCaption && <Text style={styles.caption}>{post.caption}</Text>
                }
              </View>
            </View>

            <TouchableOpacity
              disabled={me._id != post.ID_user._id}
              onPress={() =>
                openBottomSheet(
                  25,
                  <View>
                    <TouchableOpacity onPress={() => { onDelete(), closeBottomSheet() }}
                      style={[styles.deleteButton, post._destroy && { backgroundColor: "blue" }]}>
                      <Text style={[styles.deleteText,]}
                      >{
                          post._destroy ? (
                            "Phục hồi"
                          ) : "Xóa bài viết"
                        }
                      </Text>
                    </TouchableOpacity>
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
        {/* Header goc  */}
        <View style={post.ID_post_shared ? styles.header1 : styles.header2} >
          <View style={styles.header}>
            <View style={{ padding: 10 }}>
              {
                post.ID_post_shared
                  ?
                  <View style={styles.userInfo}>
                    <Image source={{ uri: post.ID_post_shared.ID_user.avatar }} style={styles.avatar} />
                    <View style={{ marginLeft: 20 }}>
                      <Text style={styles.name}>
                        {post.ID_post_shared.ID_user.first_name} {post.ID_post_shared.ID_user.last_name}
                        {post.ID_post_shared.tags.length > 0 && (
                          <Text>
                            <Text style={{ color: 'gray' }}> cùng với </Text>
                            <Text onPress={() => navigation.navigate('Profile', { _id: post.ID_post_shared.tags[0]._id })} style={[styles.name]}>
                              {post.ID_post_shared.tags[0]?.first_name} {post.ID_post_shared.tags[0]?.last_name}
                            </Text>
                            {post.ID_post_shared.tags.length > 1 && (
                              <>
                                <Text style={{ color: 'gray' }}> và </Text>
                                <Text onPress={() => console.log('Xem danh sách tag')} style={[styles.name]}>
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
                    <Image source={{ uri: post?.ID_user?.avatar }} style={styles.avatar} />
                    <View style={{ marginLeft: 20 }}>
                      <Text style={styles.name}>
                        {post.ID_user.first_name} {post.ID_user.last_name}
                        {post.tags.length > 0 && (
                          <Text>
                            <Text style={{ color: 'gray' }}> cùng với </Text>
                            <Text onPress={() => navigation.navigate('Profile', { _id: post.tags[0]._id })} style={[styles.name]}>
                              {post.tags[0]?.first_name} {post.tags[0]?.last_name}
                            </Text>
                            {post.tags.length > 1 && (
                              <>
                                <Text style={{ color: 'gray' }}> và </Text>
                                <Text onPress={() => console.log('Xem danh sách tag')} style={[styles.name]}>
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


            <View>

            </View>
            {
              !post.ID_post_shared &&
              <TouchableOpacity
                disabled={me._id != post.ID_user._id}
                onPress={() =>
                  openBottomSheet(
                    25,
                    <View>
                      <TouchableOpacity onPress={() => { onDelete(), closeBottomSheet() }}
                        style={[styles.deleteButton, post._destroy && { backgroundColor: "blue" }]}>
                        <Text style={[styles.deleteText,]}
                        >{
                            post._destroy ? (
                              "Phục hồi"
                            ) : "Xóa bài viết"
                          }
                        </Text>
                      </TouchableOpacity>
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
            }
          </View>
          {
            post.ID_post_shared
              ? (
                hasCaption && <Text style={styles.caption}>{post?.ID_post_shared.caption}</Text>
              )
              :
              (
                hasCaption && <Text style={styles.caption}>{post?.caption}</Text>
              )
          }
        </View>
        {
          post.ID_post_shared
            ? (
              hasMedia && renderMediaGrid(post.ID_post_shared.medias)
            )
            :
            (
              hasMedia && renderMediaGrid(post.medias)
            )
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
            >
              {/* <Icon2 name="like" size={25} color="black" /> */}
              <Text
                style={styles.actionText}
              >
                {userReaction ? userReaction.ID_reaction.icon : "👍"} {/* Nếu đã react, hiển thị icon đó */}
              </Text>
              <Text
                style={[
                  styles.actionText,
                  userReaction &&
                  { color: '#FF9D00' }
                ]}
              >
                {userReaction ? userReaction.ID_reaction.name : "Thích"} {/* Nếu đã react, hiển thị icon đó */}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.action}
              onPress={() => {
                console.log("ID_post gửi đi:", post._id); // Kiểm tra ID trước khi chuyển trang
                navigation.navigate("PostDetail", { ID_post: post._id });
              }}
            >
              <Icon3 name="comment" size={20} color="black" />
              <Text style={styles.actionText}>Bình luận</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.action} onPress={() => handleShare()}>
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


        {/* Chia sẻ */}
        <Modal
          visible={shareVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setShareVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShareVisible(false)}>
            <View style={styles.overlay1}>
              <View style={styles.modalContainer}>
                <View >
                  <View style={{ flexDirection: 'row' }}>
                    <Image source={{ uri: me?.avatar }} style={styles.avatar} />
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.name}>{me?.first_name + " " + me?.last_name}</Text>
                      <View style={styles.boxStatus}>
                        <TouchableOpacity
                          style={styles.btnStatus}
                          onPress={() => setModalVisible(true)}
                        >
                          <Text style={styles.txtPublic}>{selectedOption.name}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginHorizontal: 10 }}>
                    <TextInput
                      placeholder='Hãy nói gì đó về nội dung này'
                      placeholderTextColor={"gray"}
                      multiline={true}
                      style={styles.contentShare}
                      value={captionShare}
                      onChangeText={setCaptionShare}
                    />
                    <View style={{ backgroundColor: "#0064E0", borderRadius: 10, alignItems: 'center' }}>
                      <TouchableOpacity
                        style={{ padding: 10 }}
                        onPress={callAddPostShare}
                      >
                        <Text style={{ color: 'white' }}>Chia sẻ ngay</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal để hiển thị danh sách trạng thái */}
        < Modal
          transparent={true}  // Cho phép nền của modal trong suốt, giúp nhìn thấy nền bên dưới modal.
          visible={modalVisible}  // Điều khiển việc modal có hiển thị hay không dựa trên trạng thái `modalVisible`.
          animationType="fade"  // Hiệu ứng khi modal xuất hiện. Ở đây là kiểu "slide" từ dưới lên.
          onRequestClose={() => setModalVisible(false)}  // Khi modal bị yêu cầu đóng (ví dụ trên Android khi bấm nút back), hàm này sẽ được gọi để đóng modal.
        >
          <TouchableOpacity
            style={styles.modalOverlay}  // Overlay của modal, tạo hiệu ứng làm mờ nền dưới modal.
            onPress={() => setModalVisible(false)}  // Đóng modal khi người dùng chạm vào khu vực bên ngoài modal.
          >
            {/* // Nội dung chính của modal, nơi hiển thị các tùy chọn. */}
            <View style={styles.modalContent1}>
              {
                status.map((option, index) => (
                  <TouchableOpacity
                    key={index}  // Mỗi phần tử trong danh sách cần có một key duy nhất.
                    style={styles.optionButton}  // Styling cho mỗi nút tùy chọn trong danh sách.
                    onPress={() => {
                      //console.log(option.name)
                      handleSelectOption(option)
                    }}  // Khi người dùng chọn một tùy chọn, hàm này sẽ được gọi để cập nhật trạng thái và đóng modal.
                  >
                    {/* // Hiển thị tên của tùy chọn. */}
                    <Text style={styles.optionText}>{option.name}</Text>
                  </TouchableOpacity>
                ))
              }
            </View>
          </TouchableOpacity>
        </Modal >

        <View style={[styles.line, { marginBottom: 20 }]}></View>

        {/* reaction of post */}
        <View
          style={[
            styles.boxHeader,
            {
              justifyContent: 'space-between',
              marginBottom: 20,
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
                      {uniqueReactions.map((reaction, index) => (
                        <Text key={index} style={{ color: 'black' }}>
                          {reaction.ID_reaction.icon}
                        </Text>
                      ))}
                      <Text style={styles.slReactionsOfPost}>
                        {reactionsOfPost.length}
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
                        comments.length > 0
                        && (
                          <Text style={[styles.slReactionsOfPost]}>
                            {post?.comments.length} bình luận
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
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={comments}
        renderItem={({ item }) => <ListComment
          comment={item}
          onReply={(e) => setReply(e)}
        />}
        keyExtractor={item => item._id}
        extraData={comments}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: '17%' }}
      />
      <View style={styles.boxInputText}>
        {/* Hiển thị reply */}
        {
          reply && (
            <View style={styles.replyPreview}>
              <View>
                <Text style={styles.replyTitle}>Đang trả lời: </Text>
                <Text style={styles.replyContent}>
                  {
                    me._id == reply.ID_user._id
                      ? ` Bạn: `
                      : ` ${reply.ID_user.first_name} ${reply.ID_user.last_name}: `
                  }
                  {
                    reply.type === 'text'
                      ? `${reply.content}`
                      : reply.type === 'image'
                        ? 'Ảnh'
                        : 'Video'
                  }
                </Text>
              </View>
              <TouchableOpacity
                style={styles.replyRight}
                onPress={() => setReply(null)}
              >
                <Text style={styles.replyTitle}>✖</Text>
              </TouchableOpacity>
            </View>
          )
        }
        <View style={styles.line}></View>
        <View
          style={{ flexDirection: 'row' }}
        >
          {/* Thư Viện */}
          <View style={styles.librarySelect}>
            <TouchableOpacity
              onPress={onOpenGallery}
            >
              <Icon name="image" size={25} color="#007bff" />
            </TouchableOpacity>

          </View>
          <TextInput
            style={styles.textInput}
            placeholder="Viết bình luận "
            multiline={true}
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            onPress={() => callAddComment('text', comment)}
            style={styles.sendButton}
          >
            <View>
              <Icon name="send" size={25} color='#007bff' />
            </View>
            {/* <Text style={styles.sendText}>Send</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostDetail;
