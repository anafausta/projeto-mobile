import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Grid3X3, Gamepad2, Sparkles } from 'lucide-react-native';
import CrossSumsScreen from './CrossSumsScreen';
import { BotaoVoltar, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

export default function JoguinhosScreen({ voltar, onGanharXP }) {
  const [jogoAberto, setJogoAberto] = useState(null);

  // Se o aluno escolheu abrir o Cross Sums
  if (jogoAberto === 'cross_sums') {
    return (
      <CrossSumsScreen
        voltar={() => setJogoAberto(null)}
        onGanharXP={onGanharXP}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BotaoVoltar onPress={voltar} />

        <Text style={styles.titulo}>Minigames</Text>
        <Text style={styles.subtitulo}>
          Treine matemática e lógica financeira de forma divertida!
        </Text>

        <LinhaDivisoria />

        {/* Card Cross Sums */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => setJogoAberto('cross_sums')}
        >
          <View style={styles.icone}>
            <Grid3X3 color="#6500B8" size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>Cross Sums Olímpico</Text>
            <Text style={styles.descricao}>
              Selecione os números que atingem as somas das linhas e colunas.
            </Text>
            <View style={styles.badgeXP}>
              <Sparkles color="#B45309" size={12} />
              <Text style={styles.txtXP}>+5 XP</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Card Próximo Jogo */}
        <TouchableOpacity
          style={[styles.card, { opacity: 0.6 }]}
          onPress={() =>
            Alert.alert('Em breve', 'O jogo "Necessidade ou Desejo" está sendo preparado!')
          }
        >
          <View style={[styles.icone, { backgroundColor: '#F1F5F9' }]}>
            <Gamepad2 color="#64748B" size={28} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.nome}>Necessidade vs. Desejo</Text>
            <Text style={styles.descricao}>
              Decida rápido antes que o tempo acabe e teste seus hábitos.
            </Text>
            <Text style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, fontWeight: 'bold' }}>
              EM BREVE
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: coresGlobais.fundoPadrao },
  scrollContent: { paddingHorizontal: 22, paddingTop: 12, paddingBottom: 24 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#5700B8', fontFamily: fontesDestaque.bold, marginBottom: 4 },
  subtitulo: { color: '#64748B', fontSize: 13, lineHeight: 18 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 14,
    elevation: 2,
  },
  icone: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', fontFamily: fontesDestaque.bold },
  descricao: { fontSize: 13, color: '#64748B', marginTop: 2, lineHeight: 18 },
  badgeXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  txtXP: { fontSize: 11, fontWeight: 'bold', color: '#B45309' },
});