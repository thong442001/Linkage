import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../rtk/Reducer';
const { width, height } = Dimensions.get('window');
const Setting = (props) => {

  const { route, navigation } = props;
  const { params } = route;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  
  const onRegister = () => {
    dispatch(logout())
  };



  const Option = ({ icon, title, subtitle, color = 'black' }) => (
    <View style={styles.option}>
      <Icon name={icon} size={20} color={color} />
      <View style={styles.optionText}>
        <Text style={[styles.optionTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.optionSubtitle}>{subtitle}</Text>}
      </View>
    </View>
  );

  return (
    
    <View style={styles.container}>
      <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.textSetting}>Setting</Text>
          </View>
          <View style={styles.body}>
            <View style={styles.profile}>
              <Pressable>
                <Image
                    source={{
                      uri: me.avatar,
                    }}
                  style={styles.avatar}
                />
              </Pressable>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{me.first_name} {me.last_name}</Text>
              </View>
              <Icon name="qr-code-outline" size={22} color="black" />
            </View>
            <ScrollView style={styles.list}>
              <TouchableOpacity
                onPress={() => navigation.navigate('ChangePassWord')}>
                <Option
                  icon="person"
                  title="Change user name"
                  subtitle="Privacy, security, change number"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ChangeDisplayName')}>
                <Option
                  icon="lock-closed"
                  title="Change password"
                  subtitle="Update your password"
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Option
                  icon="trash"
                  title="Delete account"
                  subtitle="Remove account permanently"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={onRegister}>
                <Option
                  icon="exit-outline"
                  title="Log out"
                  subtitle="Sign out from your account"
                  color="red"
                />
              </TouchableOpacity>
            </ScrollView>
          </View>
    
    {/* canhphan */}
    </View>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E4E4E4',
  },
  header: {
    alignItems: 'center',
    padding: height * 0.06,
    backgroundColor: '#E4E4E4',
  },
  body: {
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderTopLeftRadius: width * 0.1,
    borderTopRightRadius: width * 0.1,
    flex: 1,
  },
  textSetting: {
    fontSize: width * 0.07,
    fontWeight: 'bold',
    color: 'black',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.03,
    backgroundColor: 'white',
    marginVertical: height * 0.01,
    borderRadius: width * 0.03,
  },
  optionIcon: {
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    marginLeft: width * 0.04,
  },
  optionTitle: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  optionTitle1: {
    color: 'red',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  optionSubtitle: {
    color: 'gray',
    fontSize: width * 0.03,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomLeftRadius: width * 0.05,
    borderBottomRightRadius: width * 0.05,
    padding: width * 0.03,
    marginVertical: height * 0.02,
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
  },
  profileInfo: {
    flex: 1,
    marginLeft: width * 0.04,
  },
  name: {
    color: 'black',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  status: {
    color: 'gray',
    fontSize: width * 0.035,
  },
});