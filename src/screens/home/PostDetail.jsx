import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import CommentS from '../../styles/components/items/CommentS';
import ListComment from '../../components/items/ListComment';
import FBPhotoGrid from '@renzycode/react-native-fb-photo-grid';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '../../context/BottomSheetContext';
import Icon6 from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { getChiTietPost } from '../../rtk/API';

const PostDetail = (props) => {
  const { openBottomSheet } = useBottomSheet();
  const route = useRoute();
  const { ID_post } = route.params || {}
  const token = useSelector(state => state.app.token);
  const [comment, setComment] = useState([])
  const dispatch = useDispatch()
  const [post, setPost] = useState(null)
  const { navigation } = props
  // const [timeAgo, setTimeAgo] = useState(post.createdAt);
  // const [timeAgoShare, setTimeAgoShare] = useState(post?.ID_post_shared?.createdAt);


  //call api chi tiet bai post
  const callGetChiTietPost = async (ID_post) => {
    try {
      console.log("ID_post:", ID_post);
      const response = await dispatch(getChiTietPost({ ID_post, token })).unwrap();

      if (response && response.post) {
        console.log("API:", response.post);
        setPost(response.post);
      } else {
        console.log('API không trả về bài viết.');
      }
    } catch (error) {
      console.log('Lỗi khi lấy chi tiết bài viết:', error);
    }
  };

  useEffect(() => {
    console.log("ID_post nhận được:", ID_post); // Kiểm tra ID có đúng không
    if (ID_post) {
      callGetChiTietPost(ID_post);
    }
  }, [ID_post]);

  // useEffect(() => {
  //   const updateDiff = () => {
  //     const now = Date.now();
  //     const createdTime = new Date(post.createdAt).getTime(); // Chuyển từ ISO sang timestamp

  //     let createdTimeShare = null;
  //     if (post.ID_post_shared?.createdAt) {
  //       createdTimeShare = new Date(post.ID_post_shared.createdAt).getTime();
  //     }

  //     if (isNaN(createdTime)) {
  //       setTimeAgo("Không xác định");
  //       setTimeAgoShare("Không xác định");
  //       return;
  //     }

  //     // Tính thời gian cho bài viết chính
  //     const diffMs = now - createdTime;
  //     if (diffMs < 0) {
  //       setTimeAgo("Vừa xong");
  //     } else {
  //       const seconds = Math.floor(diffMs / 1000);
  //       const minutes = Math.floor(seconds / 60);
  //       const hours = Math.floor(minutes / 60);
  //       const days = Math.floor(hours / 24);

  //       if (days > 0) {
  //         setTimeAgo(`${days} ngày trước`);
  //       } else if (hours > 0) {
  //         setTimeAgo(`${hours} giờ trước`);
  //       } else if (minutes > 0) {
  //         setTimeAgo(`${minutes} phút trước`);
  //       } else {
  //         setTimeAgo(`${seconds} giây trước`);
  //       }
  //     }

  //     // Nếu bài viết là chia sẻ, tính thời gian cho bài gốc
  //     if (createdTimeShare !== null) {
  //       const diffMsShare = now - createdTimeShare;
  //       if (diffMsShare < 0) {
  //         setTimeAgoShare("Vừa xong");
  //       } else {
  //         const seconds = Math.floor(diffMsShare / 1000);
  //         const minutes = Math.floor(seconds / 60);
  //         const hours = Math.floor(minutes / 60);
  //         const days = Math.floor(hours / 24);

  //         if (days > 0) {
  //           setTimeAgoShare(`${days} ngày trước`);
  //         } else if (hours > 0) {
  //           setTimeAgoShare(`${hours} giờ trước`);
  //         } else if (minutes > 0) {
  //           setTimeAgoShare(`${minutes} phút trước`);
  //         } else {
  //           setTimeAgoShare(`${seconds} giây trước`);
  //         }
  //       }
  //     }
  //   };

  //   updateDiff();
  //   // const interval = setInterval(updateDiff, 1000);

  //   // return () => clearInterval(interval);
  // }, []);

  //media
  const hasMedia = post?.medias?.length > 0 || post?.ID_post_shared?.medias?.length > 0;
  const isVideo = (uri) => uri?.endsWith('.mp4') || uri?.endsWith('.mov');

  const renderMediaGrid = (medias) => {
    const mediaCount = medias.length;

    if (mediaCount === 0) return null;

    return (
      <View style={CommentS.mediaContainer}>
        {medias.slice(0, 5).map((uri, index) => (
          <TouchableOpacity key={index} style={getMediaStyle(mediaCount, index)}>
            {isVideo(uri) ? (
              <View style={CommentS.videoWrapper}>
                <Video source={{ uri }} style={CommentS.video} resizeMode="cover" paused />
                <View style={CommentS.playButton}>
                  <Icon name="play-circle" size={40} color="white" />
                </View>
              </View>
            ) : (
              <Image source={{ uri }} style={CommentS.image} resizeMode="cover" />
            )}

            {index === 4 && mediaCount > 5 && (
              <View style={CommentS.overlay}>
                <Text style={CommentS.overlayText}>+{mediaCount - 5}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getMediaStyle = (count, index) => {
    if (count === 1) {
      return CommentS.singleMedia;
    } else if (count === 2) {
      return CommentS.doubleMedia;
    } else if (count === 3) {
      return index === 0 ? CommentS.tripleMediaFirst : CommentS.tripleMediaSecond;
    } else if (count === 4) {
      return CommentS.quadMedia;
    } else { // 5+ media
      if (index < 2) return CommentS.fivePlusMediaFirstRow;
      else if (index === 2) return CommentS.fivePlusMediaSecondRowLeft;
      else if (index === 3) return CommentS.fivePlusMediaSecondRowMiddle;
      else return CommentS.fivePlusMediaSecondRowRight;
    }
  };

  const header = () => {
    if (!post) {
      return <Text>Đang tải dữ liệu...</Text>;
    }
    return (
      <View>
        <View style={{ marginVertical: 18 }}>
          <View style={CommentS.post}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <View style={{ marginRight: 10 }}>
                  <Icon name="chevron-back-outline" size={25} color="black" />
                </View>
              </TouchableOpacity>
              <Image style={CommentS.avata} source={{ uri: post.ID_user.avatar }} />
              <View style={{ marginLeft: 20 }}>
                <Text style={CommentS.name}>{post.ID_user.first_name} {post.ID_user.last_name}</Text>
                <View style={CommentS.boxName}>
                  {/* <Text style={CommentS.time}>{timeAgo}</Text> */}
                  <Icon name="earth" size={12} color="gray" />
                </View>
              </View>
            </View>
            <View style={CommentS.boxIcons}>
              <View style={{ marginRight: 10 }}>
                <Icon name="ellipsis-horizontal" size={25} color="black" />
              </View>
            </View>
          </View>
          <View style={post.caption == "" ? CommentS.title1 : CommentS.title}>
            <Text style={{ color: 'black' }}>{post.caption}</Text>
          </View>
        </View>
        {/* renderAnh */}

        {hasMedia && renderMediaGrid(post.medias)}

        <View style={[CommentS.boxInteract, { marginVertical: 30 }]}>
          <View style={CommentS.boxIcons2}>
            <View style={CommentS.boxIcons3}>
              <Icon2 name="like" size={25} color="black" />
            </View>
            <Text style={{ color: 'gray' }}>Thích</Text>
          </View>
          <View style={CommentS.boxIcons2}>
            <TouchableOpacity
              style={{ flexDirection: 'row' }}>
              <View style={CommentS.boxIcons3}>
                <Icon3 name="comment" size={20} color="black" />
              </View>
              <Text style={{ color: 'gray' }}>Bình luận</Text>
            </TouchableOpacity>
          </View>
          <View style={[CommentS.boxIcons2]}>
            <View style={CommentS.boxIcons3}>
              <Icon4 name="share-alt" size={20} color="black" />
            </View>
            <Text style={{ color: 'gray' }}>Chia sẻ</Text>
          </View>
        </View>
        <View style={[CommentS.line, { marginBottom: 20 }]}></View>
        <View
          style={[
            CommentS.boxHeader,
            {
              justifyContent: 'space-between',
              marginBottom: 20,
              marginHorizontal: 20,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              console.log(detail_reactions);
              openBottomSheet(50, detail_reactions);
            }}>
            <View style={CommentS.boxHeader}>
              <Icon5 name="like1" size={25} color="blue" />
              <Text style={{ marginHorizontal: 10, color: 'gray' }}>161 </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <FlatList
        data={comment}
        renderItem={({ item }) => <ListComment comment={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: '17%' }}
      />
      <View style={CommentS.boxInputText}>
        <View style={CommentS.line}></View>
        <TextInput
          style={CommentS.textInput}
          placeholder="Viết bình luận "
          multiline={true}
        />
      </View>
    </View>
  );
};

export default PostDetail;
