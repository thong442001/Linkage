import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { addPost } from '../../rtk/API';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
const { width, height } = Dimensions.get('window');

const Story = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState([]);
  const progress = useRef(new Animated.Value(0)).current;
  const [medias, setMedias] = useState([]);
  const [tags, setTags] = useState([]);
  const [typePost, settypePost] = useState('Story');

  const me = useSelector(state => state.app.user);

  const [selectedOption, setSelectedOption] = useState({
    status: 1,
    name: "Công khai"
  });
  const status = [
    {
      status: 1,
      name: "Công khai"
    },
    {
      status: 2,
      name: "Bạn bè"
    },
    {
      status: 3,
      name: "Chỉ mình tôi"
    },
  ];



  // Nếu có dữ liệu newStory từ route, cập nhật danh sách stories
  useEffect(() => {
    if (route.params?.newStory) {
      const newMedia =
        route.params.newStory;

      setStories([
        {
          id: new Date().getTime(),
          image: newMedia,
          avatar: { uri: me?.avatar },
          name: me ? `${me.first_name} ${me.last_name}` : '',
        },
      ]);

      setMedias([newMedia]); // Cập nhật medias
      setCurrentIndex(0);
      setCompletedIndices([]);
    }
  }, [route.params?.newStory, me]);
  console.log("Danh sách medias:", medias);

  // Hàm gọi API đăng Story
  const callAddPost = async () => {
    try {
      if (medias.length == 0) {
        console.log('chưa có dữ liệu');
        return;
      }
      const paramsAPI = {
        ID_user: me._id,
        caption: '',
        medias: medias,
        status: selectedOption.name,
        type: typePost,
        ID_post_shared: null,
        tags: [],
      }
      console.log(paramsAPI);
      await dispatch(addPost(paramsAPI))
        .unwrap()
        .then((response) => {
          //console.log(response.stories)
          navigation.navigate(oStackHome.TabHome.name);
        })
        .catch((error) => {
          console.log('Error1 addPost:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  console.log("Danh sách stories:", stories);



  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <Image source={{ uri: route?.params?.newStory }} style={styles.image} />


        {/* Avatar & Nút Thoát */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: me?.avatar }} style={styles.avatar} />
            <Text style={styles.username}>
              {me?.first_name} {me?.last_name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* Nút Gắn thẻ và Nhập văn bản */}
        <TouchableOpacity
          style={styles.textInputButton}
          onPress={() => console.log('Nhập văn bản')}>
          <Icon name="text" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tagButton}
          onPress={() => console.log('Gắn thẻ')}>
          <Icon name="person-add" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => console.log('Mở cài đặt')}>
          <Icon name="settings" size={24} color="white" />
        </TouchableOpacity>

        {/* Nút Đăng Story */}
        <TouchableOpacity style={styles.postButton} onPress={callAddPost}>
          <Text style={styles.postText}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: StatusBar.currentHeight || 0,
  },
  image: {
    width,
    height: height,
    resizeMode: 'cover',
  },
  progressBarContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 15,
    left: 10,
    right: 10,
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    height: 5,
    marginHorizontal: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'white',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
  },
  headerContainer: {
    position: 'absolute',
    top: 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exitButton: {
    padding: 8,
    borderRadius: 20,
  },
  exitText: {
    fontSize: 20,
    color: 'white',
  },
  postButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#71AFD8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  postText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInputButton: {
    position: 'absolute',
    top: 90,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagButton: {
    position: 'absolute',
    top: 150,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  settingsButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Story;
