import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
export default function ChatHeader({
    name,
    avatar,
    onGoBack,
    isPrivate,
    onToSettingChat,
    onCallVideo,
    onCallAudio,
    onToGame3La = () => { },
    isGameing,
}) {

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
                    {/* btn game3la vs setting group */}
                    {
                        isPrivate == false
                            ? (
                                <TouchableOpacity
                                    onPress={onToSettingChat}
                                >
                                    <Icon name="alert-circle-sharp" size={24} color="#007bff" />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    onPress={onToGame3La}
                                    disabled={isGameing}
                                >
                                    <Icon name="game-controller" size={24} color="#007bff" />
                                </TouchableOpacity>
                            )
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
        shadowOffset: { width: 0, height: height * 0.002 }, // Tự động điều chỉnh bóng
        shadowOpacity: 0.2,
        shadowRadius: width * 0.01,
        elevation: 5, // Chỉ có tác dụng trên Android
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: width * 0.04, // 4% chiều rộng màn hình
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
        marginLeft: width * 0.04, // 4% chiều rộng màn hình
    },
    avatar: {
        width: width * 0.11, // 11% chiều rộng màn hình
        height: width * 0.11,
        borderRadius: (width * 0.11) / 2,
    },
    userName: {
        width: width * 0.35, // 30% chiều rộng màn hình
        fontSize: width * 0.045, // 4.5% chiều rộng màn hình
        fontWeight: "bold",
        color: "black",
        marginLeft: width * 0.025, // 2.5% chiều rộng màn hình
    },
    lastSeen: {
        fontSize: width * 0.03, // 3% chiều rộng màn hình
        color: "gray",
    },
    actionIcons: {
        flexDirection: "row",
        alignItems: "center",
        gap: width * 0.04, // 4% chiều rộng màn hình
    },
});