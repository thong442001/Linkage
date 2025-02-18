import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
const Friends = ({ relationship, ID_user }) => {
    console.log("relationship: " + relationship);

    return (
        <View style={styles.box}>
            {
                (relationship.ID_userA._id == ID_user)
                    ? (
                        <Image style={styles.image}
                            source={{ uri: relationship.ID_userB.avatar }}
                        />

                    ) : (
                        <Image style={styles.image}
                            source={{ uri: relationship.ID_userA.avatar }}
                        />

                    )
            }
            {
                (relationship.ID_userA._id == ID_user)
                    ? (

                        <Text
                            style={styles.name}
                            numberOfLines={1} // Số dòng tối đa
                            ellipsizeMode="tail" // Cách hiển thị dấu 3 chấm (tail: ở cuối)
                        >{relationship.ID_userB.first_name + " " + relationship.ID_userB.last_name}
                        </Text>
                    ) : (

                        <Text
                            style={styles.name}
                            numberOfLines={1} // Số dòng tối đa
                            ellipsizeMode="tail" // Cách hiển thị dấu 3 chấm (tail: ở cuối)
                        >{relationship.ID_userA.first_name + " " + relationship.ID_userA.last_name}
                        </Text>
                    )
            }

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
    name: {
        width: 90,
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 3,
        textAlign: 'center'
    },
    box: {
        margin: 10
    }
})