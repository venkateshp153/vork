import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const AppButton = ({ text, onPress, buttonStyle, textStyle }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, buttonStyle]}
    >
      <Text style={[styles.text, textStyle]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  text: {
    color: 'white', 
    fontSize: 16,
  },
});

export default AppButton;