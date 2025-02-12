import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const Stories = ({stories , isSelected }) => {
  console.log("Props received in Stories:", stories); // Kiểm tra props nhận được
  if (!stories) return null; // Kiểm tra nếu stories không tồn tại
 
  return (
    <View style={styles.boxStory}>
      <Image style={styles.imageStories} source={  stories.image } />
      <Image style={[styles.avataStories, isSelected && styles.selectedBorder]} source={ stories.avatar } />
      <View style={styles.backGround}></View>
      <Text style={styles.name}>{stories.name}</Text>
    </View>
  );
};
export default Stories

const styles = StyleSheet.create({
  boxStory:{
    marginLeft: 10,
  },
  imageStories: {
    width: 123,
    height: 192,
    borderRadius: 10,
  },
  avataStories: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1190FF',
    position: 'absolute',
    left: 8,
    top: 7
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFFFFF',
    position: 'absolute',
    bottom: 9,
    left: 8
  },
  backGround: {
    width: 123,
    height: 50,
    backgroundColor: 'rgba(0,0,0,0.2)',
    position: 'absolute',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    bottom: 0,
  },
  selectedBorder: {
    borderColor: "gray", // Viền xám khi được chọn
  },
})