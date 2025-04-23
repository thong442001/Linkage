import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Image,
    Keyboard,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

const API_GEMINI_KEY = 'AIzaSyDI3FtFcFDJ56pt4i7qsufmJdOklo6F1OQ'; // Thay bằng API Key hợp lệ

const Gemini = () => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // 🛠 Gửi tin nhắn văn bản
    const sendMessage = async () => {
        if (!messageText.trim() && !selectedImage) return;

        setLoading(true);
        const newMessages = [];

        if (selectedImage) {
            newMessages.push({
                type: 'image',
                content: `data:image/jpeg;base64,${selectedImage}`,
                user: true,
            });
        }

        if (messageText.trim()) {
            newMessages.push({ type: 'text', content: messageText, user: true });
        }

        setMessages(prev => [...prev, ...newMessages]);
        setSelectedImage(null);
        setMessageText('');

        try {
            const genAI = new GoogleGenerativeAI(API_GEMINI_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

            const conversationHistory = messages.map(msg => ({
                role: msg.user ? 'user' : 'model',
                parts:
                    msg.type === 'image'
                        ? [
                            {
                                inlineData: {
                                    data: msg.content.split(',')[1],
                                    mimeType: 'image/jpeg',
                                },
                            },
                        ]
                        : [{ text: msg.content }],
            }));

            const parts = [];
            if (selectedImage) {
                parts.push({
                    inlineData: {
                        data: selectedImage,
                        mimeType: 'image/jpeg',
                    },
                });
            }
            if (messageText.trim()) {
                parts.push({ text: messageText });
            }
            conversationHistory.push({ role: 'user', parts });

            const generatedContent = await model.generateContent({
                contents: conversationHistory,
            });

            const aiResponse = generatedContent.response.text();

            setMessages(prev => [
                ...prev,
                { type: 'text', content: aiResponse, user: false },
            ]);
            scrollToEnd();
        } catch (error) {
            console.error('Lỗi gửi tin nhắn:', error);
            setMessages(prev => [
                ...prev,
                { type: 'text', content: 'Đã có lỗi xảy ra, vui lòng thử lại.', user: false },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 📸 Chọn ảnh từ thư viện
    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo', includeBase64: true }, response => {
            if (response.assets && response.assets.length > 0) {
                const base64 = response.assets[0].base64;
                setSelectedImage(base64);
            }
        });
    };

    // 🗑 Xóa ảnh xem trước
    const removeSelectedImage = () => {
        setSelectedImage(null);
    };

    // ⬇ Cuộn đến cuối danh sách
    const scrollToEnd = () => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 300);
    };

    // 🎹 Xử lý sự kiện bàn phím
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            event => {
                setKeyboardHeight(event.endCoordinates.height);
                scrollToEnd();
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <IconButton icon="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gemini AI Chat</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 20} // Điều chỉnh offset
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.messageBubble,
                                item.user ? styles.userMessage : styles.aiMessage,
                            ]}
                        >
                            {item.type === 'image' ? (
                                <Image
                                    source={{ uri: item.content }}
                                    style={styles.chatImage}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.messageText,
                                        item.user ? styles.userMessageText : styles.aiMessageText,
                                    ]}
                                >
                                    {item.content}
                                </Text>
                            )}
                        </View>
                    )}
                    contentContainerStyle={[
                        styles.chatContainer,
                        { paddingBottom: keyboardHeight || 20 }, // Thêm padding khi bàn phím mở
                    ]}
                    onContentSizeChange={() => scrollToEnd()}
                />

                <View style={styles.inputContainer}>
                    {selectedImage && (
                        <View style={styles.previewContainer}>
                            <Image
                                source={{ uri: `data:image/jpeg;base64,${selectedImage}` }}
                                style={styles.previewImage}
                                resizeMode="cover"
                            />
                            <TouchableOpacity
                                style={styles.removeImageButton}
                                onPress={removeSelectedImage}
                            >
                                <Icon name="cancel" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.inputWrapper}>
                        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
                            <IconButton icon="image" size={24} color="#0084FF" />
                        </TouchableOpacity>
                        <TextInput
                            placeholder="Nhập tin nhắn..."
                            placeholderTextColor="#888"
                            color="black"
                            onChangeText={setMessageText}
                            value={messageText}
                            onSubmitEditing={sendMessage}
                            style={styles.input}
                            multiline
                            returnKeyType="send"
                        />
                        {(messageText.trim() || selectedImage) && (
                            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                                <IconButton icon="send" size={24} color="#0084FF" />
                            </TouchableOpacity>
                        )}
                        {loading && (
                            <ActivityIndicator
                                size="small"
                                color="#0084FF"
                                style={styles.loadingIndicator}
                            />
                        )}
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Gemini;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF', // Nền trắng giống Messenger
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0084FF', // Màu xanh Messenger
        paddingVertical: 10,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    chatContainer: {
        flexGrow: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#0084FF', // Màu xanh Messenger cho tin nhắn người dùng
        borderBottomRightRadius: 4, // Góc phẳng để tạo hiệu ứng "tail"
    },
    aiMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#E4E6EB', // Màu xám nhạt cho tin nhắn AI
        borderBottomLeftRadius: 4, // Góc phẳng để tạo hiệu ứng "tail"
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    userMessageText: {
        color: 'white', // Văn bản trắng cho tin nhắn người dùng
    },
    aiMessageText: {
        color: 'black', // Văn bản đen cho tin nhắn AI
    },
    chatImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 5,
    },
    inputContainer: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderColor: '#E4E6EB',
    },
    previewContainer: {
        position: 'relative',
        marginBottom: 10,
    },
    previewImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    removeImageButton: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 12,
        padding: 2,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F5', // Nền xám nhạt cho ô nhập
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        fontSize: 16,
        color: 'black',
        maxHeight: 100,
    },
    imageButton: {
        marginRight: 5,
    },
    sendButton: {
        marginLeft: 5,
    },
    loadingIndicator: {
        marginLeft: 10,
    },
});