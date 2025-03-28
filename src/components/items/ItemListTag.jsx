import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ItemListTag = (props) => {
    const {data} = props;
  return (
    <View style={styles.container}>
        <Image style={styles.avatar} source={{uri: data.avatar}}/> 
        <Text style={styles.text}>{data.first_name} {data.last_name}</Text>
    </View>
  )
}

export default ItemListTag

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        paddingHorizontal: 20,
        borderBottomWidth:0.7,
        borderBottomColor:'#ECEAEA',
        paddingVertical: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginRight: 10,
    },
    text: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'black',
    }
})