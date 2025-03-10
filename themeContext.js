import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext();

const lightTheme = {
  mode: "light",  // ✅ Adicionado modo para checagem no Switch
  background: "#fff",
  text: "#000",
  inputBackground: "#eee",
  inputPlaceholder: "#aaa",
  buttonBackground: "#ddd",
  buttonText: "#000",
  errorText: "#f00",
};

const darkTheme = {
  mode: "dark",  // ✅ Adicionado modo para checagem no Switch
  background: "#000",
  text: "#fff",
  inputBackground: "#333",
  inputPlaceholder: "#888",
  buttonBackground: "#444",
  buttonText: "#fff",
  errorText: "#f00",
};

export function ThemeProvider({ children }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState(lightTheme);

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedTheme === 'dark') {
        setTheme(darkTheme);
      } else {
        setTheme(lightTheme);
      }
    };

    loadTheme();
  }, [systemColorScheme]);

  function toggleTheme() {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    AsyncStorage.setItem('theme', newTheme === lightTheme ? 'light' : 'dark');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
