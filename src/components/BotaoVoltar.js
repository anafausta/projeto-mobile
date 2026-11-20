import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DoubleAltArrowLeftIcon } from '@solar-icons/react-native/outline/double-alt-arrow-left'
import { fontesDestaque } from '../theme/identidadeVisual';

export default function BotaoVoltar({
  onPress,
  texto = 'Voltar',
  style,
  tamanho = 22,
  cor = '#5700B8',
}) {
  return (
    <TouchableOpacity
      style={[styles.botao, style]}
      onPress={onPress}
      activeOpacity={0.7}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <DoubleAltArrowLeftIcon color={cor} size={tamanho} />
      {texto ? <Text style={[styles.texto, { color: cor }]}>{texto}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingRight: 8,
    marginBottom: 16,
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.semiBold,
    marginLeft: 6,
  },
});
