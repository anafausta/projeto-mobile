import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { fontesDestaque } from '../theme/identidadeVisual';

export default function BotaoPrincipal({
  texto,
  onPress,
  icone: Icone,
  carregando = false,
  desabilitado = false,
  tamanho = 'normal',
  style,
  textoStyle,
  children,
}) {
  const isPequeno = tamanho === 'pequeno';

  return (
    <TouchableOpacity
      style={[
        styles.botao,
        isPequeno && styles.botaoPequeno,
        desabilitado && styles.botaoDesabilitado,
        style,
      ]}
      onPress={onPress}
      disabled={desabilitado || carregando}
      activeOpacity={0.8}
    >
      {carregando ? (
        <ActivityIndicator color="#FFF" size="small" />
      ) : (
        <>
          {Icone && (
            <Icone
              color="#FFF"
              size={isPequeno ? 16 : 20}
              style={{ marginRight: 8 }}
            />
          )}
          <Text
            style={[
              styles.texto,
              isPequeno && styles.textoPequeno,
              textoStyle,
            ]}
          >
            {texto || children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    backgroundColor: '#5700B8',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5700B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  botaoPequeno: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  botaoDesabilitado: {
    opacity: 0.6,
  },
  texto: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.semiBold,
  },
  textoPequeno: {
    fontSize: 14,
  },
});
