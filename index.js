/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import HomeLoading from './src/utils/skeleton_loading/HomeLoading';
import ProfileLoading from './src/utils/skeleton_loading/ProfileLoading';
import FriendLoading from './src/utils/skeleton_loading/FriendLoading';
AppRegistry.registerComponent(appName, () => App);
