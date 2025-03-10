import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './themeContext';

const API_KEY = '3d35324ff41939a57ae1b49008d79924';

export default function FavoritesScreen() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [loadingCity, setLoadingCity] = useState(null); 
  const navigation = useNavigation();
  const { theme } = useTheme();

  // Carregar cidades favoritas ao abrir a tela
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedCities = await AsyncStorage.getItem('favoriteCities');
        if (storedCities) {
          setFavoriteCities(JSON.parse(storedCities));
        }
      } catch (error) {
        console.error('Erro ao carregar cidades favoritas:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  async function updateWeather(cityName) {
    setLoadingCity(cityName); // Ativa o indicador de carregamento para essa cidade específica
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric&lang=pt`
      );
      const result = await res.json();

      if (result.cod === 200) {
        const updatedCities = favoriteCities.map(city =>
          city.name === cityName
            ? {
                ...city,
                temp: Math.round(result.main.temp), // Atualiza temperatura
                description: result.weather[0].description, // Atualiza descrição do clima
              }
            : city
        );

        await AsyncStorage.setItem('favoriteCities', JSON.stringify(updatedCities));
        setFavoriteCities(updatedCities);
      } else {
        alert('Erro ao buscar a previsão do tempo. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao atualizar clima:', error);
    }
    setLoadingCity(null); // Desativa o indicador de carregamento
  }

  async function removeFavorite(cityName) {
    try {
      const updatedCities = favoriteCities.filter(city => city.name !== cityName);
      await AsyncStorage.setItem('favoriteCities', JSON.stringify(updatedCities));
      setFavoriteCities(updatedCities);
    } catch (error) {
      alert('Erro ao remover cidade dos favoritos.');
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}> 
      <Text style={[styles.header, { color: theme.text }]}>Cidades Favoritas</Text>

      {favoriteCities.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.text }]}>Nenhuma cidade favoritada ainda.</Text>
      ) : (
        <FlatList
          data={favoriteCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.favoriteItem, { backgroundColor: theme.cardBackground }]}> 
              <View style={styles.cityButton}>
                <Feather name="star" size={20} color="gold" />
                <View>
                  <Text style={[styles.cityName, { color: theme.text }]}>{item.name}</Text>
                  <Text style={[styles.cityTemp, { color: theme.text }]}>{item.temp ? `${item.temp}°C - ${item.description}` : 'Sem dados'}</Text>
                  <Text style={[styles.cityDate, { color: theme.text }]}>
                    {item.date ? `Salvo em: ${item.date}` : null}
                  </Text>
                </View>
              </View>

              {/* Botão de atualizar clima */}
              <TouchableOpacity onPress={() => updateWeather(item.name)} style={styles.updateButton}>
                {loadingCity === item.name ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : (
                  <Feather name="refresh-cw" size={20} color={theme.text} />
                )}
              </TouchableOpacity>

              {/*  Botão de remover cidade */}
              <TouchableOpacity onPress={() => removeFavorite(item.name)}>
                <Feather name="trash-2" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1, 
    borderColor: 'black', 
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  cityTemp: {
    fontSize: 14,
    marginLeft: 8,
    fontStyle: 'italic',
  },
  cityDate: {
    fontSize: 12,
    marginLeft: 8,
    color: '#888',
  },
  updateButton: {
    marginHorizontal: 10,
  },
});
