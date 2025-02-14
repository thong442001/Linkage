import React from 'react'
// import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';

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
const TabHome = () => {
  const me = useSelector(state => state.app.user);
  //console.log(theme);
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let name;
          if (route.name === 'Home') {
            name = "home"
            color = focused
              ? "#121212"
              : "gray"
          } else if (route.name === 'Friend') {
            name = "users";
            color = focused
              ? "#121212"
              : "gray"
          } else if (route.name === 'Notification') {
            name = "bell-o";
            color = focused
              ? "#121212"
              : "gray"
          } else if (route.name === 'Profile') {
            name = "user-circle-o";
            color = focused
              ? "#121212"
              : "gray"
          } else if (route.name === 'Setting') {
            name = "server";
            color = focused
              ? "#121212"
              : "gray"
          }

          return <FontAwesome name={name} size={size} color={color} />;
        },
        headerShown: false,
        tabBarActiveTintColor: '#D17842',
        tabBarActiveBackgroundColor: "white",
        tabBarInactiveBackgroundColor: "white",
        //ẩn bottom khi bàn phím xuất hiện
        tabBarHideOnKeyboard: true,

      })}
    >
      {
        Object.keys(oTab).map((item, index) => {
          if (oTab[item].name == 'Profile') {
            return <Tab.Screen
              key={index}
              name={oTab[item].name}
              component={oTab[item].component}
              options={{ title: "" }}
              listeners={({ navigation }) => ({
                tabPress: (e) => {
                  e.preventDefault(); // Chặn mặc định
                  navigation.navigate("Profile", { _id: me._id }); // Reset về profile của chính bạn
                },
              })}
            />
          } else {
            return <Tab.Screen
              key={index}
              name={oTab[item].name}
              component={oTab[item].component}
              options={{ title: "" }}
            />
          }
        })
      }
      {/* <Tab.Screen name="Home" component={Home} options={{ title: '' }} />
      <Tab.Screen name="Search" component={Search} options={{ title: '' }} />
      <Tab.Screen name="AddPostNavigation" component={AddPostNavigation} options={{ title: '' }} />
      <Tab.Screen name="AddFriend" component={Welcome} options={{ title: '' }} />
      <Tab.Screen name="Profile" component={Profile} options={{ title: '' }} /> */}
    </Tab.Navigator >
  )
}

//stack home
import Search from '../screens/home/Search';
import Story from '../screens/story/Story';
import Chat from '../screens/chat/Chat';
import HomeChat from '../screens/chat/HomeChat';
import CreateGroup from '../screens/chat/CreateGroup';
import SettingChat from '../screens/chat/SettingChat';
import MembersGroup from '../screens/chat/MembersGroup';
import AddFriendGroup from '../screens/chat/AddFriendGroup';
import AvtNameGroup from '../screens/chat/AvtNameGroup';

const oStackHome = {
  TabHome: { name: 'TabHome', component: TabHome },
  Search: { name: 'Search', component: Search },
  Story: { name: 'Story', component: Story },
  Chat: { name: 'Chat', component: Chat },
  HomeChat: { name: 'HomeChat', component: HomeChat },
  CreateGroup: { name: 'CreateGroup', component: CreateGroup },
  SettingChat: { name: 'SettingChat', component: SettingChat },
  MembersGroup: { name: 'MembersGroup', component: MembersGroup },
  AddFriendGroup: { name: 'AddFriendGroup', component: AddFriendGroup },
  AvtNameGroup: { name: 'AvtNameGroup', component: AvtNameGroup },
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

//stack add post
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