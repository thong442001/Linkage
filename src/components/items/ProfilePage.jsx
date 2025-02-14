import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/EvilIcons'
import Icon3 from 'react-native-vector-icons/MaterialIcons'
import Icon4 from 'react-native-vector-icons/FontAwesome5'
import FBPhotoGrid from '@renzycode/react-native-fb-photo-grid';
const ProfilePage = (props) => {
    const { post } = props
    return (
        <View style={[styles.box, { marginTop: 7 }]}>

            <View style={{ marginVertical: 18 }}>
                <View style={styles.post}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={styles.avata} source={{ uri: post.avata }} />
                        <View style={{ marginLeft: 20 }}>
                            <Text style={styles.name}>{post.name}</Text>
                            <View style={styles.boxName}>
                                <Text style={styles.time}>{post.time}</Text>
                                <Icon name="earth" size={12} color="gray" />
                            </View>
                        </View>
                    </View>
                    <View style={styles.boxIcons}>
                        <View style={{ marginRight: 10 }}>
                            <Icon name="ellipsis-horizontal" size={25} color="black" />
                        </View>
                        <Icon name="close" size={25} color="black" />
                    </View>
                </View>
                <View style={styles.title}>
                    <Text>{post.title}</Text>
                </View>
                {/* <Image style={{ width: '100%', height: 300 }} source={{ uri: post.image }} /> */}
                <FBPhotoGrid
                    height={300}
                    gutterColor="#fff"
                    photos={post.image}
                    gutterSize={1}
                    onTouchPhoto={(photoUri, index) => console.log(photoUri, index)}
                />
            </View>
            <View style={[styles.boxInteract]}>
                <View style={styles.boxIcons2}>
                    <View style={styles.boxIcons3}>
                        <Icon2 name="like" size={25} color="black" />
                    </View>
                    <Text>Thích</Text>
                </View>
                <View style={styles.boxIcons2}>
                    <View style={styles.boxIcons3}>
                        <Icon3 name="comment" size={20} color="black" />
                    </View>
                    <Text>Bình luận</Text>
                </View>
                <View style={styles.boxIcons2}>
                    <View style={styles.boxIcons3}>
                        <Icon4 name="share-alt" size={20} color="black" />
                    </View>
                    <Text>Chia sẻ</Text>
                </View>
            </View>
        </View>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
    box: {
        backgroundColor: "#fff",
    },
    boxIcons: {
        flexDirection: 'row',
    },
    post: {
        marginHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    avata: {
        width: 42,
        height: 42,
        borderRadius: 50,
    },
    boxName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    time: {
        fontSize: 11,
        marginRight: 4,
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    title: {
        marginHorizontal: 20,
        marginVertical: 15,
    },
    boxInteract: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 18
    },
    boxIcons2: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxIcons3: {
        marginRight: 10
    }
})