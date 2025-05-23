import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { set } from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/Ionicons'
import { oStackHome } from '../../navigations/HomeNavigation';
const ItemNotification = ({data,stories}) => {
  console.log('data', stories);
  const me = useSelector(state => state.app.user);
  const navigation = useNavigation();

  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [icon, setIcon] = useState(null);
  const [background, setbackground] = useState(null);
  
  // time
  const [timeAgo, setTimeAgo] = useState(data.updatedAt);

  useEffect(() => {
    const updateDiff = () => {
      const now = Date.now();
      const createdTime = new Date(data.updatedAt).getTime(); // Chuyển từ ISO sang timestamp

      if (isNaN(createdTime)) {
        setTimeAgo('Không xác định');
        return;
      }

      // Tính thời gian cho bài viết chính
      const diffMs = now - createdTime;
      if (diffMs < 0) {
        setTimeAgo('Vừa xong');
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
    };

    updateDiff();
    // const interval = setInterval(updateDiff, 1000);

    // return () => clearInterval(interval);
  }, []);
  // console.log('data', data);
  useEffect(() => {
    if (data.type == 'Lời mời kết bạn') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
          ' ' +
          data.ID_relationship.ID_userB.last_name,
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
        setIcon('person-add')
        setbackground('#007bff')
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
          ' ' +
          data.ID_relationship.ID_userA.last_name,
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
        setIcon('person-add')
        setbackground('#007bff')
      }
    }
    if (data.type == 'Đã đăng story mới') {
      if (data.ID_post.ID_user._id) {
        setName(
          data.ID_post.ID_user.first_name +
          ' ' +
          data.ID_post.ID_user.last_name,
        );
        setAvatar(data.ID_post.ID_user.avatar);
        setIcon('book')
        setbackground('#DA7F00')

      } else {
        setName(
          data.ID_post.ID_user.first_name +
          ' ' +
          data.ID_post.ID_user.last_name,
        );
        setAvatar(data.ID_post.ID_user.last_name);
        setIcon('book')
        setbackground('#DA7F00')

      }
    }
    if (data.type == "Đã thành bạn bè của bạn") {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
          ' ' +
          data.ID_relationship.ID_userB.last_name,
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
        setIcon('people')
        setbackground('#007bff')
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
          ' ' +
          data.ID_relationship.ID_userA.last_name,
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
        setIcon('people')
        setbackground('#007bff')
      }
    }
    if (data.type == 'Đã đăng bài mới') {
      setName(data.ID_post.ID_user.first_name +
        ' ' + data.ID_post.ID_user.last_name
      )
      setAvatar(data.ID_post.ID_user.avatar);
      setIcon('reader')
      setbackground('#E1E111')


    }
    if (data.type == 'Bạn có 1 cuộc gọi video đến') {
      if (data.ID_group.isPrivate) {
        const otherUser = data.ID_group.members?.find((user) => user._id !== me._id);
        setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người gọi');
        setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
        setIcon('videocam-outline')
        setbackground('#FF5733')

      } else {
        setName(
          data.ID_group.name ||
          data.ID_group.members
            ?.filter((user) => user._id !== me._id)
            .map((user) => `${user.first_name} ${user.last_name}`)
            .join(', ')
        );
        setAvatar(data.ID_group.avatar || 'https://example.com/default-group-avatar.png');
        setIcon('call')
        setbackground('#FF5733')

      }
    }
    if (data.type == 'Bạn có 1 cuộc gọi đến') {
      if (data.ID_group.isPrivate) {
        const otherUser = data.ID_group.members?.find((user) => user._id !== me._id);
        setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người gọi');
        setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
        setIcon('call')
        setbackground('#FF5733')
      } else {
        setName(
          data.ID_group.name ||
          data.ID_group.members
            ?.filter((user) => user._id !== me._id)
            .map((user) => `${user.first_name} ${user.last_name}`)
            .join(', ')
        );
        setAvatar(data.ID_group.avatar || 'https://example.com/default-group-avatar.png');
        setIcon('call')
        setbackground('#FF5733')

      }
    }

    if (data.type == 'Bạn đã được mời vào nhóm mới') {
      if (data.ID_group.isPrivate) {
        const otherUser = data.ID_group.members?.find((user) => user._id !== me._id);
        setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người gọi');
        setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
        setIcon('people-circle')
      } else {
        setName(
          data.ID_group.name ||
          data.ID_group.members
            ?.filter((user) => user._id !== me._id)
            .map((user) => `${user.first_name} ${user.last_name}`)
            .join(', ')
        );
        setAvatar(data.ID_group.avatar || 'https://example.com/default-group-avatar.png');
        setIcon('people-circle')
        setbackground('green')
      }
    }
    if (data.type == 'Tin nhắn mới') {
      setName(data.ID_message.sender.first_name + ' '
        + data.ID_message.sender.last_name)
      setAvatar(data.ID_message.sender.avatar)
      setIcon('chatbox-ellipses')
      setbackground('green')
    }
    if (data.type == 'Đang livestream') {
      if (data.ID_relationship.ID_userA._id == me._id) {
        setName(
          data.ID_relationship.ID_userB.first_name +
          ' ' +
          data.ID_relationship.ID_userB.last_name,
        );
        setAvatar(data.ID_relationship.ID_userB.avatar);
        setIcon('logo-rss')
        setbackground('red')
      } else {
        setName(
          data.ID_relationship.ID_userA.first_name +
          ' ' +
          data.ID_relationship.ID_userA.last_name,
        );
        setAvatar(data.ID_relationship.ID_userA.avatar);
        setIcon('logo-rss')
        setbackground('red')
      }
    }
    if(data.type=='Đã thả biểu cảm vào bài viết của bạn'){
      setName(data.ID_post_reaction?.ID_user?.first_name + ' ' + data.ID_post_reaction?.ID_user?.last_name)
      setAvatar(data.ID_post_reaction?.ID_user?.avatar);
      setIcon('happy')
      setbackground('green')
    }
    if (data.type == 'Đã bình luận vào bài viết của bạn') {
      setName(data.ID_comment.ID_user.first_name + ' ' + data.ID_comment.ID_user.last_name)
      setAvatar(data.ID_comment.ID_user.avatar)
      setIcon('chatbubble-ellipses')
      setbackground('green')
    }
    if (data.type == 'Đã trả lời bình luận của bạn') {
      setName(data.ID_comment.ID_user.first_name + ' ' + data.ID_comment.ID_user.last_name)
      setAvatar(data.ID_comment.ID_user.avatar)
      setIcon('chatbubble-ellipses')
      setbackground('green')
    }
    if (data.type == 'Mời chơi game 3 lá') {
      const otherUser = data.ID_group.members?.find((user) => user._id !== me._id);
      setName(otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : 'Người gọi');
      setAvatar(otherUser?.avatar || 'https://example.com/default-avatar.png');
      setIcon('game-controller-outline')
      setbackground('#007bff')
    }
    if (data.type == 'Đã thả biểu cảm vào story của bạn') {
      setName('Người nào đó')
      setAvatar(data.ID_post.ID_user?.avatar);
      setIcon('happy')
      setbackground('green')
    }
    if (data.type == 'Tài khoản bị khóa') {
      setName('Người Dùng')
      setAvatar('https://i.pinimg.com/736x/99/01/a7/9901a78c402edd1f13fc2dd098550214.jpg');
      setIcon('shield')
      setbackground('#007bff')
    }

  }, [data,navigation]);

  // Xác định màn hình cần chuyển đến dựa vào loại thông báo
  const navigateToScreen = () => {
    if (data.type === 'Lời mời kết bạn') {
      navigation.navigate('Friend', {userId: me._id});
    } 
    else if (data.type === 'Đã đăng story mới') {
      const userStories = stories.find(
        (story) => story.user._id === data.ID_post.ID_user._id
      );
     navigation.navigate("StoryViewer", {
      
      StoryView: userStories,
      currentUserId: me._id,
             })
    }
    else if (data.type === 'Đã thành bạn bè của bạn') {
      navigation.navigate('Profile', { _id: data.ID_relationship.ID_userA._id == me._id ? data.ID_relationship.ID_userB._id : data.ID_relationship.ID_userA._id });
    }
    else if (data.type === 'Đã đăng bài mới') {
      navigation.navigate("PostDetail", { ID_post: data.ID_post._id, typeClick: "comment" });
    }
    else if (data.type === 'Bạn đã được mời vào nhóm mới') {
      navigation.navigate("Chat", { ID_group: data.ID_group._id })
    }
    else if (data.type === 'Tin nhắn mới') {
      navigation.navigate("Chat", { ID_group: data.ID_message.ID_group._id })
    }
    else if (data.type === 'Đang livestream') {
      // navigation.navigate('AudienceScreen', {
      //   userID: me._id,
      //   userName: me.first_name + me.last_name,
      //   liveID: data.content,
      // })
    }
    else if (data.type === 'Đã thả biểu cảm vào bài viết của bạn') {
      navigation.navigate("PostDetail", { ID_post: data.ID_post_reaction.ID_post._id, typeClick: "reaction" });
    }
    else if (data.type === 'Đã thả biểu cảm vào bài viết của bạn') {
      navigation.navigate("PostDetail", { ID_post: data.ID_post_reaction.ID_post._id, typeClick: "reaction" });
    }
    else if (data.type === 'Đã bình luận vào bài viết của bạn') {
      navigation.navigate("PostDetail", { ID_post: data.ID_comment.ID_post._id, typeClick: "comment" });
    }
    else if (data.type === 'Mời chơi game 3 lá') {
      navigation.navigate("Chat", { ID_group: data.ID_group._id })
    }
    else if (data.type === 'Đã thả biểu cảm vào story của bạn') {
      const userStories = stories.find(
        (story) => story.user._id === data.ID_post.ID_user._id
      );
      navigation.navigate("StoryViewer", {         
        StoryView: userStories,
        currentUserId: me._id,
      })
    }
  };

  return (
    <TouchableOpacity onPress={navigateToScreen}>
      <View style={styles.container}>
        {avatar &&
          <View>
            <Image source={{ uri: avatar }} style={[styles.img,]} />
            <View style={[{ backgroundColor: background }, styles.icon,]}><Icon name={icon} size={16} color='white' /></View>
          </View>
        }
        <View style={styles.container_content}>
          <View style={styles.container_name}>
            <Text style={styles.text_name}>{name}</Text>
            <Text style={styles.text_content}>
              {
                data.type == 'Đang livestream' ? 'Đang livestream' : (data.content ?? data.type ?? 'Bạn có thông báo mới')
              }
            </Text>
          </View>
          <Text style={styles.text_time}>{timeAgo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 13,
  },
  img: {
    width: 68,
    height: 68,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  container_name: {
    flexDirection: 'column',
  },
  text_content: {
    marginLeft: 2,
    fontSize: 16,
    fontWeight: '400', // "medium" không hợp lệ, dùng "400" tương đương
    color: 'black',
  },
  text_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container_content: {
    marginLeft: 13,
  },
  text_time: {
    fontSize: 14,
    color: 'gray',
    marginTop: 3,
  },
  icon: {
    position: 'absolute',
    top: 40,
    left: 40,
    //backgroundColor: '#007bff',
    borderRadius: 50,
    padding: 5
  }
});
