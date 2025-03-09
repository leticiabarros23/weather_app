import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from './themeContext';

export default function FavoritesScreen() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const navigation = useNavigation();
  const { theme } = useTheme();

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
              <TouchableOpacity
                style={styles.cityButton}
                onPress={() => navigation.navigate('Clima', { cityName: item.name })}
              >
                <Feather name="star" size={20} color="gold" />
                <Text style={[styles.cityName, { color: theme.text }]}>{item.name}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeFavorite(item.name)}>
                <Feather name="trash-2" size={20} color={theme.text} />
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
    elevation: 2,
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
