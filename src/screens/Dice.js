import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DiceRoller() {
  const [diceValue, setDiceValue] = useState(null);

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1; // Random number between 1-6
    setDiceValue(result);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.diceButton} onPress={rollDice}>
        <Text style={styles.diceText}>🎲 Roll Dice</Text>
      </TouchableOpacity>

      {diceValue !== null && (
        <Text style={styles.resultText}>You rolled: {diceValue}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 40,
  },
  diceButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 10,
    elevation: 2,
  },
  diceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultText: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
});
