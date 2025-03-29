import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Lấy kích thước màn hình
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = Math.floor(SCREEN_WIDTH * 0.9) / BOARD_WIDTH; // 90% chiều rộng màn hình

const SHAPES = [
  { shape: [[1, 1, 1, 1]], color: '#00FFFF' }, // I - Cyan
  { shape: [[1, 1], [1, 1]], color: '#FFFF00' }, // O - Yellow
  { shape: [[1, 1, 1], [0, 1, 0]], color: '#800080' }, // T - Purple
  { shape: [[1, 1, 1], [1, 0, 0]], color: '#FFA500' }, // L - Orange
  { shape: [[1, 1, 1], [0, 0, 1]], color: '#0000FF' }, // J - Blue
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#00FF00' }, // S - Green
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#FF0000' }, // Z - Red
];

const TetrisGame = () => {
  const [gameState, setGameState] = useState('start');
  const [board, setBoard] = useState(() => Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null)));
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [score, setScore] = useState(0);

  const spawnPiece = useCallback(() => {
    const pieceIndex = Math.floor(Math.random() * SHAPES.length);
    setCurrentPiece(SHAPES[pieceIndex]);
    setPosition({ x: 4, y: 0 });
  }, []);

  const isValidMove = useCallback((pos, piece) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          if (
            newX < 0 ||
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const movePiece = useCallback((dx, dy) => {
    const newPosition = { x: position.x + dx, y: position.y + dy };
    if (isValidMove(newPosition, currentPiece)) {
      setPosition(newPosition);
    } else if (dy > 0) {
      mergePiece();
      if (position.y <= 0) {
        setGameState('gameover');
      } else {
        spawnPiece();
      }
    }
  }, [position, currentPiece, isValidMove, spawnPiece]);

  const mergePiece = useCallback(() => {
    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[y + position.y][x + position.x] = currentPiece.color;
        }
      });
    });
    setBoard(newBoard);
    clearLines(newBoard);
  }, [board, currentPiece, position]);

  const clearLines = useCallback((currentBoard) => {
    const newBoard = currentBoard.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    if (linesCleared > 0) {
      setBoard([
        ...Array(linesCleared).fill().map(() => Array(BOARD_WIDTH).fill(null)),
        ...newBoard,
      ]);
      setScore(prev => prev + linesCleared * 100);
    }
  }, []);

  const rotatePiece = useCallback(() => {
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map(row => row[index]).reverse()
    );
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };
    if (isValidMove(position, rotatedPiece)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, position, isValidMove]);

  useEffect(() => {
    if (gameState === 'playing' && !currentPiece) {
      spawnPiece();
    }
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      movePiece(0, 1);
    }, 500);
    return () => clearInterval(interval);
  }, [gameState, currentPiece, movePiece, spawnPiece]);

  const renderBoard = useCallback(() => {
    const displayBoard = board.map(row => [...row]);
    if (currentPiece) {
      currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value) {
            displayBoard[y + position.y][x + position.x] = currentPiece.color;
          }
        });
      });
    }

    return displayBoard.map((row, y) => (
      <View key={y} style={styles.row}>
        {row.map((cell, x) => (
          <View
            key={x}
            style={[styles.cell, { backgroundColor: cell || '#fff' }]}
          />
        ))}
      </View>
    ));
  }, [board, currentPiece, position]);

  const startGame = () => {
    setGameState('playing');
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(null)));
    setScore(0);
    spawnPiece();
  };

  if (gameState === 'start') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Tetris</Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (gameState === 'gameover') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over</Text>
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Play Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Score: {score}</Text>
      <View style={styles.board}>{renderBoard()}</View>
      
      {/* 4 Nút điều khiển */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => movePiece(-1, 0)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => movePiece(0, 1)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-down" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={() => movePiece(1, 0)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-right" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={rotatePiece}
          activeOpacity={0.7}
        >
          <Icon name="rotate-right" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingTop: SCREEN_HEIGHT * 0.05, // Khoảng cách trên
    paddingBottom: SCREEN_HEIGHT * 0.05, // Khoảng cách dưới
    width:'100%',
    height: '80%',
  },
  board: {
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: '#fff',
    width: BLOCK_SIZE * BOARD_WIDTH,
    height: BLOCK_SIZE * BOARD_HEIGHT,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: BLOCK_SIZE,
    height: BLOCK_SIZE,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH * 0.9, // 90% chiều rộng màn hình
    marginTop: SCREEN_HEIGHT * 0.05, // Khoảng cách từ bảng
    paddingHorizontal: 10,
  },
  controlButton: {
    backgroundColor: '#333',
    padding: SCREEN_WIDTH * 0.05, // Kích thước nút dựa trên chiều rộng màn hình
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  score: {
    fontSize: SCREEN_WIDTH * 0.06, // Kích thước chữ dựa trên chiều rộng
    marginBottom: SCREEN_HEIGHT * 0.03,
    color: '#333',
  },
  title: {
    fontSize: SCREEN_WIDTH * 0.12, // Kích thước tiêu đề dựa trên chiều rộng
    fontWeight: 'bold',
    marginBottom: SCREEN_HEIGHT * 0.05,
    color: '#333',
  },
  startButton: {
    backgroundColor: '#333',
    padding: SCREEN_WIDTH * 0.05,
    borderRadius: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: SCREEN_WIDTH * 0.06,
    fontWeight: 'bold',
  },
});

export default TetrisGame;