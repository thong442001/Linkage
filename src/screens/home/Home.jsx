import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Stories from '../../components/items/Stories'
import Post from '../../components/items/Post';
import { useSelector } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';
import HomeS from '../../styles/screens/home/HomeS';

const Home = (props) => {
  // const [stories, setStories] = useState([])
  const { route, navigation } = props;
  const { params } = route;

  const [loading, setloading] = useState(true)


  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const story = useSelector(state => state.app.stories);

  const headerComponentStory = () => {
    return (
      <TouchableOpacity style={HomeS.boxStory} onPress={() => navigation.navigate(oStackHome.PostStory.name)}>
        <Image style={HomeS.imageStory} source={{ uri: me?.avatar }} />
        <View style={HomeS.backGround}>
          <View style={HomeS.addStory}>
            <Icon name="add-circle" size={30} color="#0064E0" />
          </View>
        </View>
      </TouchableOpacity>
    )
  }


  const renderStory = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => navigation.navigate(oStackHome.StoryViewer.name, { StoryView: item })}>
        <Stories stories={item} />
      </TouchableOpacity>
    );
  };


  const headerComponentPost = () => {
    return (
      <View>
        <View style={HomeS.box}>
          <View style={HomeS.header}>
            <Text style={HomeS.title}>Linkage</Text>
            <View style={HomeS.icons}>
              <TouchableOpacity style={HomeS.iconsPadding}>
                <Icon name="add-circle" size={30} color="gray" />
              </TouchableOpacity>
              {/* to Search */}
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.Search.name)}
              >
                <Icon name="search" size={30} color="gray" />
              </TouchableOpacity>
              {/* to HomeChat */}
              <TouchableOpacity
                style={HomeS.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.HomeChat.name)}
              >
                <Icon name="mail" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={HomeS.line}></View>
          <View style={HomeS.header2}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile', { ID_user: me._id })}
            >
              <Image
                style={HomeS.image}
                source={{ uri: me?.avatar }}
              />
            </TouchableOpacity>

            <TextInput
              onPress={() => navigation.navigate('UpPost')}
              style={HomeS.textInput}
              placeholder="Bạn đang nghĩ gì ?"
            // editable={false} ngan nhap lieu
            // selectTextOnFocus={false}
            />
            <View style={HomeS.icons}>
              <View style={HomeS.iconsPadding2}>
                <Icon name="image" size={30} color="#0064E0" />
              </View>
            </View>
          </View>
        </View>
        {/* story */}
        <View style={[HomeS.box, { marginTop: 4 }]}>
          <View style={HomeS.story}>

            
        
            <FlatList
              data={story}
              renderItem={renderStory}
              keyExtractor={(item) => item.id}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              ListHeaderComponent={headerComponentStory}
              contentContainerStyle={{ paddingHorizontal: 20 }}
            />
            
          </View>
        </View>
      </View>
    )
  }

  const data = [
    {
      id: 1,
      name: 'Kenny',
      image: 'https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg',
      avata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg'
    },
    {
      id: 2,
      name: 'Henry',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s',
      avata: 'https://www.shutterstock.com/image-photo/handsome-indian-male-office-employee-260nw-2278702237.jpg'
    },
    {
      id: 3,
      name: 'John',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNXaVKjl0ywihdE-KRHXIA6nevtd2IksdVw&s',
      avata: 'https://t3.ftcdn.net/jpg/02/35/92/68/360_F_235926813_VGqvkvucMfZ0T16NLwhkN9C8hUS0vbOH.jpg'
    },
  ]

  const dataPost = [
    {
      id: 1,
      name: 'Kenny',
      image: ['https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg'],
      avata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg',
      time: '1 giờ trước',
      title: 'Hôm nay trời đẹp quá',
    },
    {
      id: 2,
      name: 'Henry',
      image: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s'
      ],
      avata: 'https://www.shutterstock.com/image-photo/handsome-indian-male-office-employee-260nw-2278702237.jpg',
      time: '5 giờ trước',
      title: 'Hôm nay trời đẹp quá',
    },
    {
      id: 3,
      name: 'John',
      image:
        ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrNXaVKjl0ywihdE-KRHXIA6nevtd2IksdVw&s',
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfKFYJLwRyqjBk-O1RB0na6l08l5Invpcq5A&s'
        ],
      avata: 'https://t3.ftcdn.net/jpg/02/35/92/68/360_F_235926813_VGqvkvucMfZ0T16NLwhkN9C8hUS0vbOH.jpg',
      time: '1 ngày trước',
      title: 'Hôm nay trời đẹp quá',
    },
  ]

  return (
    <View style={HomeS.container}>
      {/* post */}
      <View>
        <View style={HomeS.post}>
          <FlatList
            data={dataPost}
            renderItem={({ item }) => <Post post={item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={headerComponentPost}
          />
        </View>
      </View>
    </View>
  )
}

export default Home