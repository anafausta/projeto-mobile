import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Check } from 'lucide-react-native';
import { BotaoVoltar, BotaoPrincipal, LinhaDivisoria } from '../components';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

const OPCOES = [1, 5, 10, 15, 20];

export default function SimuladosScreen({ voltar, irParaExecutarSimulado, online = true }) {
  const [qtd, setQtd] = useState(10);
  const [comTempo, setComTempo] = useState(true);

  const iniciar = () => {
    if (!online) {
      Alert.alert(
        'Conexão Necessária',
        'Conecte-se ao Wi-Fi ou rede celular para iniciar.',
        [{ text: 'Entendi' }]
      );
      return;
    }

    irParaExecutarSimulado({
      titulo: `Simulado (${qtd} questões)`,
      quantidade: qtd,
      comTempo,
      tempoMinutos: comTempo ? qtd * 5 : 0,
    });
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View>
          {/* Topo com botão voltar padrão */}
          <BotaoVoltar onPress={voltar} />

          <Text style={s.titulo}>Simulado</Text>
          <LinhaDivisoria />

          {/* Seletor de Questões */}
          <Text style={s.secao}>Quantidade de questões</Text>
          <Text style={s.subSecao}>Escolha quantas questões deseja resolver:</Text>

          <View style={s.grade}>
            {OPCOES.map((n) => {
              const ativo = qtd === n;
              return (
                <TouchableOpacity
                  key={n}
                  style={[s.opcao, n === 20 && s.opcaoLarga, ativo && s.opcaoAtiva]}
                  onPress={() => setQtd(n)}
                  activeOpacity={0.7}
                >
                  <Text style={[s.num, ativo && s.txtBranco]}>{n}</Text>
                  {ativo ? (
                    <Check color="#FFF" size={20} strokeWidth={2.5} />
                  ) : (
                    <Text style={s.legenda}>questões</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          <LinhaDivisoria />

          {/* Opção de Tempo */}
          <View style={s.linhaTempo}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={s.secao}>Com Cronômetro</Text>
            </View>
            <Switch
              value={comTempo}
              onValueChange={setComTempo}
              trackColor={{ true: '#5700B8', false: '#D1D5DB' }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        {/* Botão de Iniciar Padrão */}
        <BotaoPrincipal
          texto="Iniciar Simulado"
          onPress={iniciar}
          style={{ marginTop: 24 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: coresGlobais.fundoPadrao,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 24,
    justifyContent: 'space-between',
  },
  voltar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  txtVoltar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5700B8',
    marginLeft: 6,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5700B8',
    fontFamily: fontesDestaque.bold,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  linha: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 18,
  },
  secao: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: fontesDestaque.semiBold,
  },
  subSecao: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  grade: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  opcao: {
    width: '48%',
    height: 64,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  opcaoLarga: {
    width: '100%',
  },
  opcaoAtiva: {
    backgroundColor: '#5700B8',
    borderColor: '#5700B8',
  },
  num: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E293B',
    fontFamily: fontesDestaque.bold,
  },
  txtBranco: {
    color: '#FFF',
  },
  legenda: {
    fontSize: 12,
    color: '#94A3B8',
  },
  linhaTempo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  botao: {
    backgroundColor: '#5700B8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#5700B8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  txtBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
