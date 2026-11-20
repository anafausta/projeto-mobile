import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Modal,
} from 'react-native';
import { Clock, Sparkles, CheckCircle2, RotateCcw, Trophy } from 'lucide-react-native';
import { BotaoVoltar, BotaoPrincipal } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';
import { StarCircleIcon } from '@solar-icons/react-native/bold/star-circle'
import { MedalRibbonStarIcon } from '@solar-icons/react-native/bold/medal-ribbon-star'

const { width } = Dimensions.get('window');
// Calcula o tamanho das células para caber confortavelmente em qualquer celular
const CELL_SIZE = Math.min(Math.floor((width - 70) / 4), 68);

// Gerador de puzzle com solução garantida
function gerarNovoPuzzle() {
  const grid = Array.from({ length: 3 }, () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 8) + 1)
  );

  const solutionSet = new Set();
  // Garante ao menos 1 por linha e 1 por coluna
  for (let r = 0; r < 3; r++) {
    solutionSet.add(`${r}-${Math.floor(Math.random() * 3)}`);
  }
  for (let c = 0; c < 3; c++) {
    solutionSet.add(`${Math.floor(Math.random() * 3)}-${c}`);
  }
  // Variação de mais algumas células
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (Math.random() > 0.6) {
        solutionSet.add(`${r}-${c}`);
      }
    }
  }

  const solution = Array.from(solutionSet);
  const rowTargets = [0, 0, 0];
  const colTargets = [0, 0, 0];

  solution.forEach((key) => {
    const [r, c] = key.split('-').map(Number);
    rowTargets[r] += grid[r][c];
    colTargets[c] += grid[r][c];
  });

  return { grid, rowTargets, colTargets, solution };
}

export default function CrossSumsScreen({ voltar, onGanharXP }) {
  const [puzzle, setPuzzle] = useState(gerarNovoPuzzle);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [won, setWon] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Cronômetro progressivo
  useEffect(() => {
    if (won) return;
    const timer = setInterval(() => setTimeLeft((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, [won]);

  function formatarTempo(segundos) {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  function handleCellClick(r, c) {
    if (won) return;
    setErrorMsg('');
    const key = `${r}-${c}`;
    const next = new Set(selectedCells);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedCells(next);
  }

  function getRowSum(r) {
    let sum = 0;
    for (let c = 0; c < 3; c++) {
      if (selectedCells.has(`${r}-${c}`)) {
        sum += puzzle.grid[r][c];
      }
    }
    return sum;
  }

  function getColSum(c) {
    let sum = 0;
    for (let r = 0; r < 3; r++) {
      if (selectedCells.has(`${r}-${c}`)) {
        sum += puzzle.grid[r][c];
      }
    }
    return sum;
  }

  function handleFinalizar() {
    setErrorMsg('');

    if (selectedCells.size === 0) {
      setErrorMsg('Toque nos números para selecionar antes de finalizar.');
      return;
    }

    let todasLinhasOk = true;
    let todasColunasOk = true;

    for (let r = 0; r < 3; r++) {
      if (getRowSum(r) !== puzzle.rowTargets[r]) todasLinhasOk = false;
    }
    for (let c = 0; c < 3; c++) {
      if (getColSum(c) !== puzzle.colTargets[c]) todasColunasOk = false;
    }

    if (todasLinhasOk && todasColunasOk) {
      setWon(true);
      onGanharXP?.(5);
    } else {
      setErrorMsg('Soma incorreta! Verifique as linhas e colunas que ainda não atingiram a meta.');
    }
  }

  function novoJogo() {
    setPuzzle(gerarNovoPuzzle());
    setSelectedCells(new Set());
    setTimeLeft(0);
    setWon(false);
    setErrorMsg('');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Topo / Barra Superior */}
        <View style={styles.topo}>
          <BotaoVoltar onPress={voltar} texto="Sair" style={{ marginBottom: 0 }} />

          <View style={styles.statusBox}>
            <View style={styles.badgeTempo}>
              <Clock color="#6500B8" size={15} />
              <Text style={styles.txtTempo}>{formatarTempo(timeLeft)}</Text>
            </View>
            <View style={styles.badgeXP}>
              <StarCircleIcon color="#B45309" size={15} />
              <Text style={styles.txtXP}>+5 XP</Text>
            </View>
          </View>
        </View>

        {/* Título e Instruções (agrupados sem espaçamento exagerado) */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Cross Sums</Text>
          <Text style={styles.subtitulo}>
            Selecione os números que atingem a soma de cada linha e coluna.
          </Text>
        </View>

        {/* Tabuleiro */}
        <View style={styles.tabuleiroContainer}>
          {puzzle.grid.map((row, r) => {
            const rowSum = getRowSum(r);
            const rowOk = rowSum === puzzle.rowTargets[r];

            return (
              <View key={r} style={styles.linha}>
                {row.map((val, c) => {
                  const key = `${r}-${c}`;
                  const isSel = selectedCells.has(key);

                  return (
                    <TouchableOpacity
                      key={key}
                      activeOpacity={0.7}
                      style={[styles.celula, isSel && styles.celulaSel]}
                      onPress={() => handleCellClick(r, c)}
                    >
                      <Text style={[styles.txtNum, isSel && styles.txtBranco]}>{val}</Text>
                    </TouchableOpacity>
                  );
                })}

                {/* Meta da Linha (Direita) */}
                <View style={[styles.alvoLinha, rowOk && styles.alvoLinhaOk]}>
                  <Text style={[styles.labelLinha, rowOk && styles.txtBranco]}>
                    {rowOk ? '✓' : `L${r + 1}`}
                  </Text>
                  <Text style={[styles.numAlvo, rowOk && styles.txtBranco]}>
                    {puzzle.rowTargets[r]}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* Metas das Colunas (Base) */}
          <View style={styles.linhaColunas}>
            {puzzle.colTargets.map((colVal, c) => {
              const colSum = getColSum(c);
              const colOk = colSum === colVal;

              return (
                <View key={c} style={[styles.alvoColuna, colOk && styles.alvoColunaOk]}>
                  <Text style={[styles.labelCol, colOk && styles.txtBranco]}>
                    {colOk ? '✓' : `C${c + 1}`}
                  </Text>
                  <Text style={[styles.numAlvoCol, colOk && styles.txtBranco]}>{colVal}</Text>
                </View>
              );
            })}
            <View style={{ width: CELL_SIZE }} />
          </View>
        </View>

        {/* Mensagem de Feedback/Erro */}
        {errorMsg ? (
          <View style={styles.boxErro}>
            <Text style={styles.txtErro}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Ações Inferiores */}
        <View style={styles.acoesContainer}>
          <BotaoPrincipal
            texto="Finalizar Desafio"
            icone={CheckCircle2}
            onPress={handleFinalizar}
          />

          <TouchableOpacity style={styles.btnReiniciar} onPress={novoJogo}>
            <RotateCcw color="#6500B8" size={17} style={{ marginRight: 6 }} />
            <Text style={styles.txtBtnReiniciar}>Trocar Números / Reiniciar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de Conclusão / Vitória */}
        <Modal visible={won} transparent animationType="fade">
          <View style={styles.modalFundo}>
            <View style={styles.modalCard}>
              <View style={styles.iconeTrofeu}>
                <Trophy color="#EAB308" size={48} />
              </View>

              <Text style={styles.modalTitulo}>Desafio Concluído!</Text>
              <Text style={styles.modalSubtitulo}>
                Você encontrou a combinação perfeita para todas as linhas e colunas!
              </Text>

              <View style={styles.modalEstatisticas}>
                <View style={styles.statItem}>
                  <Clock color="#6500B8" size={18} />
                  <Text style={styles.statValor}>{formatarTempo(timeLeft)}</Text>
                  <Text style={styles.statLabel}>Tempo</Text>
                </View>
                <View style={styles.statItem}>
                  <Sparkles color="#B45309" size={18} />
                  <Text style={styles.statValor}>+5 XP</Text>
                  <Text style={styles.statLabel}>Recompensa</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.btnProximo} onPress={novoJogo}>
                <Text style={styles.txtBtnProximo}>Próximo Desafio</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.btnModalSair} onPress={voltar}>
                <Text style={styles.txtBtnModalSair}>Voltar aos Minigames</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: coresGlobais.fundoPadrao },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnVoltar: { flexDirection: 'row', alignItems: 'center' },
  txtVoltar: { color: '#6500B8', fontSize: 16, fontWeight: 'bold', marginLeft: 4 },
  statusBox: { flexDirection: 'row', gap: 8 },
  badgeTempo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  txtTempo: { fontSize: 13, fontWeight: 'bold', color: '#1E293B' },
  badgeXP: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  txtXP: { fontSize: 13, fontWeight: 'bold', color: '#B45309', fontFamily: fontesDestaque.bold },

  header: {
    marginBottom: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
  },
  subtitulo: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },

  tabuleiroContainer: {
    alignItems: 'center',
    marginBottom: 14,
  },
  linha: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  celula: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celulaSel: {
    backgroundColor: '#6500B8',
    borderColor: '#5700B8',
  },
  txtNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
  },
  txtBranco: {
    color: '#FFF',
  },

  alvoLinha: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    borderWidth: 2,
    borderColor: '#D8B4FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alvoLinhaOk: {
    backgroundColor: '#16A34A',
    borderColor: '#15803D',
  },
  labelLinha: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#6500B8',
  },
  numAlvo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6500B8',
  },

  linhaColunas: {
    flexDirection: 'row',
    gap: 8,
  },
  alvoColuna: {
    width: CELL_SIZE,
    height: Math.floor(CELL_SIZE * 0.8),
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    borderWidth: 2,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alvoColunaOk: {
    backgroundColor: '#16A34A',
    borderColor: '#15803D',
  },
  labelCol: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0369A1',
  },
  numAlvoCol: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0369A1',
  },

  boxErro: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  txtErro: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },

  acoesContainer: {
    marginTop: 'auto',
    gap: 10,
  },
  btnFinalizar: {
    backgroundColor: '#6500B8',
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtnFinalizar: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnReiniciar: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtBtnReiniciar: {
    color: '#6500B8',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Estilos do Modal de Vitória
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconeTrofeu: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },
  modalSubtitulo: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 18,
  },
  modalEstatisticas: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  btnProximo: {
    width: '100%',
    backgroundColor: '#6500B8',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  txtBtnProximo: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnModalSair: {
    paddingVertical: 8,
  },
  txtBtnModalSair: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },
});
