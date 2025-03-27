import React from 'react';
import { FlatList, TouchableOpacity, View, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeS from '../../styles/screens/home/HomeS';
import Stories from '../../components/items/Stories';
import ItemLive from '../../components/items/ItemLive';
import { oStackHome } from '../../navigations/HomeNavigation';

const HomeStories = ({ navigation, me, stories, liveSessions }) => {
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

  return (
    <View style={[HomeS.box]}>
      
      {/* Phần Input to post nằm trên phần Story */}
      <View style={HomeS.header2}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile', { _id: me._id })}>
          <Image style={HomeS.image} source={{ uri: me?.avatar }} />
        </TouchableOpacity>
        <TextInput
          onPress={() => navigation.navigate('UpPost')}
          style={HomeS.textInput}
          placeholder="Bạn đang nghĩ gì ?"
          placeholderTextColor="black"
        />
        <View style={HomeS.icons}>
          <View style={HomeS.iconsPadding2}>
            <Icon name="image" size={20} color="#0064E0" />
          </View>
        </View>
      </View>

      {/* Phần danh sách Story */}
      <View style={HomeS.story}>
        <FlatList
          data={stories.concat(liveSessions)}
          renderItem={({ item }) => {
            if (item.liveID) {
              return <ItemLive user={item} />;
            } else {
              return <Stories StoryPost={item} />;
            }
          }}
          keyExtractor={(item, index) =>
            item.liveID ? item.liveID : item._id ? item._id.toString() : `story-${index}`
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ListHeaderComponent={headerComponentStory}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
        />
      </View>
    </View>
  );
};

export default HomeStories;
