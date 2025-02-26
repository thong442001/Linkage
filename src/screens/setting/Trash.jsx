import { Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import {
  getPostsUserIdDestroyTrue,
  changeDestroyPost,
  deletePost,
} from '../../rtk/API';
import HomeS from '../../styles/screens/home/HomeS';
import ProfilePage from '../../components/items/ProfilePage';
import { oStackHome } from '../../navigations/HomeNavigation';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';


const Trash = props => {
  const { route, navigation } = props;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    //console.log('1');
    // Call API khi lần đầu vào trang
    callGetPostsUserIdDestroyTrue(me._id);

    // Thêm listener để gọi lại API khi quay lại trang
    const focusListener = navigation.addListener('focus', () => {
      callGetPostsUserIdDestroyTrue(me._id);
      //console.log('2');
    });

    // Cleanup listener khi component bị unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  //call api callGetPostsUserIdDestroyTrue
  const callGetPostsUserIdDestroyTrue = async ID_user => {
    try {
      await dispatch(getPostsUserIdDestroyTrue({ me: ID_user, token: token }))
        .unwrap()
        .then(response => {
          console.log('Post thùng rác: ' + response.posts);
          setPosts(response.posts);
        })
        .catch(error => {
          console.log('Error callGetPostsUserIdDestroyTrue:: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const callDeletePost = async (ID_post) => {
    try {
      //console.log('Xóa bài viết với ID:', ID_post);

      await dispatch(deletePost({ _id: ID_post }))
        .unwrap()
        .then(response => {
          console.log('Xóa vĩnh viễn thành công:', response);
          setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
        })
        .catch(error => {
          console.log('Lỗi khi xóa ĩnh viễn bài viết:', error);
        });
    } catch (error) {
      console.log('Lỗi trong callDeletePost:', error);
    }
  };

  const callChangeDestroyPost = async (ID_post) => {
    try {
      console.log('Xóa bài viết với ID:', ID_post);

      await dispatch(changeDestroyPost({ _id: ID_post }))
        .unwrap()
        .then(response => {
          console.log('Xóa thành công:', response);
          setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
        })
        .catch(error => {
          console.log('Lỗi khi xóa bài viết:', error);
        });
    } catch (error) {
      console.log('Lỗi trong callChangeDestroyPost:', error);
    }
  };

  return (
    <View style={HomeS.container}>
      {/* post */}
      <View>
        <View style={HomeS.post}>
          {posts && posts.length > 0 ? (
            <FlatList
              data={posts}
              renderItem={({ item }) =>
                //console.log('📌 Post data thùng rác   :', item);
                <ProfilePage
                  post={item}
                  ID_user={me._id}
                  onDelete={() => callChangeDestroyPost(item._id)}
                  onDeleteVinhVien={() => callDeletePost(item._id)}
                />
              }
              keyExtractor={item => item._id}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 3 }}
            />
          ) : (
            <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' }}>
              Chưa có bài nào
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Trash;