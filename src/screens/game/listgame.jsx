import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Lấy kích thước màn hình
const {width, height} = Dimensions.get('window');

const ListGame = () => {
  const navigation = useNavigation();

  const gameData = [
    {
      id: '1',
      title: 'Vua tiếng việt',
      genre: 'Puzzle',
      description: 'Ai sẽ là vua tiếng việt',
      screen: 'vua_tieng_viet',
      image: require('../../../assets/pokemon_game/VTV.jpg'), // Hình ảnh cục bộ
    },
    {
      id: '2',
      title: 'Ghép hình pokemon',
      genre: 'Puzzle',
      description: 'Ghép các hình pokemon giống nhau',
      screen: 'pokemon',
      image: require('../../../assets/pokemon_game/background.jpg'), // Hình ảnh cục bộ
    },
  ];

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}>
      <LinearGradient
        colors={['#1E90FF', '#4169E1']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gameItemGradient}>
        <View style={styles.textContainer}>
          <Text style={styles.gameTitle}>{item.title}</Text>
          <Text style={styles.gameGenre}>Thể loại: {item.genre}</Text>
        </View>
        <Image
          source={item.image} // Sử dụng trực tiếp vì đã require
          style={styles.gameImage}
          resizeMode="cover" // Đảm bảo hình ảnh hiển thị đẹp
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}>
        <LinearGradient
          colors={['#0064E0', '#004AAD']}
          style={styles.backButtonGradient}>
          <Icon name="arrow-back" size={width * 0.06} color="#fff" />
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.header}>Danh Sách Trò Chơi</Text>
      <FlatList
        data={gameData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: height * 0.12,
  },
  header: {
    fontSize: width * 0.08,
    fontWeight: '800',
    textAlign: 'center',
    padding: height * 0.02,
    color: '#1A2A44',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  listContainer: {
    paddingHorizontal: width * 0.06,
    paddingBottom: height * 0.03,
  },
  gameItem: {
    marginVertical: height * 0.02,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameItemGradient: {
    padding: width * 0.05,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  gameTitle: {
    fontSize: width * 0.055,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  gameGenre: {
    fontSize: width * 0.04,
    color: '#E6F0FF',
    marginTop: height * 0.01,
    fontStyle: 'italic',
  },
  gameImage: {
    width: width * 0.25,
    height: height * 0.08,
    borderRadius: 8,
    marginLeft: width * 0.04,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    borderRadius: 10,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
  },
  backButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: width * 0.02,
  },
});

export default ListGame;
