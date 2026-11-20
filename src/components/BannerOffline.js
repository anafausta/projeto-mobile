import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WiFiOffIcon } from '@solar-icons/react-native/bold/wi-fi-off'

export default function BannerOffline({ online }) {
  if (online) return null;

  return (
    <View style={styles.banner}>
      <WiFiOffIcon color="#92400E" size={14} style={{ marginRight: 6 }} />
      <Text style={styles.texto}>
        Modo offline
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  texto: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '600',
  },
});
