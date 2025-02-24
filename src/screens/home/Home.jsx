import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Stories from '../../components/items/Stories';
import ProfilePage from '../../components/items/ProfilePage';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import HomeS from '../../styles/screens/home/HomeS';
import { getAllPostsInHome } from '../../rtk/API';
const Home = props => {
  // const [stories, setStories] = useState([])
  const { route, navigation } = props;
  const { params } = route;
  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const [posts, setPosts] = useState(null);
  const [stories, setStories] = useState([]);
  // const story = useSelector(state => state.app.stories);

  useEffect(() => {
    //console.log('1');
    // Call API khi lần đầu vào trang
    callGetAllPostsInHome(me._id);

    // Thêm listener để gọi lại API khi quay lại trang
    const focusListener = navigation.addListener('focus', () => {
      callGetAllPostsInHome(me._id);
      //console.log('2');
    });

    // Cleanup listener khi component bị unmount
    return () => {
      focusListener();
    };
  }, [navigation]);

  //call api getAllGroupOfUser
  const callGetAllPostsInHome = async ID_user => {
    try {
      await dispatch(getAllPostsInHome({ me: ID_user, token: token }))
        .unwrap()
        .then((response) => {
          // console.log("stories: " + response.stories)
          setPosts(response.posts);
          setStories(response.stories);
        })
        .catch(error => {
          console.log('Error getAllPostsInHome:: ', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

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

  const renderStory = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(oStackHome.StoryViewer.name, { story: item })}>
        <Stories StoryPost={item} />
      </TouchableOpacity>
    );
  };

  const headerComponentPost = () => {
    return (
      <View>
        <View style={HomeS.box1}>
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
              {/* to Search */}
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.Search.name)}>
                <Icon name="search" size={20} color="black" />
              </TouchableOpacity>
              {/* to HomeChat */}
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.HomeChat.name)}>
                <Icon name="mail" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
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
            // editable={false} ngan nhap lieu
            // selectTextOnFocus={false}
            />
            <View style={HomeS.icons}>
              <View style={HomeS.iconsPadding2}>
                <Icon name="image" size={20} color="gray" />
              </View>
            </View>
          </View>
        </View>
        {/* story */}
        <View style={[HomeS.box, { marginTop: 4 }]}>
          <View style={HomeS.story}>
            <FlatList
              data={stories}
              renderItem={({ item }) => {
                console.log("🎞 Rendering Story:", item); // Kiểm tra dữ liệu truyền vào
                return <Stories StoryPost={item} />; // Đúng props
              }}
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
      {/* post */}
      <View>
        <View style={HomeS.post}>
          <FlatList
            data={posts}
            renderItem={({ item }) => {
                        //  console.log("🎞 Rendering post:", item); // Kiểm tra dữ liệu truyền vào
            return <ProfilePage post={item} />; 
          }}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={headerComponentPost}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 3 }}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
