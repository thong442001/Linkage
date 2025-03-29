import {
    Text,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Modal,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    StyleSheet,
    Dimensions,
    Animated,
} from 'react-native';
import React, { useState, useCallback, useEffect, useRef, memo } from 'react';

const { width, height } = Dimensions.get('window');

const EditBioModal = memo(({ visible, bio, onSave, onCancel }) => {
    const [tempBio, setTempBio] = useState(bio || '');
    const maxLength = 150; // Giới hạn ký tự cho bio

    // Animated value cho hiệu ứng mở/đóng modal
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setTempBio(bio || '');
    }, [bio, visible]);

    useEffect(() => {
        if (visible) {
            // Hiệu ứng mở modal
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Hiệu ứng đóng modal
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, fadeAnim]);

    const handleSave = useCallback(() => {
        onSave(tempBio.trim());
        Keyboard.dismiss();
    }, [tempBio, onSave]);

    const handleCancel = useCallback(() => {
        onCancel();
        Keyboard.dismiss();
    }, [onCancel]);

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none" // Tắt animation mặc định để dùng Animated
            onRequestClose={handleCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContainer}
            >
                <TouchableWithoutFeedback onPress={handleCancel}>
                    <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]} />
                </TouchableWithoutFeedback>

                <Animated.View style={[styles.dialog, { opacity: fadeAnim }]}>
                    <Text style={styles.title}>Miêu tả</Text>
                    <TextInput
                        value={tempBio}
                        onChangeText={setTempBio}
                        style={styles.textInput}
                        placeholderTextColor="gray"
                        placeholder="Nhập miêu tả..."
                        multiline
                        autoFocus={true}
                        returnKeyType="done"
                        onSubmitEditing={handleSave}
                        maxLength={maxLength}
                    />
                    <Text style={styles.charCount}>
                        {tempBio.length}/{maxLength}
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.btnXacNhan} onPress={handleSave}>
                            <Text style={styles.textButton}>Lưu</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnXoa} onPress={handleCancel}>
                            <Text style={styles.textButton}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
});

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)', // Màu nền mờ cho toàn bộ modal
    },
    modalBackground: {
        ...StyleSheet.absoluteFillObject,
    },
    dialog: {
        borderRadius: width * 0.04,
        width: width * 0.9,
        paddingVertical: height * 0.03,
        paddingHorizontal: width * 0.05,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
    },
    title: {
        fontSize: width * 0.045,
        fontWeight: '600',
        color: '#333',
        marginBottom: height * 0.015,
    },
    textInput: {
        width: '100%',
        height: height * 0.1,
        color: 'black',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: Platform.OS === 'ios' ? 10 : 5, // Đảm bảo padding trên iOS
        textAlignVertical: 'top', // Đảm bảo văn bản bắt đầu từ trên cùng
        fontSize: width * 0.04,
    },
    charCount: {
        alignSelf: 'flex-end',
        fontSize: width * 0.035,
        color: '#666',
        marginTop: 5,
        marginBottom: height * 0.015,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-around',
    },
    btnXacNhan: {
        width: width * 0.4,
        height: height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0064E0',
        borderRadius: width * 0.08,
    },
    btnXoa: {
        width: width * 0.4,
        height: height * 0.06,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#A6A6A6',
        borderRadius: width * 0.08,
    },
    textButton: {
        fontSize: width * 0.04,
        color: 'white',
        fontWeight: '600',
    },
});

export default EditBioModal;