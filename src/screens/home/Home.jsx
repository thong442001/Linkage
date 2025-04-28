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
  getAllReason,
  getUser,
  getAllFriendOfID_user
} from '../../rtk/API';
import database from '@react-native-firebase/database';
import HomeHeader from './HomeHeader';
import HomeStories from './HomeStories';

const { height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.1;

const Home = props => {
  const { navigation } = props;
  const route = useRoute();
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [stories, setStories] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  const previousScrollY = useRef(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerTranslate = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
  });
  // user api
  const [api_user, setApi_user] = useState(null);

  const callgetUser = async (ID_user) => {
    try {
      await dispatch(getUser({ ID_user: ID_user, token }))
        .unwrap()
        .then((response) => {
          setApi_user(response.user);
          //console.log('API User:', response.user);
        })
        .catch((error) => {
          console.log('Error callgetUser:: ', error);

        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const liveSessionsRef = database().ref('/liveSessions');
    const onValueChange = liveSessionsRef.on('value', snapshot => {
      const liveSessions = snapshot.val() ? Object.values(snapshot.val()) : [];
      console.log('Live sessions from Firebase:', liveSessions); // Debug
      // Lọc liveSessions chỉ giữ lại các phiên của bạn bè
      // const filteredSessions = liveSessions.filter((item) =>
      //   friends.some((friend) => {
      //     if (friend.relation !== 'Bạn bè') return false;
      //     const friendId =
      //       friend.ID_userA._id.toString() === me?._id.toString()
      //         ? friend.ID_userB._id.toString()
      //         : friend.ID_userB._id.toString() === me?._id.toString()
      //           ? friend.ID_userA._id.toString()
      //           : null;
      //     return friendId && friendId === item.userID?.toString();
      //   })
      // );
      setLiveSessions(liveSessions);
    });
    return () => liveSessionsRef.off('value', onValueChange);
  }, []);

  useEffect(() => {
    if (route.params?.isDeleted && me?._id) {
      console.log('Story deleted, refreshing data...');
      setTimeout(() => {
        callGetAllPostsInHome(me._id, true);
        callgetUser(me._id);
      }, 1000);
      navigation.setParams({ isDeleted: undefined });
    }
  }, [route.params?.isDeleted, me?._id]);

  //call api getAllFriendOfID_user
  const callGetAllFriendOfID_user = async () => {
    try {

      await dispatch(getAllFriendOfID_user({ me: me._id, token: token }))
        .unwrap()
        .then((response) => {
          //console.log(response.relationships)
          setFriends(response.relationships);
        })
        .catch((error) => {
          console.log('Error1 getAllFriendOfID_user:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  const callGetAllPostsInHome = async (ID_user, showLoading = true) => {
    try {
      if (!refreshing && showLoading) setLoading(true);
      await dispatch(getAllPostsInHome({ me: ID_user, token, timestamp: Date.now() }))
        .unwrap()
        .then(response => {
          //console.log('API response - Posts:', response.posts.length, 'Stories:', response.stories.length);
          setPosts(response.posts || []);
          setStories(response.stories || []);
          // Không đặt lại liveSessions để giữ dữ liệu từ Firebase
          if (showLoading) setLoading(false);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:', error);
          setPosts([]);
          setStories([]);
          if (showLoading) setLoading(false);
        });
    } catch (error) {
      console.log('Error in callGetAllPostsInHome:', error);
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    callGetAllPostsInHome(me._id);
    callgetUser(me._id);
    callGetAllFriendOfID_user()
  }, [me._id]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setCurrentTime(Date.now());
    console.log('Refreshing, keeping liveSessions:', liveSessions); // Debug
    Promise.all([
      callGetAllPostsInHome(me._id, false),
      callgetUser(me._id),
      callGetAllFriendOfID_user()
    ]).finally(() => {
      setRefreshing(false);
    });
  }, [me._id, liveSessions]);

  const callChangeDestroyPost = async ID_post => {
    try {
      await dispatch(changeDestroyPost({ _id: ID_post }))
        .unwrap()
        .then(() => {
          setPosts(prevPosts => prevPosts.filter(post => post._id !== ID_post));
        })
        .catch(error => {
          console.log('Error deleting post:', error);
        });
    } catch (error) {
      console.log('Error in callChangeDestroyPost:', error);
    }
  };

  useEffect(() => {
    if (route.params?.refresh && me?._id) {
      console.log('Refreshing posts after new post...');
      callGetAllPostsInHome(me._id, false);
      navigation.setParams({ refresh: undefined });
    }
  }, [route.params?.refresh, me?._id]);

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
    [me._id, currentTime]
  );

  return (
    <>
      {loading && !refreshing ? (
        <HomeLoading />
      ) : (
        <View style={posts.length === 0 ? HomeS.container1 : HomeS.container}>
          <HomeHeader navigation={navigation} headerTranslate={headerTranslate} />
          <Animated.FlatList
            data={posts}
            renderItem={renderPosts}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <HomeStories
                navigation={navigation}
                me={api_user}
                stories={stories}
                liveSessions={liveSessions}
              />
            }
            showsVerticalScrollIndicator={false}
            extraData={currentTime}
            contentContainerStyle={{ paddingTop: 45 }}
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
                    props.route.params?.handleScroll?.(true);
                  } else {
                    if (currentScrollY - previousScrollY.current > 0) {
                      props.route.params?.handleScroll?.(false);
                    } else if (currentScrollY - previousScrollY.current < 0) {
                      props.route.params?.handleScroll?.(true);
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