import { Image, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PostS from '../../styles/components/items/PostS';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfilePost = (props) => {
    const { dataProfile } = props
    const [like, setLike] = useState(false)

    return (
        <View style={PostS.container}>
            <View style={PostS.h2}>
                <View style={PostS.header}>
                    <View>
                        <Image style={PostS.avata} source={{ uri: dataProfile.userId.avatar }} />
                    </View>
                    <View>
                        <Text style={PostS.name}>{dataProfile.userId.displayName}</Text>
                        <Text style={PostS.fontDate}>{dataProfile.createdAt}</Text>
                    </View>
                </View>
                <View>
                    <Icon name="ellipsis-horizontal-sharp" size={20} color="black" style={{ marginRight: 15 }} />
                </View>
            </View>
            <View style={PostS.body}>
                <Text style={PostS.title}>{dataProfile.content}</Text>
                <Image style={PostS.image} source={{ uri: dataProfile.images[0] }} />
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

export default ProfilePost
