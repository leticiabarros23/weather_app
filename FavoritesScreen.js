import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


export default function FavoritesScreen() {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const navigation = useNavigation();


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
    <View style={styles.container}>
      <Text style={styles.header}>Cidades Favoritas</Text>


      {favoriteCities.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma cidade favoritada ainda.</Text>
      ) : (
        <FlatList
          data={favoriteCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              {/* 🔹 Exibe apenas o nome da cidade */}
              <TouchableOpacity
                style={styles.cityButton}
                onPress={() => navigation.navigate('Clima', { cityName: item.name })}
              >
                <Feather name="star" size={20} color="gold" />
                <Text style={styles.cityName}>{item.name}</Text>
              </TouchableOpacity>


              {/* 🔹 Botão de remover (ícone de lixeira) */}
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
    backgroundColor: '#f5f5f5',
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


