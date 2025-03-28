import React, { useState, useEffect, useCallback, memo } from 'react';
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

const IMG_LUNG = 'https://firebasestorage.googleapis.com/v0/b/hamstore-5c2f9.appspot.com/o/Linkage-game-3la%2Flung.jpg?alt=media&token=b68b92bf-c1f5-4e62-a706-e960460bdc95';

// Component PlayerSection
const PlayerSection = memo(({ isMe, group, playerData, ssState, xetState, cards, imgLung }) => (
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
                {ssState && (
                    <Text style={styles.statusText}>Sẵn sàng</Text>
                )}
                {xetState && (
                    <Text style={[styles.statusText, { color: COLORS.orange }]}>Xét</Text>
                )}
            </View>
            {playerData && (
                <Text style={styles.scoreText}>{playerData.diemtong}</Text>
            )}
        </View>
        <View style={styles.cardContainer}>
            {cards.map((card, index) => (
                <Image key={index} source={{ uri: card }} style={styles.card} />
            ))}
        </View>
    </View>
));

const InGame3La = ({ route, navigation }) => {
    const { group } = route.params;
    const me = useSelector((state) => state.app.user);
    const { socket } = useSocket();

    const [data, setData] = useState(null);
    const [startGame, setStartGame] = useState(false);
    const [xet, setXet] = useState(false);
    const [ss1, setSs1] = useState(false);
    const [ss2, setSs2] = useState(false);
    const [xet1, setXet1] = useState(false);
    const [xet2, setXet2] = useState(false);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [cards1, setCards1] = useState([IMG_LUNG, IMG_LUNG, IMG_LUNG]); // Player 1 cards
    const [cards2, setCards2] = useState([IMG_LUNG, IMG_LUNG, IMG_LUNG]); // Player 2 cards

    // Xử lý socket events
    useEffect(() => {
        if (!group || !me) return;

        socket.emit('joinGroup', group._id);

        socket.on('lang-nghe-bat-dau-game-3la', (data) => {
            console.log('Nhận lang-nghe-bat-dau-game-3la:', data);
            setXet(false);
            setSs1(false);
            setSs2(false);
            setXet1(false);
            setXet2(false);
            setStartGame(true);
            setData(data);

            setCards1([IMG_LUNG, IMG_LUNG, IMG_LUNG]);
            setCards2([IMG_LUNG, IMG_LUNG, IMG_LUNG]);

            if (data.player2._id === me._id) {
                setPlayer2(data.player2);
                setPlayer1(data.player1);
            } else {
                setPlayer2(data.player1);
                setPlayer1(data.player2);
            }
        });

        socket.on('lang-nghe-ss-game-3la', ({ start, readyUser }) => {
            console.log('Nhận lang-nghe-ss-game-3la - start:', start, 'readyUser:', readyUser);
            if (start) {
                socket.emit('bat-dau-game-3-la', { ID_group: group._id });
                return;
            }
            if (readyUser === me._id) {
                setSs2(true);
            } else {
                setSs1(true);
            }
        });

        socket.on('lang-nghe-xet-game-3la', ({ start, readyUser }) => {
            console.log('Nhận lang-nghe-xet-game-3la - start:', start, 'readyUser:', readyUser);
            if (start) {
                setStartGame(false);
                setXet(true);
                setXet1(true);
                setXet2(true);
                setCards1(player1.cards); // Mở bài của player 1
                setCards2(player2.cards); // Mở bài của player 2
                return;
            }
            if (readyUser === me._id) {
                setXet2(true);
            } else {
                setCards1(player1.cards); // Mở bài của player 1 khi đối thủ nhấn "Xét bài"
                setXet1(true);
            }
        });

        return () => {
            socket.off('lang-nghe-bat-dau-game-3la');
            socket.off('lang-nghe-ss-game-3la');
            socket.off('lang-nghe-xet-game-3la');
        };
    }, [group, me, socket, player1, player2]);

    // Xử lý thoát game
    const handleExit = useCallback(() => {
        navigation.navigate('Chat', { ID_group: group._id });
    }, [navigation, group]);

    // Xử lý sẵn sàng
    const handleSS = useCallback(() => {
        socket.emit('ss-game-3la', { ID_group: group._id, ID_user: me._id });
    }, [socket, group, me]);

    // Xử lý xét bài
    const handleXet = useCallback(() => {
        socket.emit('xet-game-3la', { ID_group: group._id, ID_user: me._id });
    }, [socket, group, me]);

    // Mở 1 lá
    const handleMo1 = useCallback(() => {
        if (!startGame) return;
        setCards2((prevCards) => {
            const newCards = [...prevCards];
            const nextIndex = newCards.findIndex((card) => card === IMG_LUNG);
            if (nextIndex !== -1) {
                newCards[nextIndex] = player2.cards[nextIndex];
            }
            return newCards;
        });
    }, [startGame, player2]);

    // Mở hết lá
    const handleMo3 = useCallback(() => {
        if (!startGame) return;
        setCards2(player2.cards);
    }, [startGame, player2]);

    // Kiểm tra xem tất cả lá của player 2 đã mở chưa
    const allCardsOpened = cards2.every((card) => card !== IMG_LUNG);

    return (
        <View style={styles.container}>
            {/* Tiêu đề */}
            <Text style={styles.title}>Game Bài Cao</Text>

            {/* Kết quả */}
            {xet && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultText}>
                        {data.winer === 'Hòa' ? 'Hòa' : data.winer === me._id ? 'Thắng' : 'Thua'}
                    </Text>
                </View>
            )}

            {/* Bài của Player 1 */}
            <PlayerSection
                isMe={group.members[0]._id !== me._id}
                group={group}
                playerData={xet1 ? player1 : null}
                ssState={ss1}
                xetState={xet1}
                cards={cards1}
                imgLung={IMG_LUNG}
            />

            {/* Nút Thoát */}
            <TouchableOpacity style={styles.exitButton} onPress={handleExit} activeOpacity={0.8}>
                <Text style={styles.exitText}>Thoát</Text>
            </TouchableOpacity>

            {/* Bài của Player 2 */}
            <PlayerSection
                isMe={group.members[0]._id === me._id}
                group={group}
                playerData={allCardsOpened ? player2 : null}
                ssState={ss2}
                xetState={xet2}
                cards={cards2}
                imgLung={IMG_LUNG}
            />

            {/* Thanh phân cách */}
            <View style={styles.divider}>
                <View style={styles.dividerLine1} />
                <View style={styles.dividerLine2} />
            </View>

            {/* Nút điều khiển */}
            <View style={styles.buttonContainer}>
                {!startGame ? (
                    <TouchableOpacity style={styles.checkButtonSS} onPress={handleSS} activeOpacity={0.8}>
                        <Text style={styles.buttonText}>Sẵn sàng</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        {allCardsOpened && (
                            <TouchableOpacity style={styles.checkButtonXet} onPress={handleXet} activeOpacity={0.8}>
                                <Text style={styles.buttonText}>Xét bài</Text>
                            </TouchableOpacity>
                        )}
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.checkButtonMo1} onPress={handleMo1} activeOpacity={0.8}>
                                <Text style={styles.buttonTextWhite}>Mở 1 lá</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.checkButtonMo3} onPress={handleMo3} activeOpacity={0.8}>
                                <Text style={styles.buttonTextWhite}>Mở hết</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
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
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray,
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

export default InGame3La;