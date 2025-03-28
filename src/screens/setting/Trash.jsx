import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
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

// Lấy chiều rộng và chiều cao của màn hình
const { width, height } = Dimensions.get('window');

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

  // Component phân tách giữa các item
  const ItemSeparator = () => {
    return <View style={styles.separator} />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={width * 0.06} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thùng rác</Text>
      </View>
      <View style={styles.post}>
        {posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <ProfilePage
                post={item}
                ID_user={me._id}
                onDelete={() => callChangeDestroyPost(item._id)}
                onDeleteVinhVien={() => callDeletePost(item._id)}
              />
            )}
            keyExtractor={item => item._id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent} // Điều chỉnh padding tổng thể
            ItemSeparatorComponent={ItemSeparator} // Thêm phân tách giữa các item
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
    paddingHorizontal: width * 0.03, // 3% chiều rộng màn hình
    paddingTop: height * 0.015, // 1.5% chiều cao màn hình
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.02, // 2% chiều cao màn hình
    paddingHorizontal: width * 0.04, // 4% chiều rộng màn hình
    backgroundColor: '#e6eaec',
    borderRadius: width * 0.03, // Bo góc dựa trên chiều rộng
    shadowOpacity: 0.2,
    shadowRadius: width * 0.015, // Bán kính bóng đổ dựa trên chiều rộng
    marginBottom: height * 0.03, // 3% chiều cao màn hình
  },
  backButton: {
    marginRight: width * 0.03, // 3% chiều rộng màn hình
  },
  headerTitle: {
    fontSize: width * 0.055, // Font size 5.5% chiều rộng màn hình
    fontWeight: 'bold',
    color: 'black',
  },
  post: {
    flex: 1,
  },
  flatListContent: {
    paddingBottom: height * 0.03, // 3% chiều cao màn hình
    paddingTop: height * 0.01, // 1% chiều cao màn hình
  },
  separator: {
    height: height * 0.02, // 2% chiều cao màn hình
    backgroundColor: 'transparent', // Màu trong suốt để tạo khoảng cách
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: width * 0.05, // 5% chiều rộng màn hình
  },
  lottieAnimation: {
    width: width * 0.5, // 50% chiều rộng màn hình
    height: width * 0.5, // Tỷ lệ 1:1 với chiều rộng
  },
  emptyText: {
    textAlign: 'center',
    fontSize: width * 0.045, // Font size 4.5% chiều rộng màn hình
    color: 'gray',
  },
});

export default Trash;