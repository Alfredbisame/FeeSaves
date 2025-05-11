import { Platform } from 'react-native';

// Color palette definition
export const Colors = {
  light: {
    primary: '#E53935', // Main red
    primaryLight: '#FF6F60',
    primaryDark: '#AB000D',
    secondary: '#FFFFFF', // White
    secondaryLight: '#FFFFFF',
    secondaryDark: '#F5F5F5',
    accent: '#FF9800', // Orange for accents
    background: '#FFFFFF',
    card: '#F8F9FA',
    text: '#212121',
    textSecondary: '#757575',
    border: '#E0E0E0',
    notification: '#E53935',
    success: '#4CAF50',
    warning: '#FFC107',
    error: '#E53935',
    info: '#2196F3',
    overlay: 'rgba(0, 0, 0, 0.3)',
    backdrop: 'rgba(255, 255, 255, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.1)',
  },
  dark: {
    primary: '#FF5252', // Brighter red for dark mode
    primaryLight: '#FF867F',
    primaryDark: '#CB0000',
    secondary: '#212121', // Dark gray
    secondaryLight: '#484848',
    secondaryDark: '#000000',
    accent: '#FFB74D', // Lighter orange for dark mode
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#333333',
    notification: '#FF5252',
    success: '#66BB6A',
    warning: '#FFD54F',
    error: '#FF5252',
    info: '#42A5F5',
    overlay: 'rgba(0, 0, 0, 0.5)',
    backdrop: 'rgba(18, 18, 18, 0.8)',
    shadow: 'rgba(0, 0, 0, 0.2)',
  },
};

// Typography definition
export const Typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 30,
    '5xl': 36,
  },
  lineHeight: {
    tight: 1.2, // For headings
    normal: 1.5, // For body text
    relaxed: 1.75, // For more readable text
  },
};

// Spacing system based on 8px increment
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 56,
  '5xl': 64,
};

// Rounded corners
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Shadow styles for different platforms
export const Shadows = {
  light: Platform.select({
    ios: {
      sm: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      md: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      lg: {
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 6 },
    },
    web: {
      sm: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
      },
      md: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      lg: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    },
    default: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 6 },
    },
  }),
  dark: Platform.select({
    ios: {
      sm: {
        shadowColor: Colors.dark.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
      },
      md: {
        shadowColor: Colors.dark.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.35,
        shadowRadius: 3.84,
      },
      lg: {
        shadowColor: Colors.dark.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
    },
    android: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 6 },
    },
    web: {
      sm: {
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
      },
      md: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      },
      lg: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      },
    },
    default: {
      sm: { elevation: 2 },
      md: { elevation: 4 },
      lg: { elevation: 6 },
    },
  }),
};

// Layout constants
export const Layout = {
  window: {
    width: '100%',
    height: '100%',
  },
  isSmallDevice: false, // This would be dynamically determined
};

// Animation timing
export const Animation = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Export default theme object
export default {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Layout,
  Animation,
};