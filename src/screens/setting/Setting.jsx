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
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../rtk/Reducer';
import QRCode from 'react-native-qrcode-svg';
import {
  setNoti_token
} from '../../rtk/API'
const { width, height } = Dimensions.get('window');
const Setting = (props) => {

  const { route, navigation } = props;
  const { params } = route;

  const dispatch = useDispatch();
  const me = useSelector(state => state.app.user);
  const token = useSelector(state => state.app.token);
  const [qrVisible, setQrVisible] = useState(false); // 🔥 State để hiển thị modal QR

  const onLogout = () => {
    dispatch(setNoti_token({ ID_user: me._id }))
      .unwrap()
      .then((response) => {
        console.log(response);
        // xóa user trong redux
        dispatch(logout())
      })
      .catch((error) => {
        console.log(error);
      });
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
          <Text style={styles.textSetting}>Cài đặt</Text>
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
            <TouchableOpacity onPress={() => setQrVisible(true)}>
              <Icon name="qr-code-outline" size={22} color="black" />
            </TouchableOpacity>
            {/* 🔥 Modal hiển thị QR Code */}
            <Modal
              visible={qrVisible}
              transparent
              onRequestClose={() => setQrVisible(false)}>
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>Mã QR của bạn</Text>
                  <QRCode
                    value={`chatapp://chat/${me._id}`}
                    size={200}
                  />
                  <TouchableOpacity
                    onPress={() => setQrVisible(false)}
                    style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          <ScrollView style={styles.list}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangeDisplayName')}>
              <Option
                icon="person"
                title="Thay đổi tên"
                subtitle="Bạn có thể thay đổi tên của bạn"
              />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('ChangePassWord')}>
              <Option
                icon="lock-closed"
                title="Thay đổi mật khẩu"
                subtitle="Bạn có thể thay đổi mật khẩu của bạn"
              />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('Trash')}>
              <Option
                icon="trash"
                title="Thùng rác"
                subtitle="Chứa các bài viết đã xóa"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout}>
              <Option
                icon="exit-outline"
                title="Đăng xuất"
                subtitle="Đăng xuất khỏi tài khoản của bạn"
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  closeButtonText: { color: 'white', fontSize: 16 },
});