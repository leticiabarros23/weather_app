import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from './themeContext'; 

export default function ConfiguracaoScreen() {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      
      {/* Modo Escuro com linha abaixo */}
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.text }]}>Modo Escuro</Text>
        <Switch
          value={theme.mode === "dark"}  
          onValueChange={toggleTheme}
        />
      </View>

      {/* Linha abaixo do Modo Escuro */}
      <View style={styles.divider} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5, // 🔹 Pequeno espaçamento antes da linha
  },
  settingText: {
    fontSize: 18,
  },
  divider: {
    borderBottomWidth: 1, // 🔹 Cria a linha
    borderBottomColor: '#ccc', // 🔹 Cor da linha
    marginVertical: 10, // 🔹 Espaço ao redor da linha
  },
});
