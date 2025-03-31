import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {oStackHome} from '../../../navigations/HomeNavigation';

const man_hinh_chao = () => {
  const navigation = useNavigation();
  const backgroundImage = require('../../../../assets/pokemon_game/background.jpg');
  const pokeball = require('../../../../assets/pokemon_game/pokeball.jpg');
  return (
    <ImageBackground source={backgroundImage} style={styles.welcomeContainer}>
      <View style={styles.overlay}>
        <Text style={styles.welcomeTitle}>
          Chào Mừng Đến Với Trò Chơi Ghép Cặp Pokémon!
        </Text>
        <Text style={styles.welcomeText}>
          Hãy ghép các cặp Pokémon giống nhau trong thời gian 60 giây. Điểm +10
          khi ghép đúng, -5 khi sai. Chúc bạn chơi vui!
        </Text>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() =>
            navigation.navigate(oStackHome.pokemon.name)
          }>
          <Text style={styles.startButtonText}>Bắt Đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default man_hinh_chao;

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
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 5,
    marginBottom: 25,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    marginBottom: 40,
  },
  startButton: {
    backgroundColor: '#1e90ff',
    paddingVertical: 15,
    paddingHorizontal: 35,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: {width: 2, height: 2},
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
    textShadowOffset: {width: 1, height: 1},
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
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
