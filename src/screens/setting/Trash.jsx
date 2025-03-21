import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import {
  getPostsUserIdDestroyTrue,
  changeDestroyPost,
  deletePost,
} from '../../rtk/API';
import ProfilePage from '../../components/items/ProfilePage';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Import Lottie

const Trash = props => {
  const { route, navigation } = props;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [posts, setPosts] = useState([]);

  useFocusEffect(
    useCallback(() => {
      callGetPostsUserIdDestroyTrue(me._id); // Gọi API load dữ liệu
    }, [])
  );

  const callGetPostsUserIdDestroyTrue = async (ID_user) => {
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
      await dispatch(deletePost({ _id: ID_post }))
        .unwrap()
        .then(response => {
          console.log('Xóa vĩnh viễn thành công:', response);
          setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
        })
        .catch(error => {
          console.log('Lỗi khi xóa vĩnh viễn bài viết:', error);
        });
    } catch (error) {
      console.log('Lỗi trong callDeletePost:', error);
    }
  };

  const callChangeDestroyPost = async (ID_post) => {
    try {
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thùng rác</Text>
      </View>
      <View style={styles.post}>
        {posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) =>
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
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('../../utils/animation/bin/bin.json')}
              autoPlay
              loop
              style={styles.lottieAnimation}
            />
            <Text style={styles.emptyText}>Chưa có bài nào</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#e6eaec',
    borderRadius: 10, // Bo góc cho header
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginBottom: 20, // Khoảng cách giữa header và nội dung
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black', // Màu trắng cho chữ trong header
  },
  post: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lottieAnimation: {
    width: 200, // Điều chỉnh kích thước animation
    height: 200,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
  },
});

export default Trash;
