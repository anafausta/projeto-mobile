import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://gbzslvmmwmripvhnjurs.supabase.co';

const supabaseAnonKey = (
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_KUYr4gf-KbW_Pu_UiYGFLg_8AU15795'
).trim();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Chave para cache local de artigos no AsyncStorage
export const STORAGE_ARTIGOS_CACHE = '@olitef_artigos_cache';

// Função auxiliar com Timeout para evitar que requisições fiquem travadas
export async function executarComTimeout(promessaOuQuery, ms = 8000) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => {
      const err = new Error('Tempo limite de conexão esgotado (timeout)');
      err.name = 'TimeoutError';
      reject(err);
    }, ms);
  });

  try {
    return await Promise.race([promessaOuQuery, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}

// Função para buscar as questões da nuvem e formatar para o simulado
export async function buscarQuestoesSupabase() {
  const consulta = supabase
    .from('questoes')
    .select('*')
    .order('id', { ascending: true });

  const { data, error } = await executarComTimeout(consulta, 8000);

  if (error) {
    console.error('Erro ao buscar questões do Supabase:', error);
    throw error;
  }

  // Converte o formato do banco para o mesmo formato que a sua tela de simulado
  return data.map((q) => ({
    id: q.id,
    enunciado: q.enunciado,
    alternativas: [
      { id: 'A', texto: q.alt_a },
      { id: 'B', texto: q.alt_b },
      { id: 'C', texto: q.alt_c },
      { id: 'D', texto: q.alt_d },
      { id: 'E', texto: q.alt_e },
    ],
    correta: q.correta,
  }));
}

// Função para buscar os artigos da nuvem diretamente 
export async function buscarArtigosSupabase() {
  const consulta = supabase
    .from('artigos')
    .select('*')
    .order('id', { ascending: true });

  const { data, error } = await executarComTimeout(consulta, 8000);

  if (error) {
    console.error('Erro ao buscar artigos do Supabase:', error);
    throw error;
  }

  // Garante que o conteudo seja um array (faz JSON.parse se vier como string)
  return data.map((artigo) => ({
    ...artigo,
    conteudo:
      typeof artigo.conteudo === 'string'
        ? JSON.parse(artigo.conteudo)
        : artigo.conteudo || [],
  }));
}

// 1. Lê imediatamente o cache local do AsyncStorage 
// 2. Tenta atualizar com a rede em segundo plano
// 3. Se estiver offline ou falhar, retorna com segurança os artigos em cache
export async function buscarArtigosComCache() {
  let cacheLocal = null;

  try {
    const textoCache = await AsyncStorage.getItem(STORAGE_ARTIGOS_CACHE);
    if (textoCache) {
      cacheLocal = JSON.parse(textoCache);
    }
  } catch (e) {
    console.log('Falha ao ler cache local de artigos:', e);
  }

  try {
    const dadosNovos = await buscarArtigosSupabase();
    // Salva no AsyncStorage para uso offline futuro
    await AsyncStorage.setItem(STORAGE_ARTIGOS_CACHE, JSON.stringify(dadosNovos));
    return { dados: dadosNovos, fonte: 'rede' };
  } catch (erroRede) {
    console.log('Falha na rede ao buscar artigos. Verificando cache...', erroRede?.message);
    if (cacheLocal && cacheLocal.length > 0) {
      return { dados: cacheLocal, fonte: 'cache' };
    }
    throw erroRede;
  }
}