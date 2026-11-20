import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { CheckCircle2, Lock, PlayCircle } from 'lucide-react-native';
import { buscarArtigosComCache } from '../database/supabase';
import { BotaoVoltar, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

export default function DetalheEtapaScreen({
  trilhaKey,
  voltarParaLista,
  irParaLerAula,
  aulasConcluidas = [],
}) {
  const [modulos, setModulos] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregar() {
      try {
        setCarregando(true);
        // 1. Busca primeiro do cache offline (se não houver rede, carrega do celular!)
        const res = await buscarArtigosComCache();
        const todos = res?.dados || [];
        // 2. Filtra apenas os itens que pertencem às Trilhas
        const daTrilha = todos.filter(
          item =>
            (item.tipo ? item.tipo === 'trilha' : item.id >= 5) &&
            (item.categoria?.toLowerCase().includes(trilhaKey.toLowerCase().slice(0, 5)) ||
             item.categoria === trilhaKey)
        );
        setModulos(daTrilha);
      } catch (e) {
        console.log('Erro ao carregar módulos da trilha:', e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, [trilhaKey]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BotaoVoltar onPress={voltarParaLista} texto="Todas as Trilhas" />

        <Text style={styles.titulo}>{trilhaKey}</Text>
        <Text style={styles.subtitulo}>Módulos oficiais de estudo para a OLITEF</Text>

        <LinhaDivisoria />

        {carregando ? (
          <View style={styles.centro}>
            <ActivityIndicator size="large" color="#6500B8" />
          </View>
        ) : (
          <ScrollView style={styles.mapaContainer} showsVerticalScrollIndicator={false}>
            {/* Módulos do Banco de Dados */}
            {modulos.map((modulo, index) => {
              const concluido = aulasConcluidas.includes(modulo.id);

              return (
                <View key={modulo.id} style={styles.etapaWrapper}>
                  <View style={styles.linhaConectora} />
                  <TouchableOpacity
                    style={[styles.nodoTrilha, concluido ? styles.nodoConcluido : styles.nodoLiberado]}
                    onPress={() => irParaLerAula(modulo)}
                  >
                    <View style={styles.conteudoNodo}>
                      <View style={styles.infoEtapa}>
                        <Text style={styles.textoEtapaTitulo}>
                          Módulo {index + 1}: {modulo.titulo}
                        </Text>
                        <Text style={[styles.statusEtapa, concluido && { color: '#16A34A' }]}>
                          {concluido ? 'Concluído ✓' : 'Disponível • Toque para estudar'}
                        </Text>
                      </View>
                      {concluido ? (
                        <CheckCircle2 color="#16A34A" size={26} />
                      ) : (
                        <PlayCircle color="#6500B8" size={26} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}

            {/* Próximo módulo em construção */}
            <View style={styles.etapaWrapper}>
              <View style={[styles.nodoTrilha, styles.nodoBloqueado]}>
                <View style={styles.conteudoNodo}>
                  <View style={styles.infoEtapa}>
                    <Text style={[styles.textoEtapaTitulo, styles.textoBloqueado]}>
                      Módulo {modulos.length + 1}: Em breve
                    </Text>
                    <Text style={styles.statusEtapaBloqueada}>Bloqueado</Text>
                  </View>
                  <Lock color="#A0AEC0" size={20} />
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: coresGlobais.fundoPadrao },
  container: { flex: 1, padding: 20 },
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoVoltar: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 15 },
  textoVoltar: { color: '#6500B8', fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#5700B8', fontFamily: fontesDestaque.bold },
  subtitulo: { color: '#666', fontSize: 14, marginTop: 4, marginBottom: 20 },
  mapaContainer: { flex: 1, paddingTop: 10 },
  etapaWrapper: { alignItems: 'center', marginBottom: 16, position: 'relative' },
  linhaConectora: { position: 'absolute', top: 52, width: 2, height: 32, backgroundColor: '#E2E8F0', zIndex: -1 },
  nodoTrilha: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  nodoLiberado: { borderColor: '#6500B8', elevation: 2 },
  nodoConcluido: { borderColor: '#16A34A', backgroundColor: '#F0FDF4' },
  nodoBloqueado: { backgroundColor: '#F8F9FA', opacity: 0.6 },
  conteudoNodo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  infoEtapa: { flex: 1, marginRight: 10 },
  textoEtapaTitulo: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', fontFamily: fontesDestaque.bold },
  textoBloqueado: { color: '#64748B' },
  statusEtapa: { fontSize: 12, color: '#6500B8', marginTop: 4, fontWeight: '500' },
  statusEtapaBloqueada: { fontSize: 12, color: '#94A3B8', marginTop: 4 },
});