import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WiFiOffIcon } from '@solar-icons/react-native/bold/wi-fi-off'

export default function BannerOffline({ online }) {
  const insets = useSafeAreaInsets();   // o hook vem ANTES do return condicional

  if (online) return null;

  return (
    <View pointerEvents="none" style={[styles.wrapper, { top: insets.top + 4 }]}>
      <View style={styles.banner}>
        <WiFiOffIcon color="#92400E" size={14} style={{ marginRight: 6 }} />
        <Text style={styles.texto}>Sem conexão · Modo offline</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  banner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  texto: { color: '#92400E', fontSize: 12, fontWeight: '600' },
});