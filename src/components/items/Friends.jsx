import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Friends = (props) => {
    const { friends } = props
    return (
        <View style = {styles.box}>
            <Image style={styles.image} source={{ uri: friends.image }} />
            <Text style = {styles.name}>{friends.name}</Text>
        </View>
    )
}

export default Friends

const styles = StyleSheet.create({
    image: {
        width: 90,
        height: 88,
        margin: '1%',
        borderRadius: 10,
    },
    name:{
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 3,
        textAlign:'center'
    },
    box:{
        margin: 10
    }
})