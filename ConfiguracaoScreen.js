import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from './themeContext'; // Importe o hook useTheme

export default function ConfiguracaoScreen() {
  const { theme, toggleTheme } = useTheme(); // Use o hook para acessar o tema

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
   
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, theme === 'dark' && styles.darkText]}>Modo Escuro</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={toggleTheme} // Alterna o tema
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', 
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#000',
  },
  darkText: {
    color: '#fff', 
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
    color: '#000',
  },
});