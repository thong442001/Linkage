import React, { useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';


const SelectAvatarDialog = ({ visible, onClose, onCamera, onGallery }) => {

    const renderReport = useCallback(
        ({ item }) => (
          <ProfilePage
            post={item}
            ID_user={me._id}
            currentTime={currentTime}
            onDelete={() => callChangeDestroyPost(item._id)}
            updatePostReaction={updatePostReaction}
            deletPostReaction={deletPostReaction}
          />
        ),
        [posts, currentTime, me._id]
      );

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Chọn ảnh</Text>
                    <TouchableOpacity style={styles.optionButton} onPress={onCamera}>
                        <Text style={styles.optionText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionButton} onPress={onGallery}>
                        <Text style={styles.optionText}>Chọn từ thư viện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelText}>Hủy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};


const styles = StyleSheet.create({
    modalOverlay: {
        marginLeft: 400,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ec672b',
        borderRadius: 5,
        marginBottom: 10,
        width: '100%',
        alignItems: 'center',
    },
    optionText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        borderColor: '#ec672b',
        borderWidth: 1,
        width: '100%',
        alignItems: 'center',
    },
    cancelText: {
        color: '#ec672b',
        fontSize: 16,
    },
});

export default SelectAvatarDialog;
