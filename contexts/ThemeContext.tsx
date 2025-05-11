import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';

// Define theme types
type ThemeType = 'light' | 'dark' | 'system';
type ColorSchemeType = 'light' | 'dark';

// Define the context interface
interface ThemeContextProps {
  theme: ThemeType;
  colorScheme: ColorSchemeType;
  colors: typeof Colors.light | typeof Colors.dark;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextProps>({
  theme: 'system',
  colorScheme: 'light',
  colors: Colors.light,
  setTheme: () => {},
  toggleTheme: () => {},
});

// ThemeProvider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get the system color scheme
  const systemColorScheme = useColorScheme() as ColorSchemeType || 'light';
  
  // State for the theme preference and actual color scheme
  const [theme, setTheme] = useState<ThemeType>('system');
  const [colorScheme, setColorScheme] = useState<ColorSchemeType>(systemColorScheme);

  // Effect to update color scheme when theme or system color scheme changes
  useEffect(() => {
    if (theme === 'system') {
      setColorScheme(systemColorScheme);
    } else {
      setColorScheme(theme as ColorSchemeType);
    }
  }, [theme, systemColorScheme]);

  // Get the appropriate colors based on the color scheme
  const colors = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'system') return 'light';
      if (prevTheme === 'light') return 'dark';
      return 'system';
    });
  };

  // Context value
  const contextValue: ThemeContextProps = {
    theme,
    colorScheme,
    colors,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;