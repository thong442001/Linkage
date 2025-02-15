import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../rtk/Reducer';

const Setting = (props) => {

  const { route, navigation } = props;
  const { params } = route;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);


  const onRegister = () => {
    dispatch(logout())
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text_tile}>Cài đặt</Text>
      <View style={styles.container_item}>
        <Image
          style={styles.img}
          source={{
            uri: me.avatar,
          }}
        />
        <Text style={styles.text}>{me.first_name} {me.last_name}</Text>
        <Icon
          name="sort-desc"
          size={30}
          color="black"
          style={{ marginLeft: 130 }}
        />
      </View>
      <View style={styles.container_item1}>
        <Icon name="user-circle" size={30} color="black" />
        <Text style={styles.text}>Thông tin các nhân</Text>
      </View>

      <Pressable onPress={() => navigation.navigate('ChangePassWord')}>
        <View style={styles.container_item1}>
          <Icon name="lock" size={30} color="black" />
          <Text style={styles.text}>Đổi mật khẩu</Text>
        </View>
      </Pressable>

      <Pressable onPress={() => navigation.navigate('ChangeDisplayName')}>
        <View style={styles.container_item1}>
          <Icon name="lock" size={30} color="black" />
          <Text style={styles.text}>Đổi tên</Text>
        </View>
      </Pressable>


      <View style={styles.btnLogout}>
        <TouchableOpacity
          style={styles.button}
          onPress={onRegister}>
          <Text style={styles.text_button}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 33,
    backgroundColor: '#F4F3F8',
  },
  text_tile: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
  },
  container_item: {
    width: '100%',
    height: 70,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 33,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
    marginLeft: 10,
  },
  container_item1: {
    width: '100%',
    height: 57,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 17,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#E1E6EA',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  text_button: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
  btnLogout: {
    position: 'absolute',
    bottom: '20',
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  }
});