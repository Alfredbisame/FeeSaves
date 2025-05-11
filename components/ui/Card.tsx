import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'outlined';
  intensity?: number;
  animated?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  intensity = 20,
  animated = false,
}) => {
  const { colors, colorScheme } = useTheme();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  // Animation values
  const scale = useSharedValue(1);
  
  // Handle press animation
  const handlePressIn = () => {
    if (animated) {
      scale.value = withTiming(0.98, { duration: 150 });
    }
  };
  
  const handlePressOut = () => {
    if (animated) {
      scale.value = withTiming(1, { duration: 200 });
    }
  };
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Render card based on variant
  const renderCard = () => {
    switch (variant) {
      case 'glass':
        return (
          <BlurView 
            intensity={intensity} 
            tint={colorScheme}
            style={[
              styles.card,
              {
                backgroundColor: colorScheme === 'dark' 
                  ? 'rgba(30, 30, 30, 0.7)' 
                  : 'rgba(255, 255, 255, 0.7)',
                borderColor: colorScheme === 'dark' 
                  ? 'rgba(255, 255, 255, 0.1)' 
                  : 'rgba(255, 255, 255, 0.5)',
              },
              style
            ]}
          >
            {children}
          </BlurView>
        );
        
      case 'outlined':
        return (
          <View 
            style={[
              styles.card, 
              {
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: colors.border,
              },
              style
            ]}
          >
            {children}
          </View>
        );
        
      default:
        return (
          <View 
            style={[
              styles.card, 
              {
                backgroundColor: colors.card,
              },
              style
            ]}
          >
            {children}
          </View>
        );
    }
  };

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={animatedStyle}
      >
        {renderCard()}
      </AnimatedTouchable>
    );
  }

  return renderCard();
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
      },
      android: {
        elevation: 4,
      },
      web: {
        // @ts-ignore
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
});

export default Card;