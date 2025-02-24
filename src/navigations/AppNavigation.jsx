import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';
import {
  getAllReaction,
} from '../rtk/API';
import { setReactions } from '../rtk/Reducer';

const AppNavigation = () => {

  const dispatch = useDispatch();
  const user = useSelector(state => state.app.user);
  const [isSplashVisible, setSplashVisible] = useState(true);  // Trạng thái để kiểm soát màn hình chào
  const reactions = useSelector(state => state.app.reactions)
  //console.log("****: " + reactions)

  useEffect(() => {
    //reactions
    if (reactions == null) {
      callGetAllReaction()
    }
    // Hiển thị màn hình chào trong 2 giây
    const timeout = setTimeout(() => {
      setSplashVisible(false);  // Ẩn màn hình chào sau 2 giây
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);


  //call api getAllReaction
  const callGetAllReaction = async () => {
    try {
      await dispatch(getAllReaction())
        .unwrap()
        .then((response) => {
          //console.log("****: " + response)
          dispatch(setReactions(response.reactions));
        })
        .catch((error) => {
          console.log('Error:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <NavigationContainer>
      {
        isSplashVisible
          ? <Welcome />  // Hiển thị màn hình chào trước
          : (user ? <HomeNavigation /> : <UserNavigation />)

      }
      
    </NavigationContainer>
  );
}

export default AppNavigation;
