import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import { getAllReaction } from '../rtk/API';
import { setReactions } from '../rtk/Reducer';
import { 
  ZegoCallInvitationDialog, 
  ZegoUIKitPrebuiltCallWaitingScreen, 
  ZegoUIKitPrebuiltCallInCallScreen 
} from '@zegocloud/zego-uikit-prebuilt-call-rn';

const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const [isSplashVisible, setSplashVisible] = useState(true);
  const reactions = useSelector(state => state.app.reactions);

  useEffect(() => {
    if (reactions == null) {
      callGetAllReaction();
    }

    const timeout = setTimeout(() => {
      setSplashVisible(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then(response => {
          dispatch(setReactions(response.reactions));
        })
        .catch(error => {
          console.log('Error:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <NavigationContainer>
      <ZegoCallInvitationDialog />
      {isSplashVisible ? (
        <Welcome />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {user ? (
            <Stack.Screen name="HomeNavigation" component={HomeNavigation} />
          ) : (
            <Stack.Screen name="UserNavigation" component={UserNavigation} />
          )}
          <Stack.Screen name="ZegoUIKitPrebuiltCallWaitingScreen" component={ZegoUIKitPrebuiltCallWaitingScreen} />
          <Stack.Screen name="ZegoUIKitPrebuiltCallInCallScreen" component={ZegoUIKitPrebuiltCallInCallScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigation;
