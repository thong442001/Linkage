import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { deletePost, getPostsUserIdDestroyTrue } from '../../rtk/API';
import HomeS from '../../styles/screens/home/HomeS';
import StorageDeletePost from '../../components/items/StorageDeletePost';
import { oStackHome } from '../../navigations/HomeNavigation';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons


const Trash = props => {
  const { route, navigation } = props;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [posts, setPosts] = useState([]);


  const callGetPostsUserIdDestroyTrue = async ID_user => {
    try {
      await dispatch(getPostsUserIdDestroyTrue({ me: ID_user, token: token }))
        .unwrap()
        .then(response => {
          // console.log('Post thùng rác: ', response.posts);
          setPosts(response.posts);
        })
        .catch(error => {
          console.log('Error callGetPostsUserIdDestroyTrue:: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  }; 
  
  useEffect(() => {
    callGetPostsUserIdDestroyTrue(me._id);
  
    const focusListener = navigation.addListener('focus', () => {
      callGetPostsUserIdDestroyTrue(me._id);
    });
  
    return () => {
      focusListener();
    };
  }, [callGetPostsUserIdDestroyTrue, navigation, me._id]); 


  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      {/* Tiêu đề */}
      <Text style={styles.title}>Bài viết đã xóa</Text>

      {/* Danh sách bài viết */}
      <View>
        {posts && posts.length > 0 ? (
          <FlatList
            data={posts}
            renderItem={({ item }) => <StorageDeletePost post={item} />}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <Text style={styles.emptyText}>Chưa có bài nào</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    backgroundColor: 'transparent', // Xóa nền để phù hợp với màu đen
    padding: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
});
export default Trash;