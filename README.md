# 🏅 Olympic Hub

O **Olympic Hub** é um aplicativo mobile desenvolvido em **React Native e Expo**, com foco em Educação Financeira. Criado especialmente para auxiliar estudantes no aprendizado e na preparação para a **OLITEF (Olimpíada do Tesouro Direto de Educação Financeira)**, o aplicativo reúne conteúdos educativos, atividades interativas e simulados para tornar o estudo mais dinâmico e acessível.

## Funcionalidades

### Autenticação de Usuários
- Cadastro de novos usuários com validação de e-mail.
- Criptografia de senhas utilizando hash PBKDF2 com SHA-256 via `@noble/hashes`.
- Login seguro com banco de dados local.

### Painel Principal (Home)
- Contagem regressiva em tempo real para a data da OLITEF.
- Acesso rápido às seções de estudos e atividades.

### Trilhas de Aprendizagem
- Módulos organizados por categorias:
  - Educação Financeira;
  - Planejamento Financeiro;
  - Investimentos;
  - Consumo Consciente.

### Simulados Cronometrados
- Questões oficiais e preparatórias.
- Embaralhamento dinâmico de perguntas e alternativas a cada tentativa.
- Cronômetro configurado individualmente por simulado.
- Tela de resultados detalhada, com número de acertos, erros e porcentagem de aproveitamento.

### Artigos Educativos
- Conteúdos teóricos organizados em blocos estruturados.
- Formatação com títulos, destaques, listas e parágrafos para facilitar a leitura.

### Aulas e Jogos Educativos
- Seções interativas voltadas ao aprendizado lúdico.
- Atividades sobre finanças pessoais, economia e investimentos.

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Aplicação |
|---|---|
| React Native (v0.88.1) | Desenvolvimento mobile |
| Expo (SDK 58) | Framework e ambiente de desenvolvimento |
| JavaScript / ES6+ | Linguagem de programação |
| expo-sqlite | Gerenciamento de usuários e autenticação local |
| expo-crypto | Recursos de criptografia |
| @noble/hashes | Hash de senhas com PBKDF2 / SHA-256 |
| lucide-react-native | Biblioteca de ícones |
| react-native-svg | Renderização de elementos SVG |
| StyleSheet | Estilização nativa |

## 📁 Estrutura de Pastas

```text
Projeto_Mobile/
├── assets/                  # Ícones, splash screen e imagens do app
├── src/
│   ├── data/                # Dados estáticos em JSON (questões e artigos)
│   │   ├── artigos.json
│   │   └── questoes.json
│   ├── database/            # Configuração e queries SQLite
│   │   └── database.js
│   └── screens/             # Telas do aplicativo
│       ├── ArtigosScreen.js
│       ├── AulasScreen.js
│       ├── CadastroScreen.js
│       ├── DetalheEtapaScreen.js
│       ├── ExecutarSimuladoScreen.js
│       ├── HomeScreen.js
│       ├── JoguinhosScreen.js
│       ├── LerArtigoScreen.js
│       ├── LoginScreen.js
│       ├── SimuladosScreen.js
│       └── TrilhaScreen.js
├── App.js                   # Componente raiz e gerenciamento de navegação/estado
├── app.json                 # Configurações do Expo
├── package.json             # Dependências do projeto
└── README.md                # Documentação do projeto
```

## Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/go) no celular (iOS ou Android).


### 1. Clone o repositório

```bash
git clone <https://github.com/anafausta/Projeto_Mobile.git>
```

### 2. Acesse a pasta do projeto

```bash
cd Projeto_Mobile
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Inicie o servidor de desenvolvimento

```bash
npx expo start
```

### 5. Execute o aplicativo

Após iniciar o servidor, escolha uma das opções:

- **Dispositivo físico:** abra o Expo Go no celular e escaneie o QR Code exibido no terminal.

