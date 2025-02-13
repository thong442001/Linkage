import React, {useState, useEffect, useRef} from 'react';
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
  TextInput,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {getUser} from '../../rtk/Reducer';
import {oStackHome} from '../../navigations/HomeNavigation';

const {width, height} = Dimensions.get('window');
const emojis = ['❤️', '😂', '👍', '🔥', '😢', '👏'];

const Story = ({route}) => {
  const {StoryView} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState([]);
  const progress = useRef(new Animated.Value(0)).current;
  const [message, setMessage] = useState('');

  const token = useSelector(state => state.app.token);
  const user = useSelector(state => state.app.user);

  useEffect(() => {
    if (!user && token) {
      dispatch(getUser(token));
    }
  }, [user, token, dispatch]);

  const handlePress = event => {
    const {locationX} = event.nativeEvent;
    if (locationX < width / 2) {
      setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    } else {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Image source={StoryView.image} style={styles.image} />

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={StoryView.avatar} style={styles.avatar} />
            <Text style={styles.username}>
              {StoryView.name} {StoryView.last_name}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.exitButton}
            onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        {/* Thanh chọn biểu cảm */}
        <View style={styles.emojiContainer}>
          <FlatList
            data={emojis}
            horizontal
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{
              justifyContent: 'center',
              alignItems: 'center',
              flexGrow: 1,
            }}
            renderItem={({item}) => (
              <TouchableOpacity style={styles.emojiButton}>
                <Text style={styles.emojiText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Thanh gửi tin nhắn */}
        <View style={styles.messageContainer}>
          <TextInput
            style={styles.input}
            placeholder="Gửi tin nhắn..."
            placeholderTextColor="#aaa"
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendText}>📩</Text>
          </TouchableOpacity>
        </View>
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
  emojiContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 10,
  },

  emojiButton: {
    padding: 8,
  },
  emojiText: {
    fontSize: 30,
  },
  messageContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    paddingHorizontal: 10,
    width: '90%',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    color: 'white',
    fontSize: 16,
  },
  sendButton: {
    padding: 10,
  },
  sendText: {
    fontSize: 20,
    color: 'white',
  },
});

export default Story;
