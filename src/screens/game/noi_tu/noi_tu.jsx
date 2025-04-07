import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import words from './words.json'; // Danh sách từ
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window'); // Lấy kích thước màn hình

export default function GameScreen() {
  const navigation = useNavigation();
  const [currentWord, setCurrentWord] = useState(''); // Từ gốc
  const [scrambledWord, setScrambledWord] = useState(''); // Từ trộn
  const [userInput, setUserInput] = useState(''); // Đáp án người dùng
  const [score, setScore] = useState(0); // Điểm số
  const [message, setMessage] = useState(null); // Thông báo tùy chỉnh

  // Hàm trộn chữ cái
  const scrambleWord = word => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]]; // Swap
    }
    return letters.join(' / ');
  };

  // Chọn từ mới
  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setUserInput('');
    setMessage(null); // Ẩn thông báo khi lấy từ mới
  };

  // Kiểm tra đáp án
  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setMessage({
        text: `Chính xác! Bạn được +1 điểm. Điểm hiện tại: ${score + 1}`,
        type: 'success',
      });
      setTimeout(getNewWord, 2000); // Tự động lấy từ mới sau 2 giây
    } else {
      setMessage({
        text: `Sai rồi! Đáp án đúng là: ${currentWord}`,
        type: 'error',
      });
      setTimeout(getNewWord, 2000); // Tự động lấy từ mới sau 2 giây
    }
  };

  // Khởi tạo từ đầu tiên khi component được render
  useEffect(() => {
    getNewWord();
  }, []);

  return (
    <View style={styles.container}>
      {/* Header với nút Back và thông báo */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="angle-left"
            size={width * 0.08}
            color="black"
            style={styles.iconBack}
          />
        </TouchableOpacity>
        {message && (
          <View
            style={[
              styles.messageContainer,
              message.type === 'success'
                ? styles.successMessage
                : styles.errorMessage,
            ]}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        )}
      </View>

      {/* Nội dung chính */}
      <Text style={styles.title}>Vua Tiếng Việt</Text>
      <Text style={styles.score}>Điểm: {score}</Text>
      <Text style={styles.scrambledWord}>Từ trộn: {scrambledWord}</Text>
      <TextInput
        style={styles.input}
        value={userInput}
        onChangeText={setUserInput}
        placeholder="Nhập đáp án của bạn"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={checkAnswer}>
        <Text style={styles.buttonText}>Kiểm tra</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.05,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    flexDirection: 'row', // Xếp nút Back và thông báo ngang nhau
    alignItems: 'center',
    justifyContent: 'space-between', // Đẩy nút Back sang trái, thông báo sang phải
    width: '100%',
    marginBottom: height * 0.03,
  },
  iconBack: {
    padding: width * 0.02,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: 'bold',
    marginBottom: height * 0.03,
  },
  score: {
    fontSize: width * 0.06,
    marginBottom: height * 0.03,
  },
  scrambledWord: {
    fontSize: width * 0.07,
    marginBottom: height * 0.03,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: width * 0.03,
    width: width * 0.8,
    borderRadius: 5,
    marginBottom: height * 0.03,
    fontSize: width * 0.045,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.1,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1, // Để thông báo chiếm không gian còn lại trong header
    padding: width * 0.03,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  successMessage: {
    backgroundColor: '#28a745', // Màu xanh cho thành công
  },
  errorMessage: {
    backgroundColor: '#dc3545', // Màu đỏ cho thất bại
  },
  messageText: {
    color: '#fff',
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
  },
});