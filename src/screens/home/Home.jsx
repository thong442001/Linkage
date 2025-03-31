import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Animated, FlatList, View, RefreshControl, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HomeS from '../../styles/screens/home/HomeS';
import HomeLoading from '../../utils/skeleton_loading/HomeLoading';
import NothingHome from '../../utils/animation/homeanimation/NothingHome';
import ProfilePage from '../../components/items/ProfilePage';
import { useRoute } from '@react-navigation/native';
import {
  getAllPostsInHome,
  changeDestroyPost,
  getAllReason
} from '../../rtk/API';
import database from '@react-native-firebase/database';
import HomeHeader from './HomeHeader';
import HomeStories from './HomeStories';
const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.1;

const Home = props => {
  const { navigation } = props;
  const route = useRoute(); // Thêm useRoute để nhận params
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setloading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [stories, setStories] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());


  const previousScrollY = useRef(0);


  // Animated value
  const scrollY = useRef(new Animated.Value(0)).current;
  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerTranslate = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 60000); // Cập nhật mỗi phút

    return () => clearInterval(timer);
  }, [refreshing]); // Thêm refreshing vào dependencies
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => { });
    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);

  useEffect(() => {
    let previousScrollY = 0;

    const listenerId = scrollY.addListener(({ value }) => {
      if (value - previousScrollY > 0) {
        // Cuộn xuống => Ẩn Bottom Tab
        props.route.params.handleScroll(false);
      } else if (value - previousScrollY < 0) {
        // Cuộn lên => Hiện Bottom Tab
        props.route.params.handleScroll(true);
      }
      previousScrollY = value; // Cập nhật vị trí cuộn trước đó
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);



  useEffect(() => {
    const liveSessionsRef = database().ref('/liveSessions');
    const onValueChange = liveSessionsRef.on('value', snapshot => {
      const liveSessions = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLiveSessions(liveSessions);
    });
    return () => liveSessionsRef.off('value', onValueChange);
  }, []);


  // Gọi lại API khi nhận được isDeleted: true từ StoryViewer
  useEffect(() => {
    if (route.params?.isDeleted && me?._id) {
      console.log('Story deleted, refreshing data...');
      setTimeout(() => {
        callGetAllPostsInHome(me._id);
      }, 1000); // Chờ 1 giây
      navigation.setParams({ isDeleted: undefined });
    }
  }, [route.params?.isDeleted, me?._id]);

  const callGetAllPostsInHome = async ID_user => {
    try {
      if (!refreshing) setloading(true);
      await dispatch(getAllPostsInHome({ me: ID_user, token, timestamp: Date.now() }))
        .unwrap()
        .then(response => {
          console.log('Stories sau khi xóa:', response.stories);
          setPosts(response.posts || []);
          setStories(response.stories || []);
          setLiveSessions([]);
          setloading(false);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:: ', error);
          setPosts([]);
          setStories([]);
          setLiveSessions([]);
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  //cập nhật danh sách bài viết khi có bài viết mới
  useEffect(() => {
    if (route.params?.newPost) {
      setPosts(prevPosts => [route.params.newPost, ...prevPosts]);
      navigation.setParams({ newPost: undefined }); // Reset param
    }
  }, [route.params?.newPost]);

  useEffect(() => {
    callGetAllPostsInHome(me._id);
  }, [me._id]);

  // Hàm xử lý làm mới khi kéo xuống
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentTime(Date.now());
    callGetAllPostsInHome(me._id).finally(() => {
      setRefreshing(false);
    });
  }, [me._id]);

  const callChangeDestroyPost = async ID_post => {
    try {
      await dispatch(changeDestroyPost({ _id: ID_post }))
        .unwrap()
        .then(response => {
          setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
        })
        .catch(error => {
          console.log('Lỗi khi xóa bài viết:', error);
        });
    } catch (error) {
      console.log('Lỗi trong callChangeDestroyPost:', error);
    }
  };

  useEffect(() => {
    if (route.params?.isRestored && route.params?.restoredPost && me?._id) {
      console.log('Post restored, updating list...');
      setPosts(prevPosts => [route.params.restoredPost, ...prevPosts]); // Thêm bài viết vào đầu danh sách
      navigation.setParams({ isRestored: undefined, restoredPost: undefined }); // Reset tham số
    }
  }, [route.params?.isRestored, route.params?.restoredPost, me?._id]);

  

  const updatePostReaction = (ID_post, newReaction, ID_post_reaction) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id !== ID_post) return post;
        const existingReactionIndex = post.post_reactions.findIndex(
          reaction => reaction.ID_user._id === me._id
        );
        let updatedReactions = [...post.post_reactions];
        if (existingReactionIndex !== -1) {
          updatedReactions[existingReactionIndex] = {
            ...updatedReactions[existingReactionIndex],
            ID_reaction: newReaction,
          };
        } else {
          updatedReactions.push({
            _id: ID_post_reaction,
            ID_user: {
              _id: me._id,
              first_name: me.first_name,
              last_name: me.last_name,
              avatar: me.avatar,
            },
            ID_reaction: newReaction,
          });
        }
        return { ...post, post_reactions: updatedReactions };
      })
    );
  };

  const deletPostReaction = (ID_post, ID_post_reaction) => {
    setPosts(prevPosts =>
      prevPosts.map(post => {
        if (post._id !== ID_post) return post;
        const updatedReactions = post.post_reactions.filter(
          reaction => reaction._id !== ID_post_reaction
        );
        return { ...post, post_reactions: updatedReactions };
      })
    );
  };



  const renderPosts = useCallback(
    ({ item }) => (
      <ProfilePage
        post={item}
        ID_user={me._id}
        currentTime={currentTime}
        onDelete={() => callChangeDestroyPost(item._id)}
        updatePostReaction={updatePostReaction}
        deletPostReaction={deletPostReaction}
      />
    ),
    [me._id, currentTime] // Chỉ phụ thuộc vào me._id và currentTime
  );

  return (
    <>
      {loading && !refreshing ? (
        <HomeLoading />
      ) : (
        <View style={HomeS.container}>
          <HomeHeader navigation={navigation} me={me} headerTranslate={headerTranslate} />
          <Animated.FlatList
            data={posts}
            renderItem={renderPosts}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <HomeStories navigation={navigation} me={me} stories={stories} liveSessions={liveSessions} />
            }
            showsVerticalScrollIndicator={false}
            extraData={currentTime}
            contentContainerStyle={{ paddingTop: 42 }}
            ListEmptyComponent={<NothingHome />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                progressViewOffset={HEADER_HEIGHT}
              />
            }
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              {
                useNativeDriver: true,
                listener: (event) => {
                  const currentScrollY = event.nativeEvent.contentOffset.y;
                  if (currentScrollY < 50) {
                    props.route.params.handleScroll(true);
                  } else {
                    if (currentScrollY - previousScrollY.current > 0) {
                      props.route.params.handleScroll(false);
                    } else if (currentScrollY - previousScrollY.current < 0) {
                      props.route.params.handleScroll(true);
                    }
                  }
                  previousScrollY.current = currentScrollY;
                },
              }
            )}
            scrollEventThrottle={16}
          />
        </View>
      )}
    </>
  );
};

export default Home;