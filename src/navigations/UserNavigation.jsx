import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const UserStack = createNativeStackNavigator();
import Screen1 from '../screens/register/Screen1';
import Screen2 from '../screens/register/Screen2';
import Screen3 from '../screens/register/Screen3';
import Login from '../screens/login/Login';
import CreatePasswordScreen from '../screens/register/CreatePasswordScreen';
import FindWithEmail from '../screens/forgot_password/FindWithEmail';
import FindWithPhone from '../screens/forgot_password/FindWithPhone';
import CheckEmail from '../screens/forgot_password/CheckEmail';
import CreateNewPassWord from '../screens/forgot_password/CreateNewPassWord';
import OTPScreen from '../screens/register/OTPScreen';
const UserNavigation = () => {
    return (
        <UserStack.Navigator initialRouteName='Login' screenOptions={{ headerShown: false }}>
            {/* <UserStack.Screen name="Home" component={Home} />
            <UserStack.Screen name="Profile" component={Profile} /> */}
            {/* <UserStack.Screen name="PostDetail" component={PostDetail} /> */}
            <UserStack.Screen name="Login" component={Login} />
            <UserStack.Screen name="Screen1" component={Screen1} />
            <UserStack.Screen name="Screen2" component={Screen2} />
            <UserStack.Screen name="Screen3" component={Screen3} />
            <UserStack.Screen name="CreatePasswordScreen" component={CreatePasswordScreen} />
            <UserStack.Screen name="FindWithEmail" component={FindWithEmail} />
            <UserStack.Screen name="FindWithPhone" component={FindWithPhone} />
            <UserStack.Screen name="CheckEmail" component={CheckEmail} />
            <UserStack.Screen name="CreateNewPassWord" component={CreateNewPassWord} />
            <UserStack.Screen name="OTPScreen" component={OTPScreen} />
        </UserStack.Navigator>
    );
};

export default UserNavigation;
