import React, { useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { 
  useFonts, 
  Quicksand_700Bold, 
  Quicksand_600SemiBold 
} from '@expo-google-fonts/quicksand';

import { conectarBanco } from './src/database/database';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';
import TrilhaScreen from './src/screens/TrilhaScreen';
import DetalheTrilhaScreen from './src/screens/DetalheEtapaScreen';
import SimuladosScreen from './src/screens/SimuladosScreen';
import ExecutarSimuladoScreen from './src/screens/ExecutarSimuladoScreen';
import ArtigosScreen from './src/screens/ArtigosScreen';
import LerArtigoScreen from './src/screens/LerArtigoScreen';
import JoguinhosScreen from './src/screens/JoguinhosScreen';
import { buscarArtigosComCache } from './src/database/supabase';
import LerAulaScreen from './src/screens/LerAulaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import BottomNavBar from './src/components/BottomNavBar';
import BannerOffline from './src/components/BannerOffline';
import useOnline from './src/hooks/useOnline';
import { coresGlobais } from './src/theme/identidadeVisual';

const getStorageAulasKey = (userId) => `@app_user_${userId}_aulas_concluidas`;
const getStorageSimuladosKey = (userId) => `@app_user_${userId}_simulados_historico`;
const getStorageXpKey = (userId) => `@app_user_${userId}_xp_total`;

// Mapeamento ultraleve de navegação reversa (consumo de memória próximo de zero)
const MAPA_VOLTAR = {
  cadastro: 'login',
  trilhas_lista: 'home',
  trilhas_detalhe: 'trilhas_lista',
  trilhas_aula_leitura: 'trilhas_detalhe',
  simulados_lista: 'home',
  simulados_execucao: 'simulados_lista',
  artigos_lista: 'home',
  artigos_leitura: 'artigos_lista',
  joguinhos: 'home',
  perfil: 'home',
};


export default function App() {

  const [fontesCarregadas] = useFonts({
    Quicksand_700Bold,
    Quicksand_600SemiBold,
  });

  const online = useOnline();
  const [tela, setTela] = useState('login');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const [simuladoSelecionado, setSimuladoSelecionado] = useState(null);
  const [artigoSelecionado, setArtigoSelecionado] = useState(null);
  const [trilhaSelecionadaKey, setTrilhaSelecionadaKey] = useState(null);
  const [artigosGlobais, setArtigosGlobais] = useState([]);
  const [aulaSelecionada, setAulaSelecionada] = useState(null);
  const [aulasConcluidas, setAulasConcluidas] = useState([]);
  const [simuladosConcluidos, setSimuladosConcluidos] = useState([]);
  const [pontosXP, setPontosXP] = useState(0);

  useEffect(() => {
    iniciarBanco();
  }, []);

  async function iniciarBanco() {
    try {
      await conectarBanco();
      console.log('Banco conectado!');
      
      // Carrega os artigos em segundo plano com estratégia Cache Primeiro!
      const resArtigos = await buscarArtigosComCache();
      if (resArtigos?.dados) {
        // Pega somente os artigos da Home (se tiver coluna 'tipo', usa ela; senão usa id <= 4)
        setArtigosGlobais(
          resArtigos.dados.filter((a) => (a.tipo ? a.tipo === 'artigo' : a.id <= 4))
        );
      }
    } catch (error) {
      console.log('Erro ao iniciar dados:', error);
    }
  }

  // Tratamento do botão Voltar do Android (100% seguro para iOS, sem consumo de RAM)
  useEffect(() => {
    const tratarBotaoVoltar = () => {
      if (MAPA_VOLTAR[tela]) {
        if (tela === 'trilhas_aula_leitura') {
          voltarParaDetalheTrilha();
        } else if (tela === 'trilhas_detalhe') {
          voltarParaListaTrilhas();
        } else if (tela === 'simulados_execucao') {
          voltarParaListaSimulados();
        } else if (tela === 'artigos_leitura') {
          voltarParaListaArtigos();
        } else if (tela === 'cadastro') {
          irParaLogin();
        } else {
          voltarParaHome();
        }
        return true; // Bloqueia o fechamento do app no Android
      }
      return false; // Na Home ou Login, permite ao Android fechar o app normalmente
    };

    const subscricao = BackHandler.addEventListener('hardwareBackPress', tratarBotaoVoltar);
    return () => subscricao.remove(); // Limpeza imediata ao trocar de tela
  }, [tela]);

  // Carrega o progresso salvo exclusivamente para o usuário que acabou de logar
  async function carregarDadosDoUsuario(userId) {
    if (!userId) return;
    try {
      const [aulasSalvas, simuladosSalvos, xpSalvo] = await Promise.all([
        AsyncStorage.getItem(getStorageAulasKey(userId)),
        AsyncStorage.getItem(getStorageSimuladosKey(userId)),
        AsyncStorage.getItem(getStorageXpKey(userId)),
      ]);

      setAulasConcluidas(aulasSalvas ? JSON.parse(aulasSalvas) : []);
      setSimuladosConcluidos(simuladosSalvos ? JSON.parse(simuladosSalvos) : []);
      setPontosXP(xpSalvo ? JSON.parse(xpSalvo) : 0);
    } catch (e) {
      console.error('Erro ao carregar dados do usuário:', e);
    }
  }

  // --- NAVEGAÇÃO DE AUTENTICAÇÃO E HOME ---
  function irParaCadastro() {
    setTela('cadastro');
  }

  function irParaLogin() {
    setTela('login');
  }

  function irParaHome(usuario) {
    setUsuarioLogado(usuario);
    if (usuario?.id) {
      carregarDadosDoUsuario(usuario.id);
    }
    setTela('home');
  }

  function voltarParaHome() {
    setTela('home');
  }

  // --- NAVEGAÇÃO DAS TRILHAS ---
  function irParaTrilha() {
    setTrilhaSelecionadaKey(null);
    setAulaSelecionada(null);
    setTela('trilhas_lista');
  }

  function irParaDetalheTrilha(trilhaKey) {
    setTrilhaSelecionadaKey(trilhaKey);
    setTela('trilhas_detalhe');
  }

  function voltarParaListaTrilhas() {
    setTrilhaSelecionadaKey(null);
    setTela('trilhas_lista');
  }

  // --- NAVEGAÇÃO DOS SIMULADOS ---
  function irParaSimulados() {
    setSimuladoSelecionado(null);
    setTela('simulados_lista');
  }

  function irParaExecutarSimulado(simulado) {
    setSimuladoSelecionado(simulado);
    setTela('simulados_execucao');
  }

  function voltarParaListaSimulados() {
    setSimuladoSelecionado(null);
    setTela('simulados_lista');
  }

  // --- NAVEGAÇÃO DOS ARTIGOS ---
  function irParaArtigos() {
    setArtigoSelecionado(null);
    setTela('artigos_lista');
  }

  function irParaLerArtigo(artigo) {
    setArtigoSelecionado(artigo);
    setTela('artigos_leitura');
  }

  function voltarParaListaArtigos() {
    setArtigoSelecionado(null);
    setTela('artigos_lista');
  }

  function irParaPerfil() {
    setTela('perfil');
  }

  function deslogar() {
    setUsuarioLogado(null);
    setAulasConcluidas([]);
    setSimuladosConcluidos([]);
    setPontosXP(0);
    setTela('login');
  }

  function irParaJoguinhos() {
    setTela('joguinhos');
  }
  function irParaLerAula(aula) {
    setAulaSelecionada(aula);
    setTela('trilhas_aula_leitura');
  }

  function voltarParaDetalheTrilha() {
    setAulaSelecionada(null);
    setTela('trilhas_detalhe');
  }

  async function adicionarXP(qtd) {
    if (!qtd || qtd <= 0) return;
    setPontosXP((prev) => {
      const novoTotal = prev + qtd;
      if (usuarioLogado?.id) {
        AsyncStorage.setItem(getStorageXpKey(usuarioLogado.id), novoTotal.toString()).catch((e) =>
          console.log('Erro ao salvar XP:', e)
        );
      }
      return novoTotal;
    });
  }

  async function concluirAula(aulaId) {
    if (!aulasConcluidas.includes(aulaId)) {
      const novaLista = [...aulasConcluidas, aulaId];
      setAulasConcluidas(novaLista);
      adicionarXP(15); // +15 XP ao concluir nova aula da trilha
      if (usuarioLogado?.id) {
        try {
          await AsyncStorage.setItem(getStorageAulasKey(usuarioLogado.id), JSON.stringify(novaLista));
        } catch (e) {
          console.log('Erro ao salvar aula concluída:', e);
        }
      }
    }
    voltarParaDetalheTrilha();
  }

  async function registrarSimuladoConcluido(resultado) {
    const novoHistorico = [resultado, ...simuladosConcluidos];
    setSimuladosConcluidos(novoHistorico);
    if (resultado?.pontos > 0) {
      adicionarXP(resultado.pontos); // Adiciona os pontos conquistados no simulado!
    }
    if (usuarioLogado?.id) {
      try {
        await AsyncStorage.setItem(getStorageSimuladosKey(usuarioLogado.id), JSON.stringify(novoHistorico));
      } catch (e) {
        console.log('Erro ao salvar simulado concluído:', e);
      }
    }
  }
  const mostrarNavBar =
    tela !== 'login' &&
    tela !== 'cadastro' &&
    tela !== 'simulados_execucao';

  if (!fontesCarregadas) {
    return (
      <View style={[styles.appContainer, { backgroundColor: coresGlobais.fundoPadrao }]} />
    );
  }

  return (
    <View style={styles.appContainer}>
      {mostrarNavBar && <BannerOffline online={online} />}
      <View style={styles.telaContainer}>
        {tela === 'login' ? (
          <LoginScreen
            irParaCadastro={irParaCadastro}
            irParaHome={irParaHome}
          />
        ) : tela === 'cadastro' ? (
          <CadastroScreen
            irParaLogin={irParaLogin}
          />
        ) : tela === 'trilhas_lista' ? (
          <TrilhaScreen
            voltar={voltarParaHome}
            irParaDetalheTrilha={irParaDetalheTrilha}
          />
        ) : tela === 'trilhas_detalhe' ? (
          <DetalheTrilhaScreen
            trilhaKey={trilhaSelecionadaKey}
            voltarParaLista={voltarParaListaTrilhas}
            irParaLerAula={irParaLerAula}
            aulasConcluidas={aulasConcluidas}
          />
        ) : tela === 'trilhas_aula_leitura' ? (
          <LerAulaScreen
            aula={aulaSelecionada}
            voltarParaTrilha={voltarParaDetalheTrilha}
            onConcluirAula={concluirAula}
          />
        ) : tela === 'simulados_lista' ? (
          <SimuladosScreen 
            voltar={voltarParaHome} 
            irParaExecutarSimulado={irParaExecutarSimulado} 
            online={online}
          />
        ) : tela === 'simulados_execucao' ? (
          <ExecutarSimuladoScreen 
            simulado={simuladoSelecionado} 
            voltarParaLista={voltarParaListaSimulados}
            onFinalizarSimulado={registrarSimuladoConcluido}
          />
        ) : tela === 'artigos_lista' ? (
          <ArtigosScreen 
            voltar={voltarParaHome} 
            irParaLerArtigo={irParaLerArtigo} 
            artigosIniciais={artigosGlobais}
            online={online}
          />
        ) : tela === 'artigos_leitura' ? (
          <LerArtigoScreen 
            artigo={artigoSelecionado} 
            voltarParaLista={voltarParaListaArtigos} 
          />
        ) : tela === 'joguinhos' ? (
          <JoguinhosScreen
            voltar={voltarParaHome}
            onGanharXP={adicionarXP}
          />
        ) : tela === 'perfil' ? (
          <PerfilScreen
            usuario={usuarioLogado}
            voltar={voltarParaHome}
            deslogar={deslogar}
            totalAulasConcluidas={aulasConcluidas.length}
            pontosXP={pontosXP}
          />
        ) : (
          <HomeScreen
            usuario={usuarioLogado}
            pontosXP={pontosXP}
            irParaTrilha={irParaTrilha}
            irParaSimulados={irParaSimulados}
            irParaArtigos={irParaArtigos}
            irParaJoguinhos={irParaJoguinhos}
            irParaPerfil={irParaPerfil}
          />
        )}
      </View>

      {mostrarNavBar && (
        <BottomNavBar
          telaAtual={tela}
          irParaHome={voltarParaHome}
          irParaTrilha={irParaTrilha}
          irParaSimulados={irParaSimulados}
          irParaArtigos={irParaArtigos}
          irParaPerfil={irParaPerfil}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: coresGlobais.fundoPadrao,
  },
  telaContainer: {
    flex: 1,
  },
});