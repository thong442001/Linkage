import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function ChatHeader({ name, avatar, onGoBack, isPrivate, onToSettingChat }) {

    return (
        <View style={styles.headerContainer}>
            {/* Nút quay lại */}
            <TouchableOpacity onPress={onGoBack}>
                <FontAwesome name="long-arrow-left" size={24} color="black" />
            </TouchableOpacity>

            {/* Avatar và Thông tin người dùng */}
            <View style={styles.userInfo}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View>
                    <Text
                        style={styles.userName}
                        numberOfLines={1}
                    >{name}</Text>
                    {/* <Text style={styles.lastSeen}>Hoạt động {user.lastSeen} trước</Text> */}
                </View>
            </View>

            {/* Nút gọi & Video Call */}
            <View style={styles.actionIcons}>
                <TouchableOpacity>
                    <FontAwesome name="phone" size={24} color="purple" />
                </TouchableOpacity>
                <TouchableOpacity>
                    <FontAwesome name="video-camera" size={24} color="purple" style={{ marginLeft: 15 }} />
                </TouchableOpacity>
                {
                    isPrivate == false
                    && <TouchableOpacity
                        onPress={onToSettingChat}
                    >
                        <FontAwesome name="server" size={24} color="purple" style={{ marginLeft: 15 }} />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#f2f2f2",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        width: 180,
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
    },
    lastSeen: {
        fontSize: 12,
        color: "gray",
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
    },
});
