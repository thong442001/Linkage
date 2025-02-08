import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const UserStack = createNativeStackNavigator();
import Screen1 from '../screens/Register/Screen1';
import Screen2 from '../screens/Register/Screen2';
import Screen3 from '../screens/Register/Screen3';
import Login from '../screens/login/Login';
import Home from '../screens/home/Home';
import CreatePasswordScreen from '../screens/Register/CreatePasswordScreen';
import Profile from '../screens/profile/Profile';
const UserNavigation = () => {
    return (
        <UserStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            {/* <UserStack.Screen name="Home" component={Home} />
            <UserStack.Screen name="Profile" component={Profile} /> */}
            <UserStack.Screen name="Login" component={Login} />
            <UserStack.Screen name="Screen1" component={Screen1} />
            <UserStack.Screen name="Screen2" component={Screen2} />
            <UserStack.Screen name="Screen3" component={Screen3} />
            <UserStack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />
        </UserStack.Navigator>
    )
}

export default UserNavigation