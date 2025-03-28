import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, Image, ImageBackground } from 'react-native';

const images = {
  image1: require('../../../../assets/pokemon_game/0001.jpg'),
  image2: require('../../../../assets/pokemon_game/0004.jpg'),
  image3: require('../../../../assets/pokemon_game/0007.jpg'),
  image4: require('../../../../assets/pokemon_game/0025.jpg'),
  image5: require('../../../../assets/pokemon_game/0108.jpg'),
  image6: require('../../../../assets/pokemon_game/0123.jpg'),
  image7: require('../../../../assets/pokemon_game/0130.jpg'),
  image8: require('../../../../assets/pokemon_game/0131.jpg'),
  image9: require('../../../../assets/pokemon_game/0144.jpg'),
  image10: require('../../../../assets/pokemon_game/0145.jpg'),
  image11: require('../../../../assets/pokemon_game/0148.jpg'),
  image12: require('../../../../assets/pokemon_game/0149.jpg'),
  image13: require('../../../../assets/pokemon_game/0150.jpg'),
  image14: require('../../../../assets/pokemon_game/0151.jpg'),
  image15: require('../../../../assets/pokemon_game/0146.jpg'),
};
const backgroundImage = require('../../../../assets/pokemon_game/background.jpg');
const pokeball = require('../../../../assets/pokemon_game/pokeball.jpg');

// Component màn hình chờ
const WelcomeScreen = ({ onStart }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.welcomeContainer}>
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>Chào Mừng Đến Với Trò Chơi Ghép Cặp Pokémon!</Text>
        <Text style={styles.welcomeText}>
          Hãy ghép các cặp Pokémon giống nhau trong thời gian 60 giây. 
          Điểm +10 khi ghép đúng, -5 khi sai. Chúc bạn chơi vui!
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Bắt Đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Component trò chơi
const GameScreen = () => {
  const initialCards = [
    { id: 1, pairId: 1, image: 'image1', isFlipped: false, isMatched: false },
    { id: 2, pairId: 1, image: 'image1', isFlipped: false, isMatched: false },
    { id: 3, pairId: 2, image: 'image2', isFlipped: false, isMatched: false },
    { id: 4, pairId: 2, image: 'image2', isFlipped: false, isMatched: false },
    { id: 5, pairId: 3, image: 'image3', isFlipped: false, isMatched: false },
    { id: 6, pairId: 3, image: 'image3', isFlipped: false, isMatched: false },
    { id: 7, pairId: 4, image: 'image4', isFlipped: false, isMatched: false },
    { id: 8, pairId: 4, image: 'image4', isFlipped: false, isMatched: false },
    { id: 9, pairId: 5, image: 'image5', isFlipped: false, isMatched: false },
    { id: 10, pairId: 5, image: 'image5', isFlipped: false, isMatched: false },
    { id: 11, pairId: 6, image: 'image6', isFlipped: false, isMatched: false },
    { id: 12, pairId: 6, image: 'image6', isFlipped: false, isMatched: false },
    { id: 13, pairId: 7, image: 'image7', isFlipped: false, isMatched: false },
    { id: 14, pairId: 7, image: 'image7', isFlipped: false, isMatched: false },
    { id: 15, pairId: 8, image: 'image8', isFlipped: false, isMatched: false },
    { id: 16, pairId: 8, image: 'image8', isFlipped: false, isMatched: false },
    { id: 17, pairId: 9, image: 'image9', isFlipped: false, isMatched: false },
    { id: 18, pairId: 9, image: 'image9', isFlipped: false, isMatched: false },
    { id: 19, pairId: 10, image: 'image10', isFlipped: false, isMatched: false },
    { id: 20, pairId: 10, image: 'image10', isFlipped: false, isMatched: false },
    { id: 21, pairId: 11, image: 'image11', isFlipped: false, isMatched: false },
    { id: 22, pairId: 11, image: 'image11', isFlipped: false, isMatched: false },
    { id: 23, pairId: 12, image: 'image12', isFlipped: false, isMatched: false },
    { id: 24, pairId: 12, image: 'image12', isFlipped: false, isMatched: false },
    { id: 25, pairId: 13, image: 'image13', isFlipped: false, isMatched: false },
    { id: 26, pairId: 13, image: 'image13', isFlipped: false, isMatched: false },
    { id: 27, pairId: 14, image: 'image14', isFlipped: false, isMatched: false },
    { id: 28, pairId: 14, image: 'image14', isFlipped: false, isMatched: false },
    { id: 29, pairId: 15, image: 'image15', isFlipped: false, isMatched: false },
    { id: 30, pairId: 15, image: 'image15', isFlipped: false, isMatched: false },
  ];

  const [cards, setCards] = useState(shuffle(initialCards));
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameOver, setGameOver] = useState(false);

  function shuffle(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      Alert.alert("Hết giờ!", `Điểm của bạn: ${score}`);
    }
  }, [timeLeft, gameOver]);

  const handleCardClick = (card) => {
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2 || gameOver) return;

    const updatedCards = cards.map(c =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    setCards(updatedCards);
    setFlippedCards(prev => [...prev, card]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 1000);
    }
  }, [flippedCards]);

  const checkMatch = () => {
    const [first, second] = flippedCards;

    if (first.pairId === second.pairId) {
      setCards(prevCards =>
        prevCards.map(c =>
          c.id === first.id || c.id === second.id
            ? { ...c, isMatched: true, isFlipped: false }
            : c
        )
      );
      setScore(prev => prev + 10);
    } else {
      setCards(prevCards =>
        prevCards.map(c =>
          c.id === first.id || c.id === second.id ? { ...c, isFlipped: false } : c
        )
      );
      setScore(prev => Math.max(0, prev - 5));
    }
    setFlippedCards([]);

    if (cards.every(c => c.isMatched)) {
      setGameOver(true);
      Alert.alert("Chúc mừng!", `Bạn đã thắng! Điểm: ${score + 10}`);
    }
  };

  const resetGame = () => {
    setCards(shuffle([...initialCards]));
    setFlippedCards([]);
    setScore(0);
    setTimeLeft(300);
    setGameOver(false);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.welcomeContainer}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Trò Chơi Ghép Cặp</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Điểm: {score}</Text>
          <Text style={styles.infoText}>Thời gian: {timeLeft}s</Text>
        </View>
        <View style={styles.grid}>
          {cards.map(card =>
            card.isMatched ? (
              <View key={card.id} style={styles.cardPlaceholder} /> // Ô trống giữ vị trí
            ) : (
              <Card key={card.id} card={card} handleClick={handleCardClick} />
            )
          )}
        </View>
        {gameOver && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
            <Text style={styles.resetButtonText}>Chơi lại</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

// Component Card
const Card = ({ card, handleClick }) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        card.isFlipped ? styles.flippedCard : null,
      ]}
      disabled={card.isMatched}
      onPress={() => handleClick(card)}
    >
      {card.isFlipped ? (
        <Image source={images[card.image]} style={styles.cardImage} />
      ) : (
        <Image style={styles.cardText} source={pokeball}></Image>
      )}
    </TouchableOpacity>
  );
};

// Component chính kết hợp màn hình chờ và game
const MemoryGameApp = () => {
  const [isGameStarted, setIsGameStarted] = useState(false);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <>
      {isGameStarted ? <GameScreen /> : <WelcomeScreen onStart={handleStartGame} />}
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
 top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 25,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 400,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  grid: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: 450,
    height: 500,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  cardPlaceholder: { // Style cho ô trống
    width: 70,
    height: 70,
    margin: 5,
    backgroundColor: 'transparent', // Hoàn toàn trong suốt để hiển thị nền
  },
  flippedCard: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  cardText: {
    width: 50,
    height: 50,
  },
  cardImage: {
    width: 50,
    height: 50,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ff4500',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  resetButtonText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});

export default MemoryGameApp;