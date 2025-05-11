import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing 
} from 'react-native-reanimated';

interface ProgressProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  height?: number;
  colors?: string[];
  style?: ViewStyle;
  labelStyle?: TextStyle;
  percentageStyle?: TextStyle;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  label,
  showPercentage = true,
  height = 8,
  colors,
  style,
  labelStyle,
  percentageStyle,
}) => {
  const { colors: themeColors } = useTheme();
  
  // Ensure value is between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);
  
  // Animation for progress width
  const progressWidth = useSharedValue(0);
  
  // Update progress width when value changes
  useEffect(() => {
    progressWidth.value = withTiming(clampedValue, {
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [clampedValue]);
  
  // Animated style for progress bar
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });
  
  // Default gradient colors based on theme
  const defaultColors = colors || [
    themeColors.primary,
    themeColors.primaryLight,
  ];
  
  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: themeColors.text }, labelStyle]}>
            {label}
          </Text>
          {showPercentage && (
            <Text style={[styles.percentage, { color: themeColors.textSecondary }, percentageStyle]}>
              {clampedValue}%
            </Text>
          )}
        </View>
      )}
      
      <View 
        style={[
          styles.progressContainer, 
          { 
            height, 
            backgroundColor: themeColors.border,
          }
        ]}
      >
        <Animated.View style={[styles.progressWrapper, animatedStyle]}>
          <LinearGradient
            colors={defaultColors as [import('react-native').ColorValue, import('react-native').ColorValue, ...(import('react-native').ColorValue[])]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progress}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '500',
  },
  progressContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressWrapper: {
    height: '100%',
    overflow: 'hidden',
    borderRadius: 4,
  },
  progress: {
    height: '100%',
    width: '100%',
  },
});

export default Progress;