import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Stories from '../../components/items/Stories'
import Post from '../../components/items/Post';
import { useSelector } from 'react-redux';
import { oStackHome } from '../../navigations/HomeNavigation';

const Home = (props) => {
  // const [stories, setStories] = useState([])
  const { route, navigation } = props;
  const { params } = route;

  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);

  const Information = () => {

  }
  const headerComponentStory = () => {
    return (
      <View style={styles.boxStory}>
        <Image style={styles.imageStory} source={{ uri: me?.avatar }} />
        <View style={styles.backGround}>
          <View style={styles.addStory}>
            <Icon name="add-circle" size={30} color="#0064E0" />
          </View>
        </View>
      </View>
    )
  }

  const headerComponentPost = () => {
    return (
      <View>
        <View style={styles.box}>
          <View style={styles.header}>
            <Text style={styles.title}>Linkage</Text>
            <View style={styles.icons}>
              <TouchableOpacity style={styles.iconsPadding}>
                <Icon name="add-circle" size={30} color="gray" />
              </TouchableOpacity>
              {/* to Search */}
              <TouchableOpacity
                style={styles.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.Search.name)}
              >
                <Icon name="search" size={30} color="gray" />
              </TouchableOpacity>
              {/* to HomeChat */}
              <TouchableOpacity
                style={styles.iconsPadding}
                onPress={() => navigation.navigate(oStackHome.HomeChat.name)}
              >
                <Icon name="mail" size={30} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line}></View>
          <View style={styles.header2}>
            <TouchableOpacity
            //onPress={() => navigation.navigate('Information')}
            >
              <Image
                style={styles.image}
                source={{ uri: me?.avatar }}
              />
            </TouchableOpacity>

            <TextInput
              style={styles.textInput}
              placeholder="Bạn đang nghĩ gì ?"
            />
            <View style={styles.icons}>
              <View style={styles.iconsPadding2}>
                <Icon name="image" size={30} color="#0064E0" />
              </View>
            </View>
          </View>
        </View>
        {/* story */}
        <View style={[styles.box, { marginTop: 4 }]}>
          <View style={styles.story}>
            <FlatList
              data={data}
              renderItem={({ item }) => <Stories stories={item} />}
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
    <View style={styles.container}>


      {/* post */}
      <View>
        <View style={styles.post}>
          <FlatList
            data={dataPost}
            renderItem={({ item }) => <Post post={item} />}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={headerComponentPost}
          />
        </View>
      </View>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A1A6AD"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    marginHorizontal: 20,

  },
  box: {
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    color: "#0064E0",
    fontWeight: "bold",
  },
  icons: {
    flexDirection: 'row'
  },
  iconsPadding: {
    paddingLeft: 21
  },
  iconsPadding2: {
    paddingLeft: 15,
  },
  line: {
    height: 0.5,
    width: '100%',
    backgroundColor: 'gray',
  },
  header2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    marginHorizontal: 20,
  },
  image: {
    marginRight: 15,
    width: 42,
    height: 42,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 28,
    paddingLeft: 10,
    height: 42,
  },
  story: {
    flexDirection: 'row',
    // marginLeft: 20,
    marginVertical: 9,
  },
  post: {

  },
  imageStory: {
    width: 123,
    height: 192,
    borderRadius: 10,
  },
  backGround: {
    backgroundColor: '#fff',
    height: 57,
    width: "100%",
    position: 'absolute',
    bottom: -0.1,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    alignItems: 'center',
  },
  boxStory: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 11,
  },
  addStory: {
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 50,
    position: 'absolute',
    top: -15
  }
})