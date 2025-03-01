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
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import {GoogleGenerativeAI} from '@google/generative-ai';

import {useNavigation} from '@react-navigation/native';
import {IconButton} from 'react-native-paper'; // 👉 Dùng IconButton thay vì Icon

const API_GEMINI_KEY = 'AIzaSyDI3FtFcFDJ56pt4i7qsufmJdOklo6F1OQ'; // Thay bằng API Key hợp lệ

const Gemini = () => {
  const navigation = useNavigation(); // 👉 Hook điều hướng
  const [messagesAI, setMessagesAI] = useState([]);
  const [messagesUser, setMessagesUser] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null); // Quản lý danh sách tin nhắn

  const sendMessage = async () => {
    if (!messagesUser.trim()) return;

    setLoading(true);
    const newUserMessage = {text: messagesUser, user: true};
    setMessagesAI(prev => [...prev, newUserMessage]);
    const currentMessage = messagesUser;
    setMessagesUser('');

    try {
      const genAI = new GoogleGenerativeAI(API_GEMINI_KEY);
      const model = genAI.getGenerativeModel({model: 'gemini-1.5-flash'});

      const history = messagesAI
        .filter(msg => msg.user)
        .map(msg => ({role: 'user', parts: [{text: msg.text}]}));

      history.push({role: 'user', parts: [{text: currentMessage}]});

      const chat = model.startChat({
        history: history,
        generationConfig: {maxOutputTokens: 200},
      });

      const result = await chat.sendMessage(currentMessage);
      const text = result.response.candidates[0].content.parts[0].text;

      setMessagesAI(prev => [...prev, {text, user: false}]);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 300);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🟢 Thanh tiêu đề với nút quay về */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <IconButton icon="arrow-left" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Gemini AI Chat</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={messagesAI}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View
              style={[
                styles.messageBubble,
                item.user ? styles.userMessage : styles.aiMessage,
              ]}>
              <Text style={styles.messageText}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({animated: true})
          }
        />

        {/* 🟢 Hộp nhập tin nhắn */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Nhập tin nhắn..."
            onChangeText={setMessagesUser}
            value={messagesUser}
            onSubmitEditing={sendMessage}
            style={styles.input}
          />
          <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <IconButton
              icon="send"
              size={24}
              color="white"
              onPress={sendMessage}
            />
          </TouchableOpacity>
          {loading && <ActivityIndicator size="small" color="black" />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Gemini;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0084ff',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  chatContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    marginVertical: 5,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#0084ff',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
    borderBottomLeftRadius: 0,
  },
  messageText: {
    color: 'black',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  sendButton: {
    marginLeft: 10,
    // backgroundColor: '#0084ff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width:40,
    height:40
  },
});
