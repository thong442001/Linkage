import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import words from './words.json';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

export default function GameScreen() {
  const navigation = useNavigation();
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [isInputEditable, setIsInputEditable] = useState(true);
  const [keyboardOffset] = useState(new Animated.Value(0));

  // Lắng nghe sự kiện bàn phím
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardOffset, {
          toValue: -e.endCoordinates.height / 3.5,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        Animated.timing(keyboardOffset, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const scrambleWord = (word) => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    return letters.join(' / ');
  };

  const getNewWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const newWord = words[randomIndex];
    setCurrentWord(newWord);
    setScrambledWord(scrambleWord(newWord));
    setUserInput('');
    setMessage(null);
    setIsInputEditable(true);
  };

  const checkAnswer = () => {
    if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
      setScore(score + 1);
      setMessage({
        text: `Chính xác! Bạn được +1 điểm. Điểm hiện tại: ${score + 1}`,
        type: 'success',
      });
      animateMessage();
      setIsInputEditable(false);
      setTimeout(getNewWord, 4000);
    } else {
      setMessage({
        text: `Sai rồi! Đáp án đúng là: ${currentWord}`,
        type: 'error',
      });
      animateMessage();
      setIsInputEditable(false);
      setTimeout(getNewWord, 4000);
    }
  };

  const animateMessage = () => {
    fadeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    getNewWord();
  }, []);

  return (
    <View style={styles.container}>
      {/* Gradient Background */}
      <View style={styles.gradientOverlay} />

      {/* Header with Back Button and Title */}
      <View
        style={styles.headerContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={width * 0.06} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Vua Tiếng Việt</Text>
      </View>

      {/* Score */}
      <Animated.View
        style={[styles.scoreContainer, { transform: [{ translateY: keyboardOffset }] }]}
      >
        <Text style={styles.score}>Điểm: {score}</Text>
      </Animated.View>

      {/* Scrambled Word Card */}
      <Animated.View
        style={[styles.wordCard, { transform: [{ translateY: keyboardOffset }] }]}
      >
        <Text style={styles.scrambledWord}>Từ trộn: {scrambledWord}</Text>
      </Animated.View>

      {/* Input */}
      <Animated.View
        style={[styles.inputContainer, { transform: [{ translateY: keyboardOffset }] }]}
      >
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Nhập đáp án của bạn"
          placeholderTextColor="#888"
          autoCapitalize="none"
          editable={isInputEditable}
        />
      </Animated.View>

      {/* Button */}
      <Animated.View
        style={[styles.buttonContainer, { transform: [{ translateY: keyboardOffset }] }]}
      >
        <TouchableOpacity style={styles.button} onPress={checkAnswer}>
          <Text style={styles.buttonText}>Kiểm tra</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Message with Animation */}
      {message && (
        <Animated.View
          style={[
            styles.messageContainer,
            message.type === 'success' ? styles.successMessage : styles.errorMessage,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.messageText}>{message.text}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContainer: {
    flexDirection: 'row', // Đặt bố cục ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    position: 'absolute',
    top: height * 0.05,
    width: '100%',
    paddingHorizontal: width * 0.05,
    zIndex: 1,
  },
  backButton: {
    backgroundColor: '#0064E0',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: width * 0.08, // Giảm nhẹ để vừa với hàng
    fontWeight: '800',
    color: '#1e3a8a',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1, // Chiếm không gian còn lại để căn giữa
  },
  scoreContainer: {
    position: 'absolute',
    top: height * 0.25,
    width: '100%',
    alignItems: 'center',
  },
  score: {
    fontSize: width * 0.06,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '600',
  },
  wordCard: {
    position: 'absolute',
    top: height * 0.35,
    width: width * 0.9,
    backgroundColor: '#fff',
    padding: width * 0.05,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    alignSelf: 'center',
  },
  scrambledWord: {
    fontSize: width * 0.07,
    color: '#1f2937',
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    position: 'absolute',
    top: height * 0.55,
    width: width * 0.85,
    alignSelf: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: width * 0.04,
    borderRadius: 12,
    fontSize: width * 0.045,
    backgroundColor: '#fff',
    elevation: 2,
  },
  buttonContainer: {
    position: 'absolute',
    top: height * 0.65,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#0064E0',
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.15,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.05,
    fontWeight: '700',
  },
  messageContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    width: width * 0.85,
    padding: width * 0.04,
    borderRadius: 15,
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 10,
    zIndex: 2,
  },
  successMessage: {
    backgroundColor: '#22c55e',
  },
  errorMessage: {
    backgroundColor: '#ef4444',
  },
  messageText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    textAlign: 'center',
  },
});