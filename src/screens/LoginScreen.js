import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView
} from 'react-native';


import * as Crypto from 'expo-crypto';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes, bytesToHex, hexToBytes } from '@noble/hashes/utils.js';

import { buscarUsuario } from '../database/database';

async function verificarSenha(senhaDigitada, senhaArmazenada) {
    const [saltHex, hashArmazenado] = senhaArmazenada.split(':');
    const salt = hexToBytes(saltHex);
    const hashCalculado = await pbkdf2Async(
        sha256,
        utf8ToBytes(senhaDigitada),
        salt,
        {
            c: 5000,
            dkLen: 32,
        }
    );
    return bytesToHex(hashCalculado) === hashArmazenado;
}

export default function LoginScreen({irParaCadastro, irParaHome}) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    try {
      if (!usuario || !senha) {
        Alert.alert('Atenção', 'Preencha usuário e senha!');
        return;
      }

      const usuarioEncontrado = await buscarUsuario(usuario);

      if (!usuarioEncontrado) {
        Alert.alert('Erro ao entrar', 'E-mail ou senha inválidos.');
        return;
      }

      const senhaCorreta = await verificarSenha(
        senha,
        usuarioEncontrado.senha_hash
      );

      if (!senhaCorreta) {
        Alert.alert('Erro ao entrar', 'E-mail ou senha inválidos.');
        return;
      }

      // Fecha o teclado ao fazer o login com sucesso
      Keyboard.dismiss();
      irParaHome(usuarioEncontrado);
    } catch (error) {
      console.log('Erro no login:', error);
      Alert.alert('Erro', 'Não foi possível realizar o login.');
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Image
                source={require('../../assets/logo-olympic-hub.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.titulo}>Bem-vindo!</Text>
            <Text style={styles.subtitulo}>Entre na sua conta para continuar</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Usuário ou e-mail"
              placeholderTextColor="#A0AEC0"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#A0AEC0"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
            />

            <TouchableOpacity style={styles.botao} onPress={handleLogin}>
              <Text style={styles.textoBotao}>Entrar</Text>
            </TouchableOpacity>

            <View style={styles.cadastroContainer}>
              <Text style={styles.textoComum}>Não tem uma conta? </Text>
              <Pressable onPress={irParaCadastro}>
                <Text style={styles.linkCadastro}>Cadastre-se</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: coresGlobais.fundoPadrao, 
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 35,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#6500B8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#5700B8',
    overflow: 'hidden',
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoTexto: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333333',
    fontFamily: fontesDestaque.bold,
    marginBottom: 6,
  },
  subtitulo: {
    fontSize: 15,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 15,
    color: '#333333',
  },
  botao: {
    backgroundColor: '#6500B8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.semiBold,
  },
  cadastroContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  textoComum: {
    color: '#777777',
    fontSize: 15,
  },
  linkCadastro: {
    color: '#6500B8',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.bold,
  }
});