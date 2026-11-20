import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { buscarArtigosComCache } from '../database/supabase';
import { BotaoVoltar, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';
import { Book2Icon } from '@solar-icons/react-native/bold/book-2'

export default function ArtigosListScreen({ voltar, irParaLerArtigo, artigosIniciais = [], online = true }) {
  const [artigos, setArtigos] = useState(artigosIniciais);

  // Se por acaso ainda não tiver carregado do App.js, busca com suporte a Cache Primeiro
  useEffect(() => {
    if (artigos.length === 0) {
      buscarArtigosComCache()
        .then((resultado) => {
          if (resultado?.dados) {
            setArtigos(resultado.dados.filter((a) => a.id <= 4));
          }
        })
        .catch((err) => {
          console.log('Não foi possível carregar artigos:', err);
        });
    }
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <BotaoVoltar onPress={voltar} />

        <Text style={styles.titulo}>Artigos</Text>

        {/* Linhazinha Divisória Fina */}
        <LinhaDivisoria />

        {artigos.map((artigo) => (
          <TouchableOpacity
            key={artigo.id}
            style={styles.card}
            onPress={() => irParaLerArtigo(artigo)}
            activeOpacity={0.7}
          >
            <View style={styles.cabecalhoCard}>
              <Book2Icon color="#6500B8" size={18} />
              <Text style={styles.categoria}>{artigo.categoria}</Text>
            </View>

            <Text style={styles.nome}>{artigo.titulo}</Text>
            <Text style={styles.descricao}>{artigo.descricao}</Text>

            <View style={styles.rodapeCard}>
              <Text style={styles.textoLer}>Ler artigo completo</Text>
              <ArrowRight color="#6500B8" size={16} />
            </View>
          </TouchableOpacity>
        ))}
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
    color: '#6500B8',
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
  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  cabecalhoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  categoria: {
    color: '#6500B8',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: fontesDestaque.bold,
    marginBottom: 6,
  },
  descricao: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 14,
  },
  rodapeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  textoLer: {
    color: '#6500B8',
    fontWeight: 'bold',
    fontFamily: fontesDestaque.semiBold,
    fontSize: 13,
  },
});
