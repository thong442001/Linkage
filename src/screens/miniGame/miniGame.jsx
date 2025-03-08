import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const socket = io('https://linkage.id.vn'); // Dùng chung server chat

const MiniGameScreen = ({ route }) => {
  const { ID_group } = route.params; // Lấy ID nhóm từ chat
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    socket.emit('joinGroup', ID_group); // Tham gia nhóm

    socket.on('game_update', (newBoard) => {
      setBoard(newBoard.board);
      setIsXTurn(newBoard.isXTurn);
      setWinner(checkWinner(newBoard.board));
    });

    return () => socket.off('game_update');
  }, []);

  const makeMove = (index) => {
    if (board[index] || winner) return;
    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    socket.emit('game_move', { ID_group, board: newBoard, isXTurn: !isXTurn });
  };

  const checkWinner = (b) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (b[a] && b[a] === b[b] && b[a] === b[c]) return b[a];
    }
    return b.includes(null) ? null : 'Hòa';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.turnText}>{winner ? `Kết quả: ${winner}` : `Lượt của: ${isXTurn ? 'X' : 'O'}`}</Text>
      <View style={styles.board}>
        {board.map((cell, i) => (
          <TouchableOpacity key={i} style={styles.cell} onPress={() => makeMove(i)}>
            <Text style={styles.cellText}>{cell}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  turnText: { fontSize: 20, marginBottom: 10 },
  board: { width: 300, height: 300, flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: 100, height: 100, justifyContent: 'center', alignItems: 'center', borderWidth: 1 },
  cellText: { fontSize: 36 },
});

export default MiniGameScreen;
