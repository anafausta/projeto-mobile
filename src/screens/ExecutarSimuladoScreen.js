import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  SafeAreaView, Alert, ActivityIndicator, Dimensions
} from 'react-native';
import { Clock3, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react-native';
import { buscarQuestoesSupabase } from '../database/supabase';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

import { MedalRibbonStarIcon} from '@solar-icons/react-native/bold/medal-ribbon-star'
import { CheckIcon } from '@solar-icons/react-native/bold/check'
import { CloseIcon } from '@solar-icons/react-native/bold/close'

export default function ExecutarSimuladoScreen({ simulado, voltarParaLista, onFinalizarSimulado }) {
  const [carregando, setCarregando] = useState(true);
  const [questoes, setQuestoes] = useState([]);
  const [atual, setAtual] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [fim, setFim] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [tempo, setTempo] = useState(simulado.comTempo ? simulado.tempoMinutos * 60 : 0);
  const scrollNavRef = useRef(null);
  const screenWidth = Dimensions.get('window').width;

  // Auto-scroll das bolinhas de navegação para acompanhar a questão atual
  useEffect(() => {
    if (scrollNavRef.current && questoes.length > 0) {
      const itemWidth = 42; // 34px da bolinha + 8px de marginRight
      const scrollToX = Math.max(0, atual * itemWidth - screenWidth / 2 + itemWidth / 2 + 18);
      scrollNavRef.current.scrollTo({ x: scrollToX, animated: true });
    }
  }, [atual, questoes.length]);

  // Salva o resultado do simulado quando finalizado
  useEffect(() => {
    if (fim && questoes.length > 0 && !salvo) {
      setSalvo(true);
      const acertos = questoes.filter((q, i) => respostas[i] === q.correto).length;
      const taxa = Math.round((acertos / questoes.length) * 100);
      onFinalizarSimulado?.({
        id: Date.now(),
        data: new Date().toLocaleDateString('pt-BR'),
        titulo: simulado.titulo || `Simulado (${questoes.length} questões)`,
        quantidade: questoes.length,
        acertos,
        erros: questoes.length - acertos,
        taxa,
        pontos: acertos * 10,
      });
    }
  }, [fim, salvo, questoes.length]);

  // 1. Carrega e sorteia
  useEffect(() => {
    (async () => {
      try {
        const dados = await buscarQuestoesSupabase();
        const sorteadas = [...dados].sort(() => Math.random() - 0.5).slice(0, simulado.quantidade || 10);
        setQuestoes(sorteadas.map(q => ({
          ...q,
          alternativas: [...q.alternativas].sort(() => Math.random() - 0.5),
          correto: q.alternativas.find(a => a.id === q.correta)?.texto
        })));
      } catch (err) {
        const msg = err?.name === 'TimeoutError'
          ? 'Tempo limite de conexão esgotado. Verifique sua conexão e tente novamente.'
          : 'Não foi possível carregar as questões. Verifique sua conexão com a internet.';
        Alert.alert('Erro de Conexão', msg, [{ text: 'Voltar', onPress: voltarParaLista }]);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  // 2. Cronômetro
  useEffect(() => {
    if (!simulado.comTempo || fim || !questoes.length) return;
    const timer = setInterval(() => {
      setTempo((t) => {
        if (t <= 1) {
          setFim(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fim, simulado.comTempo, questoes.length]);

  const formatarTempo = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const sair = () => Alert.alert('Sair', 'Deseja sair do simulado?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Sair', style: 'destructive', onPress: voltarParaLista }
  ]);

  const finalizar = () => {
    const pendentes = questoes.length - Object.keys(respostas).length;
    Alert.alert('Finalizar', pendentes > 0 ? `Restam ${pendentes} questões sem resposta. Deseja finalizar?` : 'Finalizar simulado?', [
      { text: 'Continuar', style: 'cancel' },
      { text: 'Finalizar', onPress: () => setFim(true) }
    ]);
  };

  // Loading
  if (carregando) {
    return (
      <SafeAreaView style={[styles.area, styles.centro]}>
        <ActivityIndicator size="large" color="#6500B8" />
        <Text style={styles.txtCarregando}>Carregando simulado...</Text>
      </SafeAreaView>
    );
  }

  // Tela de Resultado
  if (fim) {
    const acertos = questoes.filter((q, i) => respostas[i] === q.correto).length;
    const taxa = Math.round((acertos / questoes.length) * 100);
    return (
      <SafeAreaView style={styles.area}>
        <ScrollView contentContainerStyle={styles.centro}>
          <MedalRibbonStarIcon size={90} color="#6500B8" style={{ marginVertical: 20 }} />
          <Text style={styles.tituloResultado}>Resultado do Simulado</Text>
          <View style={styles.tagPontos}><Text style={styles.txtPontos}>+{acertos * 10} Pontos!</Text></View>

          <View style={styles.placar}>
            <View style={styles.colPlacar}><CheckIcon size={24}color="#16A34A"/><Text style={styles.numPlacar}>{acertos}/{questoes.length}</Text><Text style={styles.legendaPlacar}>Acertos</Text></View>
            <View style={styles.divisor} />
            <View style={styles.colPlacar}><CloseIcon size={24} color="#DC2626"/><Text style={styles.numPlacar}>{questoes.length - acertos}</Text><Text style={styles.legendaPlacar}>Erros</Text></View>
          </View>


          <Text style={styles.txtAproveitamento}>Aproveitamento: <Text style={{ color: '#6500B8', fontWeight: 'bold' }}>{taxa}%</Text></Text>
          <TouchableOpacity style={styles.btnPrincipal} onPress={voltarParaLista}>
            <RotateCcw color="#FFF" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.txtBtn}>Voltar aos Simulados</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const q = questoes[atual];
  if (!q) return null;

  return (
    <SafeAreaView style={styles.area}>
      <View style={styles.container}>
        {/* Topo */}
        <View style={styles.topo}>
          <TouchableOpacity onPress={sair}><Text style={styles.txtSair}>Sair</Text></TouchableOpacity>
          <View style={styles.boxTempo}>
            <Clock3 size={15} color="#6500B8" />
            <Text style={styles.txtTempo}>{simulado.comTempo ? formatarTempo(tempo) : 'Livre'}</Text>
          </View>
        </View>

        {/* Barra de Bolinhas das Questões */}
        <ScrollView 
          ref={scrollNavRef}
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.barraNav}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {questoes.map((_, i) => {
            const jaRespondida = Boolean(respostas[i]);
            return (
              <TouchableOpacity
                key={i}
                disabled={!jaRespondida && i !== atual} // Só clica se já respondeu ou se for a atual
                style={[
                  styles.bolinha, 
                  jaRespondida && styles.bolinhaResp, 
                  atual === i && styles.bolinhaAtual,
                  (!jaRespondida && i !== atual) && { opacity: 0.4 }
                ]}
                onPress={() => setAtual(i)}
              >
                <Text style={[styles.txtBolinha, jaRespondida && styles.txtBolinhaResp, atual === i && styles.txtBolinhaAtual]}>
                  {i + 1}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Questão e Alternativas */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.numQuestao}>Questão {atual + 1} de {questoes.length}:</Text>
          <Text style={styles.enunciado}>{q.enunciado}</Text>
          {q.alternativas.map((alt, i) => {
            const letra = ['A', 'B', 'C', 'D', 'E'][i];
            const sel = respostas[atual] === alt.texto;
            return (
              <TouchableOpacity key={i} style={[styles.cardAlt, sel && styles.cardAltSel]} onPress={() => setRespostas({ ...respostas, [atual]: alt.texto })}>
                <View style={[styles.circuloLetra, sel && styles.circuloLetraSel]}><Text style={[styles.txtLetra, sel && { color: '#FFF' }]}>{letra}</Text></View>
                <Text style={[styles.txtAlt, sel && styles.txtAltSel]}>{alt.texto}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/*SÓ DEIXA AVANÇAR SE RESPONDEU */}
        <View style={styles.rodape}>
          <TouchableOpacity 
            style={[styles.btnNavSecundario, atual === 0 && { opacity: 0.3 }]} 
            disabled={atual === 0} 
            onPress={() => setAtual(a => a - 1)}
          >
            <ArrowLeft color="#6500B8" size={16} />
            <Text style={styles.txtBtnSec}>Anterior</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.btnNavPrincipal, 
              atual === questoes.length - 1 && styles.btnFinalizar,
              !respostas[atual] && { opacity: 0.3 } // Fica apagado
            ]} 
            disabled={!respostas[atual]} // NÃO PASSA SEM RESPONDER!
            onPress={() => (atual === questoes.length - 1 ? finalizar() : setAtual(a => a + 1))}
          >
            <Text style={styles.txtBtn}>{atual === questoes.length - 1 ? 'Finalizar' : 'Próxima'}</Text>
            {atual !== questoes.length - 1 && <ArrowRight color="#FFF" size={16} />}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  area: { 
    flex: 1, 
    backgroundColor: coresGlobais.fundoPadrao 
  },

  container: { 
    flex: 1, 
    padding: 18
  },
  centro: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  txtCarregando: {
     marginTop: 12, 
     color: '#6500B8', 
     fontSize: 16,
     fontWeight: 'bold' 
    },

  topo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },

  txtSair: { color: '#DC2626', fontWeight: 'bold' },
  
  boxTempo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 5, 
  
  borderRadius: 8, gap: 5, borderWidth: 1, borderColor: '#E2E8F0' },
  
  txtTempo: { color: '#6500B8', fontWeight: 'bold', fontSize: 13 },
  
  barraNav: { maxHeight: 42, marginBottom: 15 },
  
  bolinha: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  
  bolinhaResp: { backgroundColor: '#DCFCE7', borderColor: '#22C55E' },
  
  bolinhaAtual: { borderWidth: 2, borderColor: '#6500B8' },
  
  txtBolinha: { fontSize: 13, fontWeight: 'bold', color: '#64748B' },
  
  txtBolinhaResp: { color: '#15803D' },
  
  txtBolinhaAtual: { color: '#6500B8' },
  
  numQuestao: { fontSize: 13, fontWeight: 'bold', color: '#6500B8', fontFamily: fontesDestaque.bold, marginBottom: 4 },
  
  enunciado: { fontSize: 15, color: '#1E293B', lineHeight: 22, marginBottom: 15, fontWeight: '500' },
  
  cardAlt: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 
  10, padding: 12, marginBottom: 8 },
  
  cardAltSel: { borderColor: '#6500B8', backgroundColor: '#F3E8FF' },
  
  circuloLetra: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#CBD5E1', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  
  circuloLetraSel: { backgroundColor: '#6500B8', borderColor: '#6500B8' },
  
  txtLetra: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  
  txtAlt: { flex: 1, fontSize: 13, color: '#334155' },
  
  txtAltSel: { color: '#6500B8', fontWeight: 'bold' },
  
  rodape: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 },
  
  btnNavSecundario: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1, borderColor: '#CBD5E1', backgroundColor: '#FFF', gap: 5 },
  
  txtBtnSec: { color: '#6500B8', fontWeight: 'bold', fontSize: 13 },
  
  btnNavPrincipal: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#6500B8', gap: 5 },
  
  btnFinalizar: { backgroundColor: '#16A34A' },
  
  txtBtn: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  
  tituloResultado: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', fontFamily: fontesDestaque.bold, marginBottom: 10 },
  
  tagPontos: { backgroundColor: '#FEF3C7', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 15, marginBottom: 18 },
  
  txtPontos: { color: '#B45309', fontWeight: 'bold', fontFamily: fontesDestaque.bold, fontSize: 14 },
  
  placar: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', padding: 15, 
  width: '100%', justifyContent: 'space-around', marginBottom: 15 },
  
  colPlacar: { alignItems: 'center' },
  
  numPlacar: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', fontFamily: fontesDestaque.bold, marginTop: 3 },
  
  legendaPlacar: { color: '#64748B', fontSize: 11 },
  
  divisor: { width: 1, height: 35, backgroundColor: '#E2E8F0' },
  
  txtAproveitamento: { fontSize: 15, color: '#334155', marginBottom: 25 },
  
  btnPrincipal: { backgroundColor: '#6500B8', flexDirection: 'row', width: '100%', padding: 14, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
});