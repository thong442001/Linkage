import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import HomeNavigation from './HomeNavigation';
import UserNavigation from './UserNavigation';
import Welcome from '../screens/welcome/Welcome';

const AppNavigation = () => {

  const user = useSelector(state => state.app.user);
  const [isSplashVisible, setSplashVisible] = useState(true);  // Trạng thái để kiểm soát màn hình chào

  useEffect(() => {
    // Hiển thị màn hình chào trong 2 giây
    const timeout = setTimeout(() => {
      setSplashVisible(false);  // Ẩn màn hình chào sau 2 giây
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

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
