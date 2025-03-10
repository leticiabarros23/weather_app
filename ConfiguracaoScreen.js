import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from './themeContext'; 

export default function ConfiguracaoScreen() {
  const { theme, toggleTheme } = useTheme(); 

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: theme.text }]}>Modo Escuro</Text>
        <Switch
          value={theme.mode === "dark"}  // ✅ Agora a checagem usará "mode"
          onValueChange={toggleTheme}
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
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingText: {
    fontSize: 18,
  },
});