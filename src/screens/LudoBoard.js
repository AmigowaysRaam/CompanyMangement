import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Make sure this is installed
import { wp } from '../resources/dimensions';

const BOARD_SIZE = 15;

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const BOARD_DIMENSION = Math.min(windowWidth, windowHeight) - 50;
const CELL_SIZE = BOARD_DIMENSION / BOARD_SIZE;

const COLORS = {
  red: '#e74c3c', green: '#27ae60', yellow: '#f1c40f', blue: '#2980b9',
  path: '#ecf0f1', safeSpot: '#bdc3c7', homeBase: '#95a5a6', center: '#34495e',
  empty: '#fff',
};
// Token component
function Token({ color, number }) {
  return (
    <View style={[styles.token, { backgroundColor: color }]}>
      {number !== undefined && <Text style={styles.tokenText}>{number}</Text>}
    </View>
  );
}

// Cell component with optional token and safe icon
function Cell({ type, token }) {
  const backgroundColor = COLORS[type] || COLORS.empty;
  return (
    <View style={[styles.cell, { backgroundColor }]}>
      {token && <Token color={token.color} number={token.number} />}
      {type === 'safeSpot' && (
        <MaterialCommunityIcons name="star" size={16} color="red" />
      )}
    </View>
  );
}

// Sample tokens
const tokens = [
  { position: [0, 0], color: COLORS.red, number: 1 },
  { position: [0, 13], color: COLORS.blue, number: 1 },
  { position: [12, 0], color: COLORS.yellow, number: 2 },
  { position: [12, 13], color: COLORS.green, number: 2 },
];

// LudoBoard main component
export default function LudoBoard() {
  const [diceValue, setDiceValue] = useState(null);

  const rollDice = () => {
    const now = new Date().getTime();
    const seed = Math.random() * now;
    const result = Math.floor((seed % 6)) + 1;
    setDiceValue(result);
  };


  const boardLayout = Array.from({ length: BOARD_SIZE }, (_, rowIndex) =>
    Array.from({ length: BOARD_SIZE }, (_, colIndex) => {
      // Simplified layout: put safe spots and other zones here
      if ((rowIndex === colIndex && rowIndex % 5 === 0) || (rowIndex + colIndex === BOARD_SIZE - 1 && colIndex % 5 === 0)) {
        return 'safeSpot';
      } else if (rowIndex < 4 && colIndex < 4) return 'red';
      else if (rowIndex > 10 && colIndex < 4) return 'yellow';
      else if (rowIndex < 4 && colIndex > 10) return 'blue';
      else if (rowIndex > 10 && colIndex > 10) return 'green';
      else if (rowIndex === 7 && colIndex === 7) return 'center';
      else return 'path';
    })
  );

  return (
    <ScrollView contentContainerStyle={styles.boardContainer}>
      <View style={styles.board}>
        {boardLayout.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cellType, cellIndex) => {
              const token = tokens.find(
                (t) => t.position[0] === rowIndex && t.position[1] === cellIndex
              );
              return (
                <Cell key={cellIndex} type={cellType} token={token} />
              );
            })}
          </View>
        ))}
      </View>

      {/* Dice Button */}
      <TouchableOpacity style={styles.diceButton} onPress={rollDice}>
        <Text style={styles.diceText}>🎲</Text>
      </TouchableOpacity>

      {diceValue !== null && (
        <Text style={styles.resultText}>You rolled: {diceValue}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20,
    backgroundColor: '#fff',
  },
  board: {
    width: BOARD_DIMENSION, height: BOARD_DIMENSION, borderWidth: 2,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  }, cell: {
    width: CELL_SIZE, height: CELL_SIZE, borderWidth: 0.5, borderColor: '#999',
    justifyContent: 'center', alignItems: 'center',
  },
  token: {
    width: 20, height: 20, borderRadius: 10, justifyContent: 'center',
    alignItems: 'center', elevation: 3, shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  tokenText: {
    color: '#fff', fontWeight: 'bold', fontSize: 12,
  }, diceButton: {
    marginTop: 30,    // backgroundColor: '#2980b9',
    paddingVertical: 14, paddingHorizontal: 28, borderRadius: 10,
  },
  diceText: {
    color: '#fff', fontSize: wp(20), fontWeight: 'bold',
  },
  resultText: {
    marginTop: 15, fontSize: 22, fontWeight: '600', color: '#2c3e50',
  },
});
