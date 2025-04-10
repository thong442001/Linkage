import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, memo } from 'react'

const ItemListGoiY = memo(({
  item,
  _id,
  onThemBanBe = () => { },
}) => {

  // const { item, _id } = props;
  const [ID_friend, setID_friend] = useState(null);
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState(null);

  return (
    <View style={styles.container}>

      <Image style={styles.img} source={{ uri: item.user.avatar }} />

      <View style={{ flex: 1, paddingHorizontal: 10, gap: 3 }}>
        <Text style={styles.text}>{item.user.first_name} {item.user.last_name}</Text>
        <Text style={styles.text_goi_y}>{item.mutualFriendCount} bạn chung</Text>
        <TouchableOpacity
          style={styles.button1}
        //onPress={() => onXacNhan(data._id)}
        >
          <Text
            style={styles.text_button}
            onPress={() => onThemBanBe(item.user._id)}
          >Thêm bạn bè</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
})

export default ItemListGoiY

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10
  },
  img: {
    width: 61,
    height: 61,
    borderRadius: 50,
  },
  text: {
    fontSize: 16,
    //width: "40%",
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 5
  },
  button1: {
    width: '100%',
    height: 34,
    borderRadius: 10,
    backgroundColor: '#0064E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  text_button: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  text_goi_y: {
    fontSize: 13,
    //width: "40%",
    fontWeight: 'bold',
    color: 'gray',
    marginLeft: 5
  }
})