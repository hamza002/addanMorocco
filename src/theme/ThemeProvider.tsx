import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import {lightColors, darkColors, ColorScheme} from './colors';
import {loadSettings, saveSettings} from '../storage/settings';

interface ThemeContextType {
  colors: ColorScheme;
  isDark: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  colors: lightColors,
  isDark: false,
  toggleDarkMode: () => {},
  setDarkMode: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const systemScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemScheme === 'dark');

  useEffect(() => {
    loadSettings().then(settings => {
      if (settings.darkMode !== undefined) {
        setIsDark(settings.darkMode);
      } else {
        setIsDark(systemScheme === 'dark');
      }
    });
  }, [systemScheme]);

  const toggleDarkMode = () => {
    const next = !isDark;
    setIsDark(next);
    saveSettings({darkMode: next});
  };

  const setDarkMode = (value: boolean) => {
    setIsDark(value);
    saveSettings({darkMode: value});
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: isDark ? darkColors : lightColors,
        isDark,
        toggleDarkMode,
        setDarkMode,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
