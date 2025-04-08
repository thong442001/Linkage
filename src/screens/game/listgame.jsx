import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library

// Lấy kích thước màn hình
const { width, height } = Dimensions.get('window');

const ListGame = () => {
  const navigation = useNavigation();

  const gameData = [
    {
      id: '1',
      title: 'Vua tiếng việt',
      genre: 'Puzzle',
      description: 'Ai sẽ là vua tiếng việt',
      screen: 'vua_tieng_viet',
    },
    {
      id: '2',
      title: 'Ghép hình pokemon',
      genre: 'Puzzle',
      description: 'Ghép các hình pokemon giống nhau',
      screen: 'pokemon',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.gameItem}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.8} // Hiệu ứng khi nhấn
    >
      <LinearGradient
        colors={['#ffffff', '#f0f0f0']}
        style={styles.gameItemGradient}
      >
        <Text style={styles.gameTitle}>{item.title}</Text>
        <Text style={styles.gameGenre}>Thể loại: {item.genre}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#4c669f', '#3b5998', '#192f6a']} // Gradient nền
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Icon name="arrow-back" size={width * 0.06} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.header}>Danh Sách Trò Chơi</Text>
      <FlatList
        data={gameData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: height * 0.12, // Đẩy nội dung xuống để tránh che nút "Quay lại"
  },
  header: {
    fontSize: width * 0.07, // Tăng kích thước chữ
    fontWeight: 'bold',
    textAlign: 'center',
    padding: height * 0.02,
    color: '#fff', // Màu trắng để nổi trên gradient
    textShadowColor: 'rgba(0, 0, 0, 0.3)', // Hiệu ứng bóng chữ
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  listContainer: {
    paddingHorizontal: width * 0.05,
    paddingBottom: height * 0.02,
  },
  gameItem: {
    marginVertical: height * 0.015,
    borderRadius: 12,
    overflow: 'hidden', // Đảm bảo gradient không tràn ra ngoài
    elevation: 5, // Tăng hiệu ứng bóng
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  gameItemGradient: {
    padding: width * 0.04,
  },
  gameTitle: {
    fontSize: width * 0.05, // Tăng kích thước chữ
    fontWeight: '700',
    color: '#333',
  },
  gameGenre: {
    fontSize: width * 0.04,
    color: '#666',
    marginTop: height * 0.01,
  },
  backButton: {
    position: 'absolute',
    top: height * 0.05,
    left: width * 0.05,
    backgroundColor: 'rgba(0, 123, 255, 0.9)', // Màu xanh trong suốt nhẹ
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    flexDirection: 'row', // Để icon và text nằm ngang
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  backButtonText: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginLeft: width * 0.02, // Khoảng cách giữa icon và text
  },
});

export default ListGame;