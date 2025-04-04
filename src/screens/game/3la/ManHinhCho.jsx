import React, { useEffect, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { useSocket } from '../../../context/socketContext';
import { useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

// Constants cho màu sắc và kích thước
const COLORS = {
  background: '#f5f5f5',
  primary: '#ff6f61',
  secondary: '#4a90e2',
  success: '#28a745',
  warning: '#ffca28',
  danger: '#ff4d4f',
  white: '#fff',
  black: '#333',
  gray: '#ddd',
  orange: '#ff9800',
  blue: '#2196f3',
  red: '#f44336',
};

const SIZES = {
  avatar: width * 0.12,
  cardWidth: width * 0.22,
  cardHeight: height * 0.135,
  padding: width * 0.04,
  margin: height * 0.025,
  borderRadius: 15,
  buttonHeight: height * 0.15,
};

// Component PlayerSection
const PlayerSection = memo(({ isMe, group, player1 }) => (
  <View style={styles.playerSection}>
    <View style={styles.userInfo}>
      <Image
        source={{ uri: isMe ? group.members[0].avatar : group.members[1].avatar }}
        style={styles.avatar}
      />
      <View style={styles.userInfoText}>
        <Text style={styles.name}>
          {isMe
            ? `${group?.members[0]?.first_name} ${group?.members[0]?.last_name}`
            : `${group.members[1].first_name} ${group.members[1].last_name}`}
        </Text>
        {player1 && (
          <Text style={styles.statusText}>Đang chờ phản hồi</Text>
        )}
      </View>
    </View>
    <View style={styles.cardContainer}>
      {/* {cards.map((card, index) => (
        <Image key={index} source={{ uri: card }} style={styles.card} />
      ))} */}
      <View
        style={styles.card}
      >
      </View>

    </View>
  </View>
));

const ManHinhCho = ({ route, navigation }) => {
  const { group, ID_message } = route.params;
  const me = useSelector((state) => state.app.user);
  const { socket } = useSocket();

  useEffect(() => {
    if (!group || !me) return;

    socket.emit("joinGroup", group._id);

    socket.on("lang-nghe-chap-nhan-choi-game-3-la", () => {
      console.log(`Bạn đã được chấp nhận chơi game 3 lá`);
      handleAccept();
    });

    socket.on("lang-nghe-tu-choi-choi-game-3-la", () => {
      console.log(`Bạn đã bị từ chối chơi game 3 lá`);
      handleCancel();
    });

    return () => {
      socket.off("lang-nghe-chap-nhan-choi-game-3-la");
      socket.off("lang-nghe-tu-choi-choi-game-3-la");
      handleCancel1();
    };

  }, [group, me]);


  // Xử lý khi chấp nhận cuộc gọi
  const handleAccept = () => {
    navigation.navigate('InGame3La', { group: group });
  };

  // Xử lý khi chấp nhận cuộc gọi
  const handleCancel = () => {
    navigation.goBack();
  };

  const handleCancel1 = () => {
    const payload = {
      ID_message: ID_message,
      ID_group: group?._id,
    };
    socket.emit('tu-choi-choi-game-3-la', payload);
  };


  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <Text style={styles.title}>Game Bài Cào</Text>

      {/* Bài của Player 1 */}
      <PlayerSection
        isMe={group.members[0]._id !== me._id}
        group={group}
        player1={true}
      />

      {/* Nút Thoát */}
      <TouchableOpacity style={styles.exitButton} onPress={handleCancel1} activeOpacity={0.8}>
        <Text style={styles.exitText}>Thoát</Text>
      </TouchableOpacity>

      {/* Bài của Player 2 */}
      <PlayerSection
        isMe={group.members[0]._id === me._id}
        group={group}
        player1={false}
      />

      {/* Thanh phân cách */}
      <View style={styles.divider}>
        <View style={styles.dividerLine1} />
        <View style={styles.dividerLine2} />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: height * 0.05,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: height * 0.01,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  resultContainer: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.black,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  playerSection: {
    width: '100%',
    marginBottom: SIZES.margin,
    backgroundColor: COLORS.white,
    borderRadius: SIZES.borderRadius,
    padding: SIZES.padding,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: height * 0.02,
    width: '100%',
  },
  avatar: {
    width: SIZES.avatar,
    height: SIZES.avatar,
    borderRadius: SIZES.avatar / 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  userInfoText: {
    marginLeft: SIZES.padding,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.black,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.warning,
    fontWeight: '500',
  },
  scoreText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    top: 0,
    right: 0,
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.padding,
  },
  card: {
    width: SIZES.cardWidth,
    height: SIZES.cardHeight,
    resizeMode: 'contain',
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: COLORS.gray,
  },
  exitButton: {
    position: 'absolute',
    top: height * 0.06,
    right: SIZES.padding,
    backgroundColor: COLORS.danger,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  exitText: {
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    width: '80%',
    height: 6,
    marginVertical: height * 0.015,
    borderRadius: 3,
    overflow: 'hidden',
  },
  dividerLine1: {
    flex: 1,
    backgroundColor: COLORS.secondary,
  },
  dividerLine2: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  checkButtonSS: {
    backgroundColor: COLORS.warning,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  checkButtonXet: {
    backgroundColor: COLORS.orange,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  checkButtonMo1: {
    backgroundColor: COLORS.blue,
    height: SIZES.buttonHeight,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonMo3: {
    backgroundColor: COLORS.red,
    height: SIZES.buttonHeight,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.black,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextWhite: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ManHinhCho;
