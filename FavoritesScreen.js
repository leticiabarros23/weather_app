import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './themeContext'; // Importe o hook useTheme

export default function FavoritesScreen() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme(); // Pega o tema atual

  // 🔹 Carregar favoritos do AsyncStorage
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

    // Atualiza a lista sempre que a tela for focada
    const unsubscribe = navigation.addListener('focus', loadFavorites);

    return unsubscribe;
  }, [navigation]);

  // 🔹 Remover uma cidade da lista de favoritos
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
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.header, theme === 'dark' && styles.darkText]}>Cidades Favoritas</Text>

      {favoriteCities.length === 0 ? (
        <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>Nenhuma cidade favoritada ainda.</Text>
      ) : (
        <FlatList
          data={favoriteCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={[styles.favoriteItem, theme === 'dark' && styles.darkItem]}>
              {/* 🔹 Exibe apenas o nome da cidade */}
              <TouchableOpacity
                style={styles.cityButton}
                onPress={() => navigation.navigate('Clima', { cityName: item.name })}
              >
                <Feather name="star" size={20} color="gold" />
                <Text style={[styles.cityName, theme === 'dark' && styles.darkText]}>{item.name}</Text>
              </TouchableOpacity>

              {/* 🔹 Botão de remover (ícone de lixeira) */}
              <TouchableOpacity onPress={() => removeFavorite(item.name)}>
                <Feather name="trash-2" size={20} color={theme === 'dark' ? '#fff' : 'red'} />
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
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#777',
    marginTop: 20,
  },
  favoriteItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 2,
  },
  darkItem: {
    backgroundColor: '#444',
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
});

