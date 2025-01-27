import React from 'react'
import { NavigationContainer } from '@react-navigation/native';

import { useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';


const AppNavigation = () => {
  //userTest
  const userTest = useSelector(state => state.app.userTest)

  return (
    <NavigationContainer>
      {
        userTest ? <HomeNavigation /> : <UserNavigation />
      }
    </NavigationContainer>
  )
}

export default AppNavigation