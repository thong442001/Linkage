import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Animated, FlatList, View, RefreshControl, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HomeS from '../../styles/screens/home/HomeS';
import HomeLoading from '../../utils/skeleton_loading/HomeLoading';
import NothingHome from '../../utils/animation/homeanimation/NothingHome';
import ProfilePage from '../../components/items/ProfilePage';
import { getAllPostsInHome, changeDestroyPost } from '../../rtk/API';
import database from '@react-native-firebase/database';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'; 
import HomeHeader from './HomeHeader';
import HomeStories from './HomeStories';

const { height } = Dimensions.get('window');

const Home = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setloading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [stories, setStories] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const tabBarHeight = useBottomTabBarHeight(); // Lấy chiều cao tab bar
  const [isTabBarVisible, setIsTabBarVisible] = useState(true); // Trạng thái tab bar

  const HEADER_HEIGHT = height * 0.1;

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
  }, [refreshing]);

  // Lắng nghe sự kiện cuộn
  useEffect(() => {
    let lastScroll = 0; // Biến lưu giá trị cuộn trước đó
    const listenerId = scrollY.addListener(({ value }) => {
      if (value > lastScroll && value > 50) {
        setIsTabBarVisible(false); // Cuộn xuống, ẩn tab bar
      } else if (value < lastScroll && value < 50) {
        setIsTabBarVisible(true); // Cuộn lên, hiện tab bar
      }
      lastScroll = value;
    });
    
    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY]);

  // Lấy dữ liệu live sessions
  useEffect(() => {
    const liveSessionsRef = database().ref('/liveSessions');
    const onValueChange = liveSessionsRef.on('value', snapshot => {
      const liveSessions = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLiveSessions(liveSessions);
    });
    return () => liveSessionsRef.off('value', onValueChange);
  }, []);

  const callGetAllPostsInHome = async ID_user => {
    try {
      if (!refreshing) {
        setloading(true);
      }
      await dispatch(getAllPostsInHome({ me: ID_user, token }))
        .unwrap()
        .then(response => {
          setPosts(response.posts);
          setStories(response.stories);
          setloading(false);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:: ', error);
          setloading(false);
        });
    } catch (error) {
      console.log(error);
      setloading(false);
    }
  };

  useEffect(() => {
    callGetAllPostsInHome(me._id);
  }, [me._id]);

  // Làm mới khi kéo xuống
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
    [posts, currentTime, me._id]
  );

  return (
    <View style={HomeS.container}>
      {loading && !refreshing ? (
        <HomeLoading />
      ) : (
        <>
          <HomeHeader navigation={navigation} me={me} headerTranslate={headerTranslate} />
          <Animated.FlatList
            data={posts}
            renderItem={renderPosts}
            keyExtractor={item => item._id}
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
              { useNativeDriver: true }
            )}
            scrollEventThrottle={16}
          />
          {/* Điều chỉnh hiển thị tab bar */}
          <Animated.View
            style={{
              transform: [
                { translateY: isTabBarVisible ? 0 : tabBarHeight }
              ],
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}
          >
            {/* Nội dung tab bar */}
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default Home;
