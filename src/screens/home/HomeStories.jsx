import React, { useState } from 'react';
import { FlatList, TouchableOpacity, View, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeS from '../../styles/screens/home/HomeS';
import Stories from '../../components/items/Stories';
import ItemLive from '../../components/items/ItemLive';
import { oStackHome } from '../../navigations/HomeNavigation';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

const HomeStories = ({ navigation, me, stories, liveSessions }) => {
      const [liveID, setliveID] = useState('');
      const me_info = useSelector(state => state.app.user);
      useFocusEffect(
              React.useCallback(() => {
                  setliveID(String(Math.floor(Math.random() * 100000000)));
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
        <TouchableOpacity onPress={() => navigation.navigate('HostLive', { 
           userID: me._id,
           avatar: me.avatar, 
           userName: me.first_name + ' ' + me.last_name, 
           liveID: liveID })}>
        <View style={HomeS.icons}>
          <View style={HomeS.iconsPadding2}>
            <Icon name="videocam" size={25} color="#df0b0b" />
          </View>
        </View>
        </TouchableOpacity>
      </View>

      {/* Phần danh sách Story */}
      <View style={HomeS.story}>
        <FlatList
          data={liveSessions.concat(stories)}
          renderItem={({ item }) => {
            if (item.liveID) {
              return <ItemLive user={item} />;a
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