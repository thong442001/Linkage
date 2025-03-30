import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions
} from 'react-native';
import {oStackHome} from '../../../navigations/HomeNavigation';
import {navigate} from '../../../navigations/NavigationService';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_MARGIN = 5;
const CARD_WIDTH = (SCREEN_WIDTH * 0.9 - CARD_MARGIN * 12) / 6;
const CARD_HEIGHT = CARD_WIDTH;
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
const WelcomeScreen = ({onStart, onBack}) => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={backgroundImage} style={styles.welcomeContainer}>
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>
          Chào Mừng Đến Với Trò Chơi Ghép Cặp Pokémon!
        </Text>
        <Text style={styles.welcomeText}>
          Hãy ghép các cặp Pokémon giống nhau. Điểm +10 khi ghép đúng, -5 khi
          sai. Chúc bạn chơi vui!
        </Text>
        <TouchableOpacity style={styles.startButton} onPress={onStart}>
          <Text style={styles.startButtonText}>Bắt Đầu</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>Quay Về</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Component trò chơi
const GameScreen = ({onBack}) => {
  const initialCards = [
    {id: 1, pairId: 1, image: 'image1', isFlipped: false, isMatched: false},
    {id: 2, pairId: 1, image: 'image1', isFlipped: false, isMatched: false},
    {id: 3, pairId: 2, image: 'image2', isFlipped: false, isMatched: false},
    {id: 4, pairId: 2, image: 'image2', isFlipped: false, isMatched: false},
    {id: 5, pairId: 3, image: 'image3', isFlipped: false, isMatched: false},
    {id: 6, pairId: 3, image: 'image3', isFlipped: false, isMatched: false},
    {id: 7, pairId: 4, image: 'image4', isFlipped: false, isMatched: false},
    {id: 8, pairId: 4, image: 'image4', isFlipped: false, isMatched: false},
    {id: 9, pairId: 5, image: 'image5', isFlipped: false, isMatched: false},
    {id: 10, pairId: 5, image: 'image5', isFlipped: false, isMatched: false},
    {id: 11, pairId: 6, image: 'image6', isFlipped: false, isMatched: false},
    {id: 12, pairId: 6, image: 'image6', isFlipped: false, isMatched: false},
    {id: 13, pairId: 7, image: 'image7', isFlipped: false, isMatched: false},
    {id: 14, pairId: 7, image: 'image7', isFlipped: false, isMatched: false},
    {id: 15, pairId: 8, image: 'image8', isFlipped: false, isMatched: false},
    {id: 16, pairId: 8, image: 'image8', isFlipped: false, isMatched: false},
    {id: 17, pairId: 9, image: 'image9', isFlipped: false, isMatched: false},
    {id: 18, pairId: 9, image: 'image9', isFlipped: false, isMatched: false},
    {id: 19, pairId: 10, image: 'image10', isFlipped: false, isMatched: false},
    {id: 20, pairId: 10, image: 'image10', isFlipped: false, isMatched: false},
    {id: 21, pairId: 11, image: 'image11', isFlipped: false, isMatched: false},
    {id: 22, pairId: 11, image: 'image11', isFlipped: false, isMatched: false},
    {id: 23, pairId: 12, image: 'image12', isFlipped: false, isMatched: false},
    {id: 24, pairId: 12, image: 'image12', isFlipped: false, isMatched: false},
    {id: 25, pairId: 13, image: 'image13', isFlipped: false, isMatched: false},
    {id: 26, pairId: 13, image: 'image13', isFlipped: false, isMatched: false},
    {id: 27, pairId: 14, image: 'image14', isFlipped: false, isMatched: false},
    {id: 28, pairId: 14, image: 'image14', isFlipped: false, isMatched: false},
    {id: 29, pairId: 15, image: 'image15', isFlipped: false, isMatched: false},
    {id: 30, pairId: 15, image: 'image15', isFlipped: false, isMatched: false},
  ];

  const [cards, setCards] = useState(shuffle(initialCards));
  const [flippedCards, setFlippedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [gameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (cards.every(card => card.isMatched)) {
      setIsWin(true);
    }
  }, [cards]);

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
    }
  }, [timeLeft, gameOver]);

  const handleCardClick = card => {
    if (
      card.isFlipped ||
      card.isMatched ||
      flippedCards.length >= 2 ||
      gameOver
    )
      return;

    const updatedCards = cards.map(c =>
      c.id === card.id ? {...c, isFlipped: true} : c,
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
            ? {...c, isMatched: true, isFlipped: false}
            : c,
        ),
      );
      setScore(prev => prev + 10);
    } else {
      setCards(prevCards =>
        prevCards.map(c =>
          c.id === first.id || c.id === second.id
            ? {...c, isFlipped: false}
            : c,
        ),
      );
      setScore(prev => Math.max(0, prev - 5));
    }
    setFlippedCards([]);

    if (cards.every(c => c.isMatched)) {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setCards(shuffle([...initialCards]));
    setFlippedCards([]);
    setScore(0);
    setTimeLeft(300);
    setGameOver(false);
  };

  if (isWin) {
    return (
      <View style={styles.winContainer}>
        <Text style={styles.winText}>
          Chúc mừng! Bạn đã chiến thắng với số điểm là: {score}
        </Text>
        <View style={styles.cangiua}>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setCards(
                initialCards.map(card => ({
                  ...card,
                  isFlipped: false,
                  isMatched: false,
                })),
              );
              setIsWin(false); // Reset trạng thái chiến thắng
              resetGame();
            }}>
            <Text style={styles.restartButtonText}>Chơi lại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.backButton}
            onPress={navigation.goBack}>
            <Text style={styles.backButtonText}>Quay về</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.welcomeContainer}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backButtoningame} onPress={onBack}>
          <Text style={styles.backButtonText}>Quay Về</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Trò Chơi Ghép Cặp</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Điểm: {score}</Text>
          <Text style={styles.infoText}>Thời gian: {timeLeft}s</Text>
        </View>
        <View style={styles.grid}>
          {cards.map(card =>
            card.isMatched ? (
              <View key={card.id} style={styles.cardPlaceholder} />
            ) : (
              <Card key={card.id} card={card} handleClick={handleCardClick} />
            ),
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
const Card = ({card, handleClick}) => {
  return (
    <TouchableOpacity
      style={[styles.card, card.isFlipped ? styles.flippedCard : null]}
      disabled={card.isMatched}
      onPress={() => handleClick(card)}>
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

  const handleBackToWelcome = () => {
    setIsGameStarted(false); // Quay về WelcomeScreen
  };

  return (
    <>
      {isGameStarted ? (
        <GameScreen onBack={handleBackToWelcome} />
      ) : (
        <WelcomeScreen onStart={handleStartGame} onBack={handleBackToWelcome} />
      )}
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
    height: '100%',
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeTitle: {
    fontSize: SCREEN_WIDTH * 0.09,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: SCREEN_WIDTH * 0.05,
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
    paddingVertical: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.1,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  startButtonText: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.08,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 15,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9,
    marginBottom: 15,
  },
  infoText: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: SCREEN_WIDTH * 0.9, // Giới hạn chiều rộng tối đa
    justifyContent: 'center', // Căn giữa các thẻ
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
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: CARD_MARGIN,
    borderWidth: 2,
    borderColor: '#888',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPlaceholder: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: CARD_MARGIN,
    backgroundColor: 'transparent',
  },
  flippedCard: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
  },
  cardText: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH * 0.7,
  },
  cardImage: {
    width: CARD_WIDTH * 0.7,
    height: CARD_WIDTH * 0.7,
  },
  resetButton: {
    marginTop: 20,
    backgroundColor: '#ff4500',
    paddingVertical: SCREEN_HEIGHT * 0.015,
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  resetButtonText: {
    fontSize: SCREEN_WIDTH * 0.05,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  winContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  winText: {
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  restartButton: {
    backgroundColor: 'green',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 10,
    margin: 10,
  },
  restartButtonText: {
    fontSize: SCREEN_WIDTH * 0.045,
    color: 'white',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: 'red',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 10,
    margin: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: SCREEN_WIDTH * 0.045,
    fontWeight: 'bold',
  },
  backButtoningame: {
    backgroundColor: 'red',
    padding: SCREEN_HEIGHT * 0.015,
    borderRadius: 10,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  cangiua: {
    flexDirection: 'row',
  },
});

export default MemoryGameApp;
