import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import PostDetailS from '../../styles/screens/home/PostDetailS'
import Icon from 'react-native-vector-icons/Ionicons'
import ItemPostDetail from '../../components/items/ItemPostDetail'
import { Item } from 'react-native-paper/lib/typescript/components/List/List'
import { useRoute } from '@react-navigation/native'
const PostDetail = (props) => {
  const route = useRoute();
  const post = route.params?.post || {}; // Lấy post từ navigation
  const data = [
    {
      id: 1,
      name: 'Kenny',
      image: ['https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/04/anh-bien-4.jpg'],
      avata: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Andrzej_Person_Kancelaria_Senatu.jpg/1200px-Andrzej_Person_Kancelaria_Senatu.jpg',
      time: '1 giờ trước',
      title: 'Hôm nay trời đẹp quá',
    },
  ]
  return (
    // dùng tam flatlist để hiển thị chi tiết bài viết
    <View style={PostDetailS.container}>
      <FlatList
        data={[post]}
        renderItem={({ item }) => <ItemPostDetail post={item} />}
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default PostDetail

const styles = StyleSheet.create({})