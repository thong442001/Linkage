import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import React, { useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Stories from '../../components/items/Stories';
import ProfilePage from '../../components/items/ProfilePage';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import HomeS from '../../styles/screens/home/HomeS';
import {
  getAllPostsInHome,
  changeDestroyPost
} from '../../rtk/API';
import HomeLoading from '../../utils/skeleton_loading/HomeLoading';  // Đảm bảo đã import component này
import NothingHome from '../../utils/animation/homeanimation/NothingHome';

const Home = props => {
  const { route, navigation } = props;
  const { params } = route;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [loading, setloading] = useState(true); // Quản lý trạng thái loading
  const [posts, setPosts] = useState(null);
  const [stories, setStories] = useState([]);

  // useEffect(() => {
  //   callGetAllPostsInHome(me._id);

  //   const focusListener = navigation.addListener('focus', () => {
  //     callGetAllPostsInHome(me._id);
  //   });

  //   return () => {
  //     focusListener();
  //   };
  // }, [navigation]);


  const callGetAllPostsInHome = async (ID_user) => {
    try {
      setloading(true)
      await dispatch(getAllPostsInHome({ me: ID_user, token: token }))
        .unwrap()
        .then(response => {
          setPosts(response.posts);
          setStories(response.stories);
          setloading(false); // Kết thúc tải dữ liệu
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:: ', error);
        });
    } catch (error) {
      console.log(error);
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

  useFocusEffect(
    useCallback(() => {
      //console.log('123');
      callGetAllPostsInHome(me._id); // Gọi API load dữ liệu
    }, [])
  );

  const headerComponentStory = () => {
    return (
      <TouchableOpacity
        style={HomeS.boxStory}
        onPress={() => navigation.navigate(oStackHome.PostStory.name)}>
        <Image style={HomeS.imageStory} source={{ uri: me?.avatar }} />
        <View style={HomeS.backGround}>
          <View style={HomeS.addStory}>
            <Icon name="add-circle" size={30} color="#0064E0" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const headerComponentPost = () => {
    return (
      <View>
        {/* Nội dung phần header của post */}
        <View style={HomeS.box1}>
          {/* Logo, search, chat icons */}
          <View style={HomeS.header}>
            <View style={HomeS.logo}>
              <Image
                style={{ width: 15, height: 22 }}
                source={require('../../../assets/images/LK.png')}
              />
              <Text style={HomeS.title}>inkage</Text>
            </View>
            <View style={HomeS.icons}>
              <TouchableOpacity style={HomeS.iconsPadding}>
                <Icon name="add" size={25} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.Search.name)}>
                <Icon name="search" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.HomeChat.name)}>
                <Icon name="mail" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Input to post */}
          <View style={HomeS.header2}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { ID_user: me._id })}>
              <Image style={HomeS.image} source={{ uri: me?.avatar }} />
            </TouchableOpacity>
            <TextInput
              onPress={() => navigation.navigate('UpPost')}
              style={HomeS.textInput}
              placeholder="Bạn đang nghĩ gì ?"
              placeholderTextColor={'black'}
            />
            <View style={HomeS.icons}>
              <View style={HomeS.iconsPadding2}>
                <Icon name="image" size={20} color="gray" />
              </View>
            </View>
          </View>
        </View>

        {/* Story */}
        <View style={[HomeS.box, { marginTop: 4 }]}>
          <View style={HomeS.story}>
            <FlatList
              data={stories}
              renderItem={({ item }) => <Stories StoryPost={item} />}
              keyExtractor={(item, index) => item?._id ? item._id.toString() : `story-${index}`}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={headerComponentStory}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={HomeS.container}>
      {/* Nếu đang tải dữ liệu, hiển thị HomeLoading */}
      {loading ? (
        <HomeLoading />
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <ProfilePage
            post={item}
            ID_user={me._id}
            onDelete={() => callChangeDestroyPost(item._id)}
          />}
          keyExtractor={item => item._id}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={headerComponentPost}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 3 }}
          ListEmptyComponent={<NothingHome />}
        />
      )}
    </View>
  );
};

export default Home;
