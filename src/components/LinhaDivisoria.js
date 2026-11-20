import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function LinhaDivisoria({ style, marginVertical = 18 }) {
  return <View style={[styles.linha, { marginVertical }, style]} />;
}

const styles = StyleSheet.create({
  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
});
