import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  withSequence
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
  textStyle,
}) => {
  const { colors, colorScheme } = useTheme();
  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
  
  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  
  // Handle press animation
  const handlePressIn = () => {
    scale.value = withTiming(0.97, { duration: 100 });
    opacity.value = withTiming(0.9, { duration: 100 });
  };
  
  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 150 });
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    // Add haptic feedback simulation
    scale.value = withSequence(
      withTiming(0.95, { duration: 50 }),
      withTiming(1, { duration: 100 })
    );
    
    if (!disabled && !loading) {
      onPress();
    }
  };
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: disabled ? 0.6 : opacity.value,
    };
  });

  // Determine button height based on size
  const getButtonHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'lg': return 56;
      default: return 46;
    }
  };

  // Determine button padding based on size
  const getButtonPadding = () => {
    switch (size) {
      case 'sm': return { paddingHorizontal: 12 };
      case 'lg': return { paddingHorizontal: 24 };
      default: return { paddingHorizontal: 16 };
    }
  };

  // Determine text size based on button size
  const getTextSize = () => {
    switch (size) {
      case 'sm': return 12;
      case 'lg': return 18;
      default: return 16;
    }
  };

  // Render button based on variant
  const renderButton = () => {
    switch (variant) {
      case 'primary':
        return (
          <LinearGradient
            colors={[colors.primary, colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              styles.primaryButton,
              getButtonPadding(),
              { height: getButtonHeight() },
              fullWidth && styles.fullWidth,
              style,
            ]}
          >
            {renderButtonContent()}
          </LinearGradient>
        );
        
      case 'secondary':
        return (
          <LinearGradient
            colors={[colors.secondary, colors.secondaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.button,
              styles.secondaryButton,
              getButtonPadding(),
              { height: getButtonHeight() },
              fullWidth && styles.fullWidth,
              style,
            ]}
          >
            {renderButtonContent(true)}
          </LinearGradient>
        );
        
      case 'outline':
        return (
          <Animated.View
            style={[
              styles.button,
              styles.outlineButton,
              getButtonPadding(),
              { 
                height: getButtonHeight(),
                borderColor: colors.primary 
              },
              fullWidth && styles.fullWidth,
              style,
            ]}
          >
            {renderButtonContent(true)}
          </Animated.View>
        );
        
      case 'ghost':
        return (
          <Animated.View
            style={[
              styles.button,
              styles.ghostButton,
              getButtonPadding(),
              { height: getButtonHeight() },
              fullWidth && styles.fullWidth,
              style,
            ]}
          >
            {renderButtonContent(true)}
          </Animated.View>
        );
    }
  };

  // Render button content
  const renderButtonContent = (isDark?: boolean) => {
    const textColor = isDark 
      ? colorScheme === 'dark' ? colors.text : colors.primary
      : colors.secondary;
      
    return (
      <>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={textColor} 
          />
        ) : (
          <Text 
            style={[
              styles.text, 
              { 
                color: textColor,
                fontSize: getTextSize() 
              },
              textStyle
            ]}
          >
            {title}
          </Text>
        )}
      </>
    );
  };

  return (
    <AnimatedTouchable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[animatedStyle]}
      activeOpacity={0.8}
    >
      {renderButton()}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
      web: {
        // @ts-ignore
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  primaryButton: {
    backgroundColor: '#E53935',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Button;