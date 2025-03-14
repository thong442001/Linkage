import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Animated, FlatList, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import HomeS from '../../styles/screens/home/HomeS';
import HomeLoading from '../../utils/skeleton_loading/HomeLoading';
import NothingHome from '../../utils/animation/homeanimation/NothingHome';
import ProfilePage from '../../components/items/ProfilePage';
import { getAllPostsInHome, changeDestroyPost } from '../../rtk/API';
import database from '@react-native-firebase/database';
import { oStackHome } from '../../navigations/HomeNavigation';
import HomeHeader from './HomeHeader';
import HomeStories from './HomeStories';

const Home = props => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setloading] = useState(true);
  const [posts, setPosts] = useState(null);
  const [stories, setStories] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const HEADER_HEIGHT = 100;

  // Animated value
  const scrollY = useRef(new Animated.Value(0)).current; // Khai báo scrollY trước
  const clampedScrollY = Animated.diffClamp(scrollY, 0, HEADER_HEIGHT);
  const headerTranslate = clampedScrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -HEADER_HEIGHT],
    extrapolate: 'clamp',
    
  });
  


  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      console.log("scrollY value: ", value);
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

  const callGetAllPostsInHome = async ID_user => {
    try {
      setloading(true);
      await dispatch(getAllPostsInHome({ me: ID_user, token: token }))
        .unwrap()
        .then(response => {
          setPosts(response.posts);
          setStories(response.stories);
          setloading(false);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      callGetAllPostsInHome(me._id);
    }, [])
  );

  const renderPosts = useCallback(
    ({ item }) => (
      <ProfilePage
        post={item}
        ID_user={me._id}
        onDelete={() => callChangeDestroyPost(item._id)}
        updatePostReaction={updatePostReaction}
        deletPostReaction={deletPostReaction}
      />
    ),
    [posts]
  );

  return (
    <View style={HomeS.container}>
      {loading ? (
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
          contentContainerStyle={{ paddingTop: 42}}
          ListEmptyComponent={<NothingHome />}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          scrollEventThrottle={16}
        />
      </>
      )}
    </View>
  );
};

export default Home;
