import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { BotaoVoltar } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

export default function LerArtigoScreen({ artigo, voltarParaLista }) {
  if (!artigo) return null;

  // Garante que o conteúdo seja tratado como array com segurança
  const blocos = Array.isArray(artigo.conteudo)
    ? artigo.conteudo
    : typeof artigo.conteudo === 'string'
    ? JSON.parse(artigo.conteudo || '[]')
    : [];

  function renderizarConteudo(bloco, index) {
    switch (bloco.tipo) {
      case 'h1':
        return <Text key={index} style={styles.h1}>{bloco.texto}</Text>;
      case 'h2':
        return <Text key={index} style={styles.h2}>{bloco.texto}</Text>;
      case 'bold_paragraph':
        return <Text key={index} style={styles.boldParagraph}>{bloco.texto}</Text>;
      case 'p':
        return <Text key={index} style={styles.paragraph}>{bloco.texto}</Text>;
      case 'bullet':
        return (
          <View key={index} style={styles.bulletContainer}>
            <Text style={styles.bulletPoint}>•</Text>
            <Text style={styles.bulletText}>
              {bloco.destaque ? <Text style={styles.textoNegrito}>{bloco.destaque} </Text> : null}
              {bloco.texto}
            </Text>
          </View>
        );
      case 'paragraph_mixed':
        return (
          <Text key={index} style={styles.paragraph}>
            <Text style={styles.textoNegrito}>{bloco.destaque} </Text>
            {bloco.texto}
          </Text>
        );
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Cabeçalho */}
      <View style={styles.cabecalhoFixo}>
        <BotaoVoltar onPress={voltarParaLista} texto="Artigos" style={{ marginBottom: 0 }} />
        <Text style={styles.categoriaTag}>{artigo.categoria}</Text>
      </View>

      {/* Conteúdo do Artigo */}
      <ScrollView style={styles.containerLeitura} showsVerticalScrollIndicator={false}>
        <View style={styles.conteudoBlocos}>
          {blocos.map((bloco, index) => renderizarConteudo(bloco, index))}
        </View>

        <View style={styles.rodapeFim}>
          <Text style={styles.textoFim}>• Olympic Hub •</Text>
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
  cabecalhoFixo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: coresGlobais.fundoPadrao,
  },
  botaoVoltar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textoVoltar: {
    color: '#6500B8',
    fontSize: 16,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  categoriaTag: {
    color: '#6500B8',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  containerLeitura: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 15,
  },
  conteudoBlocos: {
    paddingBottom: 30,
  },
  h1: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
    marginBottom: 14,
    lineHeight: 28,
  },
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
    marginTop: 20,
    marginBottom: 10,
  },
  boldParagraph: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#334155',
    marginTop: 10,
    marginBottom: 4,
  },
  paragraph: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 12,
  },
  bulletContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 6,
  },
  bulletPoint: {
    fontSize: 16,
    color: '#6500B8',
    marginRight: 8,
    lineHeight: 22,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  textoNegrito: {
    fontWeight: 'bold',
    color: '#1E293B',
  },
  rodapeFim: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  textoFim: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});