import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import Icon4 from 'react-native-vector-icons/FontAwesome5';
import Icon5 from 'react-native-vector-icons/AntDesign';
import CommentS from './CommentS';
import ListComment from '../items/ListComment';
import FBPhotoGrid from '@renzycode/react-native-fb-photo-grid';
import { useRoute } from '@react-navigation/native';
import { useBottomSheet } from '../../context/BottomSheetContext';
import Expressive_details from '../../screens/home/Expressive_details';
import Icon6 from 'react-native-vector-icons/FontAwesome';

const Comment = props => {
  const { openBottomSheet } = useBottomSheet();
  const route = useRoute();
  const post = route.params?.post || {}; // Lấy post từ navigation
  const { navigation } = props;
  const dataComment = [
    {
      id: 1,
      name: 'Kenny',
      image:
        'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg',
      avatar:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg',
      comment: 'Chúc mừng bạn',
      time: '1p',
    },
    {
      id: 2,
      name: 'Henry',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s',
      avatar:
        'https://www.shutterstock.com/image-photo/handsome-indian-male-office-employee-260nw-2278702237.jpg',
      comment: 'Chúc mừng bạn',
      time: '1p',
    },
    {
      id: 3,
      name: 'John',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNXaVKjl0ywihdE-KRHXIA6nevtd2IksdVw&s',
      avatar:
        'https://t3.ftcdn.net/jpg/02/35/92/68/360_F_235926813_VGqvkvucMfZ0T16NLwhkN9C8hUS0vbOH.jpg',
      comment: 'Tuyệt vời quá ',
      time: '1p',
    },
  ];
  // button sheet reactions
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'like', icon: '👍', label: 'Thích' },
    { id: 'love', icon: '❤️', label: 'Yêu thích' },
    { id: 'haha', icon: '😂', label: 'Haha' },
    { id: 'wow', icon: '😮', label: 'Wow' },
    { id: 'sad', icon: '😢', label: 'Buồn' },
    { id: 'angry', icon: '😡', label: 'Phẫn nộ' },
  ];

  const users = [
    {
      id: '1',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },
    {
      id: '2',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'love',
    },
    {
      id: '3',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },
    {
      id: '4',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },

    // Thêm data người dùng vào đây
  ];

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.icon}>
          {tabs.find(tab => tab.id === item.reactionType)?.icon}
        </Text>
      </View>
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  const filteredUsers =
    selectedTab === 'all'
      ? users
      : users.filter(user => user.reactionType === selectedTab);

  const detail_reactions = () => {
    return (
      <View style={styles.container}>
        <View style={styles.tabContainer}>
          <FlatList
            data={tabs}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.tab,
                  selectedTab === item.id && styles.selectedTab,
                ]}
                onPress={() => {
                  setSelectedTab(item.id), console.log(item.id);
                }}>
                {item.icon && <Text style={styles.tabIcon}>{item.icon}</Text>}
                <Text style={styles.tabLabel}>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item.id}
          />
        </View>

        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
          keyExtractor={item => item.id}
        />
      </View>
    );
  };
  const header = () => {
    return (
      <View>
        <View style={{ marginVertical: 18 }}>
          <View style={CommentS.post}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <View style={{ marginRight: 10 }}>
                  <Icon name="chevron-back-outline" size={25} color="black" />
                </View>
              </TouchableOpacity>
              <Image style={CommentS.avata} source={{ uri: post.avata }} />
              <View style={{ marginLeft: 20 }}>
                <Text style={CommentS.name}>{post.name}</Text>
                <View style={CommentS.boxName}>
                  <Text style={CommentS.time}>{post.time}</Text>
                  <Icon name="earth" size={12} color="gray" />
                </View>
              </View>
            </View>
            <View style={CommentS.boxIcons}>
              <View style={{ marginRight: 10 }}>
                <Icon name="ellipsis-horizontal" size={25} color="black" />
              </View>
            </View>
          </View>
          <View style={CommentS.title}>
            <Text>{post.title}</Text>
          </View>
          <FBPhotoGrid
            height={300}
            gutterColor="#fff"
            photos={Array.isArray(post.image) ? post.image : []} // Kiểm tra dữ liệu
            gutterSize={1}
            onTouchPhoto={() => {
              navigation.navigate('PostDetail', { post });
            }}
          />
        </View>
        <View style={[CommentS.boxInteract, { marginBottom: 30 }]}>
          <View style={CommentS.boxIcons2}>
            <View style={CommentS.boxIcons3}>
              <Icon2 name="like" size={25} color="black" />
            </View>
            <Text>Thích</Text>
          </View>
          <View style={CommentS.boxIcons2}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Comment', { post });
              }}
              style={{ flexDirection: 'row' }}>
              <View style={CommentS.boxIcons3}>
                <Icon3 name="comment" size={20} color="black" />
              </View>
              <Text>Bình luận</Text>
            </TouchableOpacity>
          </View>
          <View style={[CommentS.boxIcons2]}>
            <View style={CommentS.boxIcons3}>
              <Icon4 name="share-alt" size={20} color="black" />
            </View>
            <Text>Chia sẻ</Text>
          </View>
        </View>
        <View style={[CommentS.line, { marginBottom: 20 }]}></View>
        <View
          style={[
            CommentS.boxHeader,
            {
              justifyContent: 'space-between',
              marginBottom: 20,
              marginHorizontal: 20,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              console.log(detail_reactions);
              openBottomSheet(50, detail_reactions);
            }}>
            <View style={CommentS.boxHeader}>
              <Icon5 name="like1" size={25} color="blue" />
              <Text style={{ marginHorizontal: 10 }}>161 </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataComment}
        renderItem={({ item }) => <ListComment comment={item} />}
        keyExtractor={item => item.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: '17%' }}
      />
      <View style={CommentS.boxInputText}>
        <View style={CommentS.line}></View>
        <TextInput
          style={CommentS.textInput}
          placeholder="Viết bình luận "
          multiline={true}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1877F2',
  },
  tabIcon: {
    marginRight: 4,
    fontSize: 16,
  },
  tabLabel: {
    color: '#65676B',
    fontSize: 14,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    position: 'absolute',
    marginLeft: 25,
    marginTop: 25,
  },
});

export default Comment;
