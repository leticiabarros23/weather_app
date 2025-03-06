# 🌦 Aplicativo de Previsão do Tempo

Este é um aplicativo mobile desenvolvido em **React Native** e **Expo**, que permite visualizar a previsão do tempo de diferentes cidades. Ele utiliza a **API OpenWeatherMap** para buscar informações como temperatura, descrição do clima e ícones representativos. O app também possibilita salvar cidades favoritas e acessá-las rapidamente.

---

## 🚀 Funcionalidades

- 🔍 Buscar informações climáticas de qualquer cidade.
- ⭐ Adicionar cidades favoritas para acesso rápido.
- 🗑️ Remover cidades favoritas da lista.
- 🎨 Interface intuitiva e responsiva.
- 🚀 Suporte para múltiplas cidades e atualização em tempo real.

---

## 🛠️ Tecnologias Utilizadas

- **React Native** – Framework para desenvolvimento mobile.
- **Expo** – Plataforma para desenvolvimento e testes rápidos.
- **React Navigation** – Gerenciamento de navegação entre telas.
- **AsyncStorage** – Armazenamento local persistente para favoritos.
- **OpenWeatherMap API** – API pública para informações meteorológicas.
- **@expo/vector-icons** – Conjunto de ícones para melhor usabilidade.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

1. **Node.js** (https://nodejs.org/)
2. **Expo CLI**: 
   ```sh
   npm install -g expo-cli
   ```
3. **Conta na OpenWeatherMap** para obter uma chave de API (https://openweathermap.org/api)

---

## ⚙️ Instalação

1. **Clone o repositório:**
   ```sh
   git clone https://https://github.com/leticiabarros23/weather_app.git
   cd weather_app
   ```
2. **Instale as dependências:**
   ```sh
   npm install
   ```
3. **Instale pacotes adicionais necessários:**
   ```sh
   expo install expo-location @react-native-async-storage/async-storage @expo/vector-icons
   ```
4. **Configuração do arquivo `.env`**
   - Crie um arquivo chamado `.env` na raiz do projeto e adicione:
     ```sh
     API_KEY=SUA_CHAVE_DE_API_AQUI
     ```

---

## ▶️ Executando o Aplicativo

1. **Inicie o Expo:**
   ```sh
   expo start
   ```
2. **Escaneie o QR Code** com o aplicativo Expo Go no celular ou rode no emulador.

---

## 📚 Como Usar

1. **Pesquisar cidade:** Digite o nome da cidade e pressione o botão de busca.
2. **Salvar Favoritos:** Clique no botão de salvar para adicionar a cidade na aba de favoritos.
3. **Remover Favoritos:** Clique no ícone de lixeira para excluir a cidade da lista de favoritos.

---

## 🐛 Tratamento de Erros

- ❌ **Cidade não encontrada:** O app exibirá um alerta informando que a cidade não existe.
- 🔌 **Erro de rede:** Caso a API falhe ou a conexão caia, o app exibe uma mensagem apropriada.




