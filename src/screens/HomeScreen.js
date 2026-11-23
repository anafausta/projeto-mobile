import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';

import { LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';
import { UserCircleIcon } from '@solar-icons/react-native/bold/user-circle'
import { StopwatchPlayIcon } from '@solar-icons/react-native/linear/stopwatch-play'
import { Routing3Icon } from '@solar-icons/react-native/linear/routing-3'
import { DoubleAltArrowRightIcon } from '@solar-icons/react-native/linear/double-alt-arrow-right'
import { GamepadOldIcon } from '@solar-icons/react-native/linear/gamepad-old'
import { NotebookBookmarkIcon } from '@solar-icons/react-native/linear/notebook-bookmark'
import { ChecklistMinimalisticIcon } from '@solar-icons/react-native/linear/checklist-minimalistic'
import { StarCircleIcon } from '@solar-icons/react-native/bold/star-circle'

export default function HomeScreen({
  usuario,
  pontosXP = 0,
  irParaTrilha,
  irParaSimulados,
  irParaArtigos,
  irParaJoguinhos,
  irParaPerfil,
}) 

{
  const nome = usuario?.nome?.split(' ')[0] || 'Estudante';

  const dataOlimpiada = new Date(2027, 8, 8);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasRestantes = Math.max(
    0,
    Math.ceil((dataOlimpiada - hoje) / (1000 * 60 * 60 * 24))
  );

  const atividades = [
    {
      nome: 'Simulados',
      icone: ChecklistMinimalisticIcon,
      acao: irParaSimulados,
    },
    {
      nome: 'Artigos',
      icone: NotebookBookmarkIcon,
      acao: irParaArtigos,
    },
    {
      nome: 'Joguinhos',
      icone: GamepadOldIcon,
      acao: irParaJoguinhos,
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View style={styles.cabecalhoEsquerda}>
            <View style={styles.logoBox}>
              <Image
                source={require('../../assets/logo-olympic-hub.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.textoCabecalho}>
              <Text style={styles.saudacao}>Olá, {nome}</Text>
              <Text style={styles.subtitulo}>Bem-vindo ao Olympic Hub!</Text>
            </View>
          </View>

          {/* Destaque XP e Botão de Perfil */}
          <View style={styles.cabecalhoDireita}>
            <View style={styles.badgeXPHeader}>
              <StarCircleIcon color="#B45309" size={18} style={{ marginRight: 4 }} />
              <Text style={styles.txtXPHeader}>{pontosXP} Xp</Text>
            </View>

            <TouchableOpacity
              style={styles.btnPerfil}
              onPress={irParaPerfil}
              activeOpacity={0.7}
            >
              <UserCircleIcon color="#5700B8" size={20} />
            </TouchableOpacity>
          </View>
        </View>

        <LinhaDivisoria />

        {/* Card Contagem Regressiva*/}
        <View style={styles.cardEvento}>
          <View style={styles.cardEventoHeader}>
            <Text style={styles.tituloCardEvento}>Contagem regressiva</Text>
            <View style={styles.badgeTag}>
              <Text style={styles.txtBadgeTag}>OLITEF 2027</Text>
            </View>
          </View>

          <Text style={styles.diasNumero}>{diasRestantes} dias</Text>

          <View style={styles.badgeData}>
            <StopwatchPlayIcon color="#5700B8" size={13} style={{ marginRight: 6 }} />
            <Text style={styles.txtBadgeData}>08 de setembro de 2027</Text>
          </View>

          <Text style={styles.descricaoEvento}>
            Olimpíada do Tesouro Direto de Educação Financeira (OLITEF)
          </Text>
        </View>

        <LinhaDivisoria />

        {/* Seção Trilha de Estudos */}
        <Text style={styles.tituloSecao}>Sua trilha</Text>

        <TouchableOpacity
          style={styles.cardTrilhaRoxinho}
          onPress={irParaTrilha}
          activeOpacity={0.8}
        >
          <View style={styles.trilhaConteudo}>
              <Routing3Icon color="#5700B8" size={24} marginRight={8} />
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.tituloTrilha}>Trilha</Text>
              <Text style={styles.descTrilha}>
                Complete as atividades e prepare-se para a olimpíada!
              </Text>
            </View>
          </View>

          <DoubleAltArrowRightIcon color="#5700B8" size={22} />
        </TouchableOpacity>

        <LinhaDivisoria />

        {/* Seção Atividades */}
        <Text style={styles.tituloSecao}>Atividades</Text>

        <View style={styles.gradeAtividades}>
          {atividades.map((item) => {
            const Icone = item.icone;

            return (
              <TouchableOpacity
                key={item.nome}
                style={styles.cardAtividade}
                onPress={item.acao}
                activeOpacity={0.7}
              >
                <Icone color="#5700B8" size={28} />
                <Text style={styles.nomeAtividade}>{item.nome}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: coresGlobais.fundoPadrao,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  cabecalhoEsquerda: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  textoCabecalho: {
    marginLeft: 12,
    flex: 1,
    
  },
  saudacao: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  cabecalhoDireita: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badgeXPHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 12,
  },
  txtXPHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#B45309',
    fontFamily: fontesDestaque.bold,
  },
  btnPerfil: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },

  // Card Contagem Regressiva
  cardEvento: {
    backgroundColor: '#5700B8',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#5700B8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardEventoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  tituloCardEvento: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.9,
  },
  badgeTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  txtBadgeTag: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  diasNumero: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.bold,
    marginVertical: 4,
  },
  badgeData: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 2,
    marginBottom: 10,
  },
  txtBadgeData: {
    color: '#5700B8',
    fontSize: 12,
    fontWeight: 'bold',
  },
  descricaoEvento: {
    color: '#FFF',
    fontSize: 13,
    opacity: 0.9,
    lineHeight: 18,
  },

  // Títulos de Seção Limpos
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
    marginBottom: 12,
  },

  // Card Trilha Roxinho
  cardTrilhaRoxinho: {
    backgroundColor: '#EAD9FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#D8C3F5',
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trilhaConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconeTrilhaBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tituloTrilha: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
  },
  descTrilha: {
    fontSize: 12,
    color: '#555',
    marginTop: 2,
  },

  // Grade de Atividades
  gradeAtividades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardAtividade: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nomeAtividade: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.semiBold,
    marginTop: 10,
  },
});
