import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const UserStack = createNativeStackNavigator();
import Screen1 from '../screens/register/Screen1';
import Screen2 from '../screens/register/Screen2';
import Screen3 from '../screens/register/Screen3';
import Login from '../screens/login/Login';
import CreatePasswordScreen from '../screens/register/CreatePasswordScreen';
const UserNavigation = () => {
    return (
        <UserStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            <UserStack.Screen name="Login" component={Login} />
            <UserStack.Screen name="Screen1" component={Screen1} />
            <UserStack.Screen name="Screen2" component={Screen2} />
            <UserStack.Screen name="Screen3" component={Screen3} />
            <UserStack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />
        </UserStack.Navigator>
    )
}

export default UserNavigation