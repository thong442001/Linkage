import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PostS from '../../../../../Linkage_V1/Linkage/src/styles/custom/items/PostS';
import Icon from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../../assets/context/ThemeContext';
import { useContext } from 'react';
import colors from '../../assets/colors';
const Post = (props) => {
    const { dataP } = props
    const [like, setLike] = useState(false)
    const {theme} = useContext(ThemeContext)
    const activeColors = colors[theme.mode]
    return (
        <View style={[PostS.container, { backgroundColor: activeColors.tertiary }]}>
            <View style={PostS.h2}>
                <View style={PostS.header}>
                    <View>
                        <Image style={PostS.avata} source={{ uri: dataP.avata }} />
                    </View>
                    <View>
                        <Text style={PostS.name}>{dataP.name}</Text>
                        <Text style={PostS.fontDate}>{dataP.date}</Text>
                    </View>
                </View>
                <View>
                    <Icon name="ellipsis-horizontal-sharp" size={20} color="black" style={{ marginRight: 15 }} />
                </View>
            </View>
            <View style={PostS.body}>
                <Text style={PostS.title}>{dataP.title}</Text>
                <Image style={PostS.image} source={{ uri: dataP.image }} />
            </View>
            <View style={PostS.interact}>
                <TouchableOpacity onPress={() => { setLike(!like) }}>
                    <Icon name={like != true ? "heart-outline" : "heart"} size={30} color="red" style={{ marginRight: 15 }} />
                </TouchableOpacity>
                <Icon name="chatbox-ellipses-outline" size={30} color="black" style={{ marginRight: 15 }} />
                <Icon name="share-social-outline" size={30} color="black" />
            </View>
        </View >
    )
}

export default Post
