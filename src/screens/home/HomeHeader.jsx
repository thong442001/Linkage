import React from 'react';
import { Animated, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeS from '../../styles/screens/home/HomeS';
import { oStackHome } from '../../navigations/HomeNavigation';

const HomeHeader = ({ navigation, me, headerTranslate }) => {
  return (
    <Animated.View
      style={[
        HomeS.box1,
        {
          position: 'absolute',
          left: 0,
          right: 0,
          zIndex: 1,
          transform: [{ translateY: headerTranslate }],
        },
      ]}>
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
          <TouchableOpacity onPress={() => navigation.navigate('QRScannerScreen')} style={HomeS.iconsPadding}>
            <Icon name="scan-outline" size={25} color="black" />
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={HomeS.iconsPadding}
            onPress={() => navigation.navigate('HuggingFaceImageGenerator')}>
            <Icon name="add" size={25} color="black" />
          </TouchableOpacity> */}
          <TouchableOpacity
            style={HomeS.iconsPadding}
            onPress={() => navigation.navigate(oStackHome.Search.name)}>
            <Icon name="search-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={HomeS.iconsPadding}
            onPress={() => navigation.navigate(oStackHome.HomeChat.name)}>
            <Icon name="chatbubble-ellipses-outline" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>

    </Animated.View>

  );
};

export default HomeHeader;
