import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
const { width, height } = Dimensions.get('window');

const ProfileLoading = () => {
    return ( 
        <SkeletonPlaceholder >
            {/* Skeleton cho ảnh bìa */}

            <View style={styles.container}>
            <View style={styles.coverImage} />

            {/* Skeleton cho ảnh đại diện */}
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
            </View>

            {/* Skeleton cho thông tin bạn bè */}
            <View style={styles.friendItem}>
                <View style={styles.textName} />
                <View style={styles.textFriend} />
            </View>

            {/* Skeleton cho 3 nút */}
            <View style={styles.buttonContainer}>
                {/* Nút "Thêm vào tin" */}
                <View style={styles.addStories} />
                {/* Hai nút dưới: "Chỉnh sửa trang cá nhân" và nút ba chấm */}
                <View style={styles.rowButtons}>
                    <View style={styles.btnEdit} />
                    <View style={styles.btnMore} />
                </View>
            </View>


            </View>
        </SkeletonPlaceholder>
    );
};

export default ProfileLoading;

const styles = StyleSheet.create({
    container:{

    },
    coverImage: {
        width: '100%',
        height: 200,
    },
    avatarContainer: {
        height: height * 0.22,
        alignItems: 'center',
        marginRight: 230,
        marginTop: -50,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    friendItem: {
        bottom: 55,
        marginHorizontal: 35,
    },
    textName: {
        width: 150,
        height: 25,
        borderRadius: 5,
    },
    textFriend: {
        marginVertical: 5,
        width: 100,
        height: 20,
        borderRadius: 5,
    },
    buttonContainer: {
        bottom: 20,
        alignItems: 'center',
    },
    addStories: {
        width: width * 0.9,
        height: height * 0.06,
        borderRadius: 10,
        marginBottom: 10,
    },
    rowButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.9,
    },
    btnEdit: {
        width: width * 0.67, 
        height: height * 0.06,
        borderRadius: 10,
    },
    btnMore: {
        width: width * 0.20, 
        height: height * 0.06,
        borderRadius: 10,
    },
});
