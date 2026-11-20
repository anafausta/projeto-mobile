import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

import { BotaoVoltar, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

import { BackpackIcon } from '@solar-icons/react-native/bold/backpack'
import { CompassBigIcon } from '@solar-icons/react-native/bold/compass-big'
import { GraphUpIcon } from '@solar-icons/react-native/bold/graph-up'
import { ShieldStarIcon } from '@solar-icons/react-native/bold/shield-star'
import { DoubleAltArrowRightIcon } from '@solar-icons/react-native/linear/double-alt-arrow-right'

const TRILHAS = [
  {
    key: 'Educacao Financeira',
    titulo: 'Educação Financeira',
    subtitulo: 'Fundamentos e conceitos básicos',
    icone: BackpackIcon,
  },
  {
    key: 'Planejamento Financeiro',
    titulo: 'Planejamento Financeiro',
    subtitulo: 'Orçamento e controle de metas',
    icone: CompassBigIcon,
  },
  {
    key: 'Investimentos',
    titulo: 'Investimentos',
    subtitulo: 'Juros compostos e Tesouro Direto',
    icone: GraphUpIcon,
  },
  {
    key: 'Consumo Consciente',
    titulo: 'Consumo Consciente',
    subtitulo: 'Necessidades, desejos e crédito',
    icone: ShieldStarIcon,
  },
];

export default function TrilhaScreen({ voltar, irParaDetalheTrilha }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Botão Voltar Padrão */}
        <BotaoVoltar onPress={voltar} />

        {/* Cabeçalho */}
        <Text style={styles.titulo}>Trilhas de Estudo</Text>
        <Text style={styles.subtitulo}>
          Selecione uma área para acompanhar os módulos
        </Text>

        {/* Linhazinha Divisória Fina */}
        <LinhaDivisoria />

        {/* Cards no Estilo Fino e Elegante do Simulado */}
        <View style={styles.listaCards}>
          {TRILHAS.map((item) => {
            const Icone = item.icone;

            return (
              <TouchableOpacity
                key={item.key}
                style={styles.cardCategoria}
                onPress={() => irParaDetalheTrilha(item.key)}
                activeOpacity={0.7}
              >
                <View style={styles.iconeBox}>
                  <Icone color="#5700B8" size={24} />
                </View>

                <View style={styles.textoCardBox}>
                  <Text style={styles.categoriaTitulo}>{item.titulo}</Text>
                  <Text style={styles.categoriaSub}>{item.subtitulo}</Text>
                </View>

                <DoubleAltArrowRightIcon color="#94A3B8" size={20} />
              </TouchableOpacity>
            );
          })}
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
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  textoVoltar: {
    color: '#5700B8',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
    marginBottom: 4,
  },
  subtitulo: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  listaCards: {
    gap: 12,
  },
  cardCategoria: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconeBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  textoCardBox: {
    flex: 1,
    paddingRight: 8,
  },
  categoriaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
  },
  categoriaSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
});
