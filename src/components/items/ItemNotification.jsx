import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

const ItemNotification = props => {
  const {data} = props;
  return (
    <View style={styles.container}>
      <Image source={{uri: data.img}} style={styles.img} />
      <View style={styles.container_content}>
        <View style={styles.container_name}>
          <Text style={styles.text_name}>{data.name}</Text>
          <Text style={styles.text_content}>{data.content}</Text>
        </View>
        <Text>{data.time}</Text>
      </View>
    </View>
  );
};

export default ItemNotification;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 13,
  },
  img: {
    width: 68,
    height: 68,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  container_name: {
    flexDirection: 'row',
  },
  text_content: {
    marginLeft: 2,
    fontSize: 16,
    fontWeight: 'medium',
    color: 'black',
  },
  text_name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  container_content: {
    marginLeft: 13,
  },
});
