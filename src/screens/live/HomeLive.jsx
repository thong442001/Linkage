import React from 'react';
import { Button, View, StyleSheet, Text, Dimensions, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
const {width, height} = Dimensions.get('window');

export default function HomeLive({ route }) {
  const { userID, userName, liveID, avatar } = route.params;
  const me = useSelector(state => state.app.user);
  const navigation = useNavigation();

  const onJoinPress = () => {
    navigation.navigate('AudienceScreen', {
      userID: me._id,
      userName: me.first_name + ' ' + me.last_name,
      liveID: liveID,
    });
  };

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.avatarContainer}>
        
        <Image
          style={[styles.avatarLive, styles.liveBorder]}
          source={{ uri: avatar }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.liveID}>Live ID: {liveID}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={onJoinPress}>
        <Text style={styles.buttonText}>Bấm để xem live</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',  // Tạo nền sáng cho giao diện giống story
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarLive: {
    width: width * 0.5,  // Avatar to ở giữa màn hình
    height: width * 0.5,
    borderRadius: width * 0.5 / 2,  // Avatar hình tròn
  },
  liveBorder: {
    borderColor: 'red',  // Viền đỏ để nhấn mạnh trạng thái live
    borderWidth: 4,
  },
  infoContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  userName: {
    fontSize: 22,  // Tên người dùng lớn
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  liveID: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    marginTop: 30,
    backgroundColor: 'gray',  // Màu xanh giống như nút của Facebook
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,  // Bo tròn nút
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
