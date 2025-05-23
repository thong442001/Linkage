import React, { useCallback, useEffect, useRef, useState } from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { BackHandler } from 'react-native';

//tab tổng
import Home from '../screens/home/Home';
import Profile from '../screens/profile/Profile';
import Notification from '../screens/notification/Notification';
import Friend from '../screens/friend/Friend';
import Setting from '../screens/setting/Setting';
const oTab = {
  Home: { name: 'Home', component: Home },
  Friend: { name: 'Friend', component: Friend },
  Notification: { name: 'Notification', component: Notification },
  Profile: { name: 'Profile', component: Profile },
  Setting: { name: 'Setting', component: Setting }
}

const Tab = createBottomTabNavigator();

if (!BackHandler.removeEventListener) {
  BackHandler.removeEventListener = () => {
    // console.warn('BackHandler.removeEventListener is deprecated and patched.');
  };
}


const CustomTabBar = ({ state, descriptors, navigation, tabAnimation }) => {
  return (
    <Animated.View
      style={[
        styles.tabBarContainer,
        {
          transform: [
            {
              translateY: tabAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0],
              }),
            },
          ],
          opacity: tabAnimation,
        },
      ]}
    >
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconComponent;
          let iconName;
          if (route.name === 'Home') {
            iconComponent = Feather;
            iconName = 'home';
          } else if (route.name === 'Friend') {
            iconComponent = FontAwesome;
            iconName = 'user-o';
          } else if (route.name === 'Notification') {
            iconComponent = FontAwesome;
            iconName = 'bell-o';
          } else if (route.name === 'Profile') {
            iconComponent = FontAwesome;
            iconName = 'user-circle-o';
          } else if (route.name === 'Setting') {
            iconComponent = MaterialIcons;
            iconName = 'settings';
          }
          const Icon = iconComponent;

          const circleAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

          useEffect(() => {
            Animated.timing(circleAnim, {
              toValue: isFocused ? 1 : 0,
              duration: 200,
              easing: Easing.out(Easing.circle),
              useNativeDriver: true,
            }).start();
          }, [isFocused, circleAnim]);

          const circleStyle = {
            transform: [{ scale: circleAnim }],
            opacity: circleAnim,
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
            >
              <View style={styles.iconWrapper}>
                <Animated.View style={[styles.circle, circleStyle]} />
                <Icon
                  name={iconName}
                  size={26}
                  color={isFocused ? '#fff' : '#8e8e93'}
                  style={styles.iconStyle}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

const TabHome = ({ navigation }) => {
  const me = useSelector((state) => state.app.user);
  const [isTabVisible, setTabVisible] = useState(true);
  const tabAnimation = useRef(new Animated.Value(1)).current;

  const handleScroll = useCallback(
    (visible) => {
      setTabVisible(visible);
      Animated.timing(tabAnimation, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    [tabAnimation]
  );


  // Đặt lại trạng thái bottom tab khi Home được focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      handleScroll(true); // Hiển thị bottom tab khi Home được focus
    });

    return unsubscribe;
  }, [navigation, handleScroll]);

  
  // Xử lý nút back của thiết bị
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!isTabVisible) {
        handleScroll(true); // Hiển thị Bottom Tab khi nhấn back
      }
      return false; // Cho phép hành vi back mặc định
    });

    return () => backHandler.remove();
  }, [isTabVisible, handleScroll]);

  // Đặt lại trạng thái khi chuyển tab
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', () => {
      handleScroll(true); // Hiển thị Bottom Tab khi nhấn tab
    });

    return unsubscribe;
  }, [navigation, handleScroll]);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <CustomTabBar {...props} tabAnimation={tabAnimation} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D17842',
        tabBarActiveBackgroundColor: 'white',
        tabBarInactiveBackgroundColor: 'white',
        tabBarHideOnKeyboard: true,
      }}
    >
      {Object.keys(oTab).map((item, index) => {
        if (oTab[item].name === 'Profile') {
          return (
            <Tab.Screen
              key={index}
              name={oTab[item].name}
              component={oTab[item].component}
              options={{ title: '' }}
              initialParams={{ handleScroll }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault();
                  navigation.navigate('Profile', { _id: me._id, handleScroll });
                  handleScroll(true);
                },
              })}
            />
          );
        } else {
          return (
            <Tab.Screen
              key={index}
              name={oTab[item].name}
              component={oTab[item].component}
              options={{ title: '' }}
              initialParams={{ handleScroll }}
              listeners={() => ({
                tabPress: () => {
                  handleScroll(true);
                },
              })}
            />
          );
        }
      })}
    </Tab.Navigator>
  );
};


//stack home
import Search from '../screens/home/Search';
import PostStory from '../screens/story/PostStory';
import Story from '../screens/story/Story';
import Chat from '../screens/chat/Chat';
import HomeChat from '../screens/chat/HomeChat';
import CreateGroup from '../screens/chat/CreateGroup';
import SettingChat from '../screens/chat/SettingChat';
import MembersGroup from '../screens/chat/MembersGroup';
import AddFriendGroup from '../screens/chat/AddFriendGroup';
import AvtNameGroup from '../screens/chat/AvtNameGroup';
import UpPost from '../screens/home/UpPost';
import PostDetail from '../screens/home/PostDetail';
import StoryViewer from '../screens/story/StoryViewer';
import ChangeDisplayName from '../screens/changeProfile/ChangeDisplayName';
import Trash from '../screens/setting/Trash';
import ChangePassWord from '../screens/changeProfile/ChangePassWord';
import CallPage from '../screens/call/CallPage';
import ChatBot from '../screens/chat/ChatBot';
import ListFriend from '../screens/friend/ListFriend';
import HuggingFaceImageGenerator from '../screens/Al/RunwayMLImageGenerator ';
import QRScannerScreen from '../screens/qrCode/QRScannerScreen';
import QRSannerAddGroup from '../screens/qrCode/QRSannerAddGroup';
import HomeLive from '../screens/live/HomeLive';
import HostLive from '../screens/live/HostLive';
import AudienceScreen from '../screens/live/AudienceScreen';
import IncomingCallScreen from '../screens/call/IncomingCallScreen';
import InGame3La from '../screens/game/3la/InGame3La';
import ManHinhCho from '../screens/game/3la/ManHinhCho';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ringing from '../screens/call/Ringing';
import Report from '../screens/report/Report';
import ListTag from '../screens/home/ListTag';
import pokemon from '../screens/game/pokemon/pokemon';
import man_hinh_chao_pokemon from '../screens/game/pokemon/pokemon';
import MapScreen from '../screens/map/MapScreen';
import SwitchNoti from '../screens/notification/SwitchNoti';
import vua_tieng_viet from '../screens/game/noi_tu/noi_tu';
import listgame from '../screens/game/listgame';
import CheckPhone from '../screens/forgot_password/CheckPhone';
import CreatePasswordPhone from '../screens/forgot_password/CreatePasswordPhone';
import ListGoiY from '../screens/friend/ListGoiY';
import OTPScreen from '../screens/register/OTPScreen';
import { useFocusEffect } from '@react-navigation/native';
const oStackHome = {
  TabHome: { name: 'TabHome', component: TabHome },
  Search: { name: 'Search', component: Search },
  PostStory: { name: 'PostStory', component: PostStory },
  Story: { name: 'Story', component: Story },
  StoryViewer: { name: 'StoryViewer', component: StoryViewer },
  Chat: { name: 'Chat', component: Chat },
  HomeChat: { name: 'HomeChat', component: HomeChat },
  CreateGroup: { name: 'CreateGroup', component: CreateGroup },
  SettingChat: { name: 'SettingChat', component: SettingChat },
  MembersGroup: { name: 'MembersGroup', component: MembersGroup },
  AddFriendGroup: { name: 'AddFriendGroup', component: AddFriendGroup },
  AvtNameGroup: { name: 'AvtNameGroup', component: AvtNameGroup },
  UpPost: { name: 'UpPost', component: UpPost },
  PostDetail: { name: 'PostDetail', component: PostDetail },
  Home: { name: 'Home', component: Home },
  ChangeDisplayName: { name: 'ChangeDisplayName', component: ChangeDisplayName },
  Trash: { name: 'Trash', component: Trash },
  ChangePassWord: { name: 'ChangePassWord', component: ChangePassWord },
  CallPage: { name: 'CallPage', component: CallPage },
  ChatBot: { name: 'ChatBot', component: ChatBot },
  ListFriend: { name: 'ListFriend', component: ListFriend },
  HuggingFaceImageGenerator: { name: 'HuggingFaceImageGenerator', component: HuggingFaceImageGenerator },
  QRScannerScreen: { name: 'QRScannerScreen', component: QRScannerScreen },
  QRSannerAddGroup: { name: 'QRSannerAddGroup', component: QRSannerAddGroup },
  HostLive: { name: 'HostLive', component: HostLive },
  HomeLive: { name: 'HomeLive', component: HomeLive },
  AudienceScreen: { name: 'AudienceScreen', component: AudienceScreen },
  IncomingCallScreen: { name: 'IncomingCallScreen', component: IncomingCallScreen },
  InGame3La: { name: 'InGame3La', component: InGame3La },
  ManHinhCho: { name: 'ManHinhCho', component: ManHinhCho },
  Ringing: { name: 'Ringing', component: Ringing },
  Report: { name: 'Report', component: Report },
  ListTag: { name: 'ListTag', component: ListTag },
  pokemon: { name: 'pokemon', component: pokemon },
  man_hinh_chao_pokemon: { name: 'man_hinh_chao_pokemon', component: man_hinh_chao_pokemon },
  Setting: { name: 'Setting', component: Setting },
  MapScreen: { name: 'MapScreen', component: MapScreen },
  SwitchNoti: { name: 'SwitchNoti', component: SwitchNoti },
  OTPScreen: { name: 'OTPScreen', component: OTPScreen },
  vua_tieng_viet: { name: 'vua_tieng_viet', component: vua_tieng_viet },
  listgame: { name: 'listgame', component: listgame },
  CheckPhone: { name: 'CheckPhone', component: CheckPhone },
  CreatePasswordPhone: { name: 'CreatePasswordPhone', component: CreatePasswordPhone },
  ListGoiY: { name: 'ListGoiY', component: ListGoiY },
}


const StackHome = createNativeStackNavigator();
const HomeNavigation = () => {
  return (
    <StackHome.Navigator screenOptions={{ headerShown: false }} initialRouteName='TabHome'>
      {/* bottom navigation (TabHome)*/}
      {
        Object.keys(oStackHome).map((item, index) => {
          return <StackHome.Screen
            key={index}
            name={oStackHome[item].name}
            component={oStackHome[item].component} />
        })
      }
      {/* <StackHome.Screen name="TabHome" component={TabHome} />
      <StackHome.Screen name="Chi_tiet_san_pham" component={Chi_tiet_san_pham} />
      <StackHome.Screen name="Chinh_sua_thong_tin_ca_nhan" component={Chinh_sua_thong_tin_ca_nhan} /> */}
    </StackHome.Navigator>
  )
}

// //stack change profile
// import SelectImage from '../components/screens/SelectImage';
// import UpPost from '../components/screens/UpPost';
// const oStackAddPost = {
//   SelectImage: { name: 'SelectImage', component: SelectImage },
//   UpPost: { name: 'UpPost', component: UpPost },
// }
// const StackProfile = createNativeStackNavigator();
// const AddPostNavigation = () => {
//   return (
//     <StackProfile.Navigator screenOptions={{ headerShown: false }} initialRouteName='SelectImage'>
//       {
//         Object.keys(oStackAddPost).map((item, index) => {
//           return <StackProfile.Screen
//             key={index}
//             name={oStackAddPost[item].name}
//             component={oStackAddPost[item].component} />
//         })
//       }
//       {/* <StackProfile.Screen name="Thong_tin_ca_nhan" component={Thong_tin_ca_nhan} />
//       <StackProfile.Screen name="QandA" component={QandA} /> */}
//     </StackProfile.Navigator>
//   )
// }

export { oTab, oStackHome }
export default HomeNavigation

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#f4f6f7',
    borderRadius: 30,
    paddingVertical: 10,
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
  },

  iconWrapper: {
    width: 40,  // đủ lớn để chứa vòng tròn
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  circle: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0064E0', // màu tùy chỉnh
  },
  iconStyle: {
    zIndex: 1, // icon nằm trên vòng tròn
  },
});