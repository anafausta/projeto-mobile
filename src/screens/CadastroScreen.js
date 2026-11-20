import React, { useState, useRef } from 'react';
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
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes, bytesToHex } from '@noble/hashes/utils.js';

import { cadastrarUsuario } from '../database/database';
import { coresGlobais, fontesDestaque } from '../theme/identidadeVisual';

async function gerarHashSenha(senha) {
  const salt = await Crypto.getRandomBytesAsync(16);

  const hash = await pbkdf2Async(
    sha256,
    utf8ToBytes(senha),
    salt,
    {
      c: 5000,
      dkLen: 32,
    }
  );

  return `${bytesToHex(salt)}:${bytesToHex(hash)}`;
}

export default function CadastroScreen({ irParaLogin }) {
  const [nome, setNome] = useState('');
  const [usuario, setUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  
  const inputUsuarioRef = useRef(null);
  const inputEmailRef = useRef(null);
  const inputSenhaRef = useRef(null);

  function validarEmail(emailStr) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(emailStr);
  }

  async function handleCadastro() {
    try {
      if (!nome || !usuario || !email || !senha) {
        Alert.alert('Atenção', 'Preencha todos os campos!');
        return;
      }

      if (!validarEmail(email)) {
        Alert.alert('E-mail inválido', 'Por favor, insira um endereço de e-mail válido (ex: seu@email.com)');
        return;
      }

      const senhaHash = await gerarHashSenha(senha);

      await cadastrarUsuario(nome, usuario, email, senhaHash);

      Keyboard.dismiss();
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      
      if (irParaLogin) {
        irParaLogin();
      }
    } catch (error) {
      if (error?.message?.includes('UNIQUE constraint failed')) {
        Alert.alert('Atenção', 'Este nome de usuário ou e-mail já está em uso.');
      } else {
        Alert.alert('Erro no cadastro', 'Não foi possível concluir o cadastro. Tente novamente.');
      }
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
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.titulo}>Criar conta</Text>
            <Text style={styles.subtitulo}>Preencha os dados para realizar o cadastro</Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nome completo"
              placeholderTextColor="#A0AEC0"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => inputUsuarioRef.current?.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              ref={inputUsuarioRef}
              style={styles.input}
              placeholder="Nome de usuário"
              placeholderTextColor="#A0AEC0"
              value={usuario}
              onChangeText={setUsuario}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => inputEmailRef.current?.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              ref={inputEmailRef}
              style={styles.input}
              placeholder="E-mail"
              placeholderTextColor="#A0AEC0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="next"
              onSubmitEditing={() => inputSenhaRef.current?.focus()}
              blurOnSubmit={false}
            />

            <TextInput
              ref={inputSenhaRef}
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#A0AEC0"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleCadastro}
            />

            <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
              <Text style={styles.textoBotao}>Cadastrar</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.textoComum}>Já tem uma conta? </Text>
              <Pressable onPress={irParaLogin}>
                <Text style={styles.linkLogin}>Entrar</Text>
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
    marginBottom: 25,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#6500B8',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#5700B8',
    overflow: 'hidden',
  },
  logoImage: {
    width: 80,
    height: 80,
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
    marginBottom: 12,
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  textoComum: {
    color: '#777777',
    fontSize: 15,
  },
  linkLogin: {
    color: '#6500B8',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: fontesDestaque.bold,
  },
});