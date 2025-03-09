import React, { useState, useEffect } from 'react';
import { 
  ActivityIndicator, Image, StyleSheet, Text, TextInput, 
  TouchableOpacity, View, KeyboardAvoidingView, ScrollView, Platform 
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Importando as telas
import FavoritesScreen from './FavoritesScreen';
import ConfiguracaoScreen from './ConfiguracaoScreen'; 
import { ThemeProvider, useTheme } from './themeContext'; // Importa o contexto do tema

const API_KEY = '3d35324ff41939a57ae1b49008d79924';

// Defina a função ClimaScreen separada do componente de navegação
function ClimaScreen() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const { theme } = useTheme(); // Obtém o tema atual
 
  // Buscar a previsão do tempo para a cidade digitada
  async function fetchWeather(cityName) {
    if (!cityName.trim()) {
      setErrorMessage('Por favor, digite uma cidade válida.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt`
      );
      const result = await res.json();

      if (result.cod !== 200) {
        setErrorMessage('Cidade não encontrada.');
        setWeatherData(null);
      } else {
        setWeatherData(result);
      }
    } catch (error) {
      setErrorMessage('Erro ao buscar os dados.');
    }

    setLoading(false);
  }

  //  Salvar cidade como favorita no AsyncStorage
  async function saveFavoriteCity() {
    if (!weatherData) return;

    try {
      const storedCities = await AsyncStorage.getItem('favoriteCities');
      let favoriteCities = storedCities ? JSON.parse(storedCities) : [];

      // Verifica se a cidade já está na lista
      if (!favoriteCities.some(city => city.name === weatherData.name)) {
        favoriteCities.push({ name: weatherData.name });

        await AsyncStorage.setItem('favoriteCities', JSON.stringify(favoriteCities));
        alert('Cidade salva nos favoritos!');
      } else {
        alert('Esta cidade já está nos favoritos.');
      }
    } catch (error) {
      alert('Erro ao salvar cidade nos favoritos.');
    }
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'android' ? 'padding' : 'height'} 
      style={[styles.container, { backgroundColor: theme.background }]} // Aplica o fundo do tema ao container principal
    >
      <ScrollView 
        contentContainerStyle={[styles.scrollView, { backgroundColor: theme.background }]} // Garante o fundo correto no ScrollView também
        keyboardShouldPersistTaps="handled"
      >
        {/* Input de pesquisa */}
        <View style={[styles.searchContainer, { backgroundColor: theme.inputBackground }]}>
          <TextInput
            placeholder="Pesquisar cidade..."
            placeholderTextColor={theme.inputPlaceholder}
            style={[styles.input, { color: theme.text }]} // Cor do texto conforme tema
            value={city}
            onChangeText={setCity}
          />
          <TouchableOpacity onPress={() => fetchWeather(city)} style={styles.searchButton}>
            {loading ? <ActivityIndicator color={theme.text} size={24} /> : <Feather name="search" size={24} color={theme.text} />}
          </TouchableOpacity>
        </View>

        {errorMessage && <Text style={[styles.errorText, { color: theme.errorText }]}>{errorMessage}</Text>}

        {weatherData && (
          <View style={[styles.weatherCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.cityName, { color: theme.text }]}>{weatherData.name}</Text>
            <Text style={[styles.temperature, { color: theme.text }]}>{Math.round(weatherData.main.temp)}ºC</Text>
            <Image
              style={styles.weatherIcon}
              source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` }}
            />
            <Text style={[styles.weatherDescription, { color: theme.text }]}>{weatherData.weather[0].description}</Text>

            {/* 🔹 Botão para salvar a cidade como favorita */}
            <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: theme.buttonBackground }]} onPress={saveFavoriteCity}>
              <Text style={[styles.favoriteText, { color: theme.buttonText }]}>Salvar como Favorito</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Componente de navegação separado que utiliza o tema
function AppNavigator() {
  const { theme } = useTheme();
  const Tab = createBottomTabNavigator();
  
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { 
            backgroundColor: theme.tabBarBackground || '#f7f7f7', 
            borderTopWidth: 0 
          },
          tabBarActiveTintColor: theme.tabBarActiveColor || '#333',
          tabBarInactiveTintColor: theme.tabBarInactiveColor || '#999',
          headerStyle: {
            backgroundColor: theme.background || '#fff',
          },
          headerTintColor: theme.text || '#333',
        }}
      >
        <Tab.Screen 
          name="Clima" 
          component={ClimaScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Feather name="cloud" size={24} color={color} />,
            headerStyle: {
              backgroundColor: theme.background || '#fff',
            },
            headerTintColor: theme.text || '#333',
          }} 
        />
        <Tab.Screen 
          name="Favoritos" 
          component={FavoritesScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Feather name="star" size={24} color={color} />,
            headerStyle: {
              backgroundColor: theme.background || '#fff',
            },
            headerTintColor: theme.text || '#333',
          }} 
        />
        <Tab.Screen 
          name="Configurações" 
          component={ConfiguracaoScreen} 
          options={{ 
            tabBarIcon: ({ color }) => <Feather name="settings" size={24} color={color} />,
            headerStyle: {
              backgroundColor: theme.background || '#fff',
            },
            headerTintColor: theme.text || '#333',
          }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// Componente App principal
export default function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 15,
    width: 280,
    height: 50,
    paddingHorizontal: 15,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  searchButton: {
    padding: 10,
  },
  errorText: {
    fontSize: 16,
    marginVertical: 10,
  },
  weatherCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: 250,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  cityName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 35,
    fontWeight: '700',
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  weatherDescription: {
    fontSize: 18,
    textTransform: 'capitalize',
    marginTop: 5,
  },
  favoriteButton: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: '#777',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
});