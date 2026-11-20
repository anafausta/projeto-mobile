
import * as SQLite from 'expo-sqlite'; //importação do sqlite do expo

let db; //cria uma variável para armazenar a conexão com o banco de dados

export async function conectarBanco() { //função assíncrona para conectar ao banco de dados
  db = await SQLite.openDatabaseAsync('meu_aplicativo.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      usuario TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      senha_hash TEXT NOT NULL
    );
  `);

  console.log('Banco de dados conectado!');
}

export function obterBanco() {
  if (!db) {
    throw new Error('Banco de dados não conectado!');
  }

  return db;
}

export async function cadastrarUsuario(nome, usuario, email, senhaHash) {

  const db = obterBanco();

  await db.runAsync(
    `INSERT INTO usuarios (nome, usuario, email, senha_hash)
     VALUES (?, ?, ?, ?)`,
    [nome, usuario, email, senhaHash]
  );

  

}
export async function buscarUsuario(identificador) {
  const db = obterBanco();

  const usuario = await db.getFirstAsync(
    `SELECT * FROM usuarios
     WHERE usuario = ? OR email = ?`,
    [identificador, identificador]
  );

  return usuario;
}

export async function listarUsuarios() {
  const db = obterBanco();

  const usuarios = await db.getAllAsync(
    'SELECT id, nome, usuario, email FROM usuarios'
  );

  return usuarios;
}