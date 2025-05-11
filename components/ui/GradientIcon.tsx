import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';

interface GradientIconProps {
  icon: React.ReactNode;
  size?: number;
  colors?: string[];
  borderRadius?: number;
}

const GradientIcon: React.FC<GradientIconProps> = ({
  icon,
  size = 40,
  colors,
  borderRadius,
}) => {
  const { colors: themeColors } = useTheme();
  
  const gradientColors = colors || [
    themeColors.primary,
    themeColors.primaryDark,
  ];
  
  const borderRadiusValue = borderRadius || size / 2;
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors as [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          {
            width: size,
            height: size,
            borderRadius: borderRadiusValue,
          },
        ]}
      >
        <View style={styles.iconContainer}>
          {icon}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default GradientIcon;