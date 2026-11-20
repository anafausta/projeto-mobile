import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { AtSign, LogOut } from 'lucide-react-native';

import { BotaoVoltar, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';
import { StarCircleIcon } from '@solar-icons/react-native/bold/star-circle'
import { CheckCircleIcon } from '@solar-icons/react-native/bold/check-circle'
import { UserIdIcon } from '@solar-icons/react-native/bold/user-id'
import { LetterIcon } from '@solar-icons/react-native/bold/letter'
import { CalendarRangeIcon } from '@solar-icons/react-native/bold/calendar-range'

export default function PerfilScreen({
  usuario,
  voltar,
  deslogar,
  totalAulasConcluidas = 0,
  pontosXP = 0,
}) {
  const nomeCompleto = usuario?.nome || 'Estudante Olímpico';
  const username = usuario?.usuario || 'estudante';
  const email = usuario?.email || 'estudante@olitef.com.br';

  // Iniciais do nome para o Avatar (ex: "Ana Maria" -> "AM")
  const partesNome = nomeCompleto.trim().split(' ');
  const iniciais =
    partesNome.length > 1
      ? `${partesNome[0][0]}${partesNome[partesNome.length - 1][0]}`.toUpperCase()
      : partesNome[0].slice(0, 2).toUpperCase();

  function confirmarSaida() {
    Alert.alert('Sair da conta', 'Tem certeza de que deseja sair?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: deslogar },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Topo / Voltar */}
        <BotaoVoltar onPress={voltar} />

        <Text style={styles.tituloHeader}>Meu Perfil</Text>

        {/* Linhazinha Divisória Fina */}
        <LinhaDivisoria />

        {/* Card Principal de Destaque */}
        <View style={styles.cardDestaque}>
          <View style={styles.avatar}>
            <Text style={styles.txtIniciais}>{iniciais}</Text>
          </View>
          <Text style={styles.nomeDestaque}>{nomeCompleto}</Text>
          <View style={styles.badgeUsername}>
            <Text style={styles.txtUsername}>@{username}</Text>
          </View>
        </View>

        {/* Resumo de Progresso */}
        <Text style={styles.secaoTitulo}>Seu Progresso</Text>
        <View style={styles.gridEstatisticas}>
          <View style={styles.cardStat}>
            <View style={[styles.iconeStat]}>
              <CheckCircleIcon color="#5700B8" size={31} />
            </View>
            <Text style={styles.valorStat}>{totalAulasConcluidas}</Text>
            <Text style={styles.labelStat}>Aulas Concluídas</Text>
          </View>

          <View style={styles.cardStat}>
            <View style={[styles.iconeStat]}>
              <StarCircleIcon color="#efa42b" size={29}/>
            </View>
            <Text style={styles.valorStat}>{pontosXP} XP</Text>
            <Text style={styles.labelStat}>Pontuação Total</Text>
          </View>
        </View>

        {/* Dados Cadastrais */}
        <Text style={styles.secaoTitulo}>Dados Cadastrais</Text>
        <View style={styles.cardDados}>
          <View style={styles.itemDado}>
            <View style={styles.iconeDado}>
              <UserIdIcon color="#5700B8" size={18} />
            </View>
            <View style={styles.infoDado}>
              <Text style={styles.labelDado}>Nome Completo</Text>
              <Text style={styles.valorDado}>{nomeCompleto}</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.itemDado}>
            <View style={styles.iconeDado}>
              <AtSign color="#5700B8" size={18} />
            </View>
            <View style={styles.infoDado}>
              <Text style={styles.labelDado}>Usuário</Text>
              <Text style={styles.valorDado}>@{username}</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.itemDado}>
            <View style={styles.iconeDado}>
              <LetterIcon color="#5700B8" size={18} />
            </View>
            <View style={styles.infoDado}>
              <Text style={styles.labelDado}>E-mail</Text>
              <Text style={styles.valorDado}>{email}</Text>
            </View>
          </View>

          <View style={styles.divisor} />

          <View style={styles.itemDado}>
            <View style={styles.iconeDado}>
              <CalendarRangeIcon color="#5700B8" size={18} />
            </View>
            <View style={styles.infoDado}>
              <Text style={styles.labelDado}>Olimpíada Alvo</Text>
              <Text style={styles.valorDado}>OLITEF 2027</Text>
            </View>
          </View>
        </View>

        {/* Botão Sair da Conta */}
        <TouchableOpacity
          style={styles.btnDeslogar}
          onPress={confirmarSaida}
          activeOpacity={0.7}
        >
          <LogOut color="#DC2626" size={18} style={{ marginRight: 8 }} />
          <Text style={styles.txtDeslogar}>Sair da Conta</Text>
        </TouchableOpacity>

        {/* Rodapé */}
        <View style={styles.rodape}>
          <Text style={styles.txtRodape}>• Olympic Hub •</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: coresGlobais.fundoPadrao,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
  },
  btnVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  txtVoltar: {
    color: '#5700B8',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  tituloHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
    marginBottom: 4,
  },
  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  cardDestaque: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#5700B8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  txtIniciais: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: fontesDestaque.bold,
  },
  nomeDestaque: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
    marginBottom: 4,
  },
  badgeUsername: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  txtUsername: {
    color: '#5700B8',
    fontSize: 13,
    fontWeight: '600',
  },
  secaoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
    marginBottom: 12,
  },
  gridEstatisticas: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  cardStat: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  iconeStat: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  valorStat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
  },
  labelStat: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cardDados: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  itemDado: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  iconeDado: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  infoDado: {
    flex: 1,
  },
  labelDado: {
    fontSize: 12,
    color: '#64748B',
  },
  valorDado: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 2,
  },
  divisor: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  btnDeslogar: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  txtDeslogar: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: 'bold',
  },
  rodape: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingBottom: 24,
  },
  txtRodape: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
