import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import styles from '../../styles/components/items/FriendsItem';

const FriendRequestItem = props => {
  const {data, me, onXacNhan, onXoa} = props;

  return (
    <View style={[styles.container, {backgroundColor: 'white'}]}>
      <View style={styles.imgWrap}>
        {data.ID_userA == me ? (
          <Image style={styles.image} source={{uri: data.ID_userA.avatar}} />
        ) : (
          <Image style={styles.image} source={{uri: data.ID_userB.avatar}} />
        )}
      </View>
      <View style={styles.wrapper}>
        <View style={styles.info}>
          {data.ID_userA == me ? (
            <Text style={styles.name}>
              {data.ID_userA.first_name} {data.ID_userA.last_name}
            </Text>
          ) : (
            <Text style={styles.name}>
              {data.ID_userB.first_name} {data.ID_userB.last_name}
            </Text>
          )}
          <Text style={styles.sentTime}>30 giây</Text>
        </View>
        <View>
          <Text style={styles.mutualFriends}> Bạn chung</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => onXacNhan(data._id)}
            style={[styles.acpButton, {backgroundColor: '#0064E0'}]}>
            <Text style={[styles.acpTxt, 'white']}> Xác nhận </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onXoa(data._id)}
            style={[styles.delButton, {backgroundColor: '#A6A6A6'}]}>
            <Text style={[styles.delTxt, {color: 'white'}]}> Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default FriendRequestItem;
