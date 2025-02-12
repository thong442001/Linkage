import {
  Image,
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
      <View style={styles.container_item1}>
        <Icon name="lock" size={30} color="black" />
        <Text style={styles.text}>Quyền riêng tư</Text>
      </View>
      <View style={styles.container_item1}>
        <Icon name="language" size={30} color="black" />
        <Text style={styles.text}>Thay đổi ngôn ngữ</Text>
      </View>
      <View style={styles.container_item1}>
        <Icon name="moon-o" size={30} color="black" />
        <Text style={styles.text}>Chế độ tối</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={onRegister}
      >
        <Text style={styles.text_button}>Đăng xuất</Text>
      </TouchableOpacity>
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
    height: 40,
    backgroundColor: '#E1E6EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 170,
  },
  text_button: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
  },
});
