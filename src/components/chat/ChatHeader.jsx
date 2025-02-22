import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ChatHeader({ name, avatar, onGoBack, isPrivate, onToSettingChat, onCallVideo,onCallAudio }) {

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                {/* Nút quay lại */}
                <TouchableOpacity onPress={onGoBack}>
                    <Icon name="arrow-back" size={25} color="black" />
                </TouchableOpacity>

                {/* Avatar và Thông tin người dùng */}
                <View style={styles.userInfo}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <View>
                        <Text
                            style={styles.userName}
                            numberOfLines={1}
                            ellipsizeMode="tail" // Cách hiển thị dấu 3 chấm (tail: ở cuối)
                        >{name}</Text>
                        {/* <Text style={styles.lastSeen}>Hoạt động {user.lastSeen} trước</Text> */}
                    </View>
                </View>

                {/* Nút gọi & Video Call */}
                <View style={styles.actionIcons}>
                    <TouchableOpacity
                        onPress={onCallAudio}
                    >
                        <FontAwesome name="phone" size={24} color="#007bff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={onCallVideo}
                    >
                        <FontAwesome name="video-camera" size={24} color="#007bff" />
                    </TouchableOpacity>
                    {
                        isPrivate == false
                        && <TouchableOpacity
                            onPress={onToSettingChat}
                        >
                            <Icon name="alert-circle-sharp" size={24} color="#007bff" />
                        </TouchableOpacity>
                    }
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5, // Chỉ có tác dụng trên Android
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userName: {
        width: 100,
        fontSize: 16,
        fontWeight: "bold",
        color: "black",
        marginLeft: 10
    },
    lastSeen: {
        fontSize: 12,
        color: "gray",
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
    },
});