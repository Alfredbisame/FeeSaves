import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';

import { DimensionValue } from 'react-native';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 4,
  style,
}) => {
  const { colors, colorScheme } = useTheme();
  
  // Base color and highlight color based on theme
  const baseColor = colorScheme === 'dark' ? 'rgba(50, 50, 50, 0.4)' : 'rgba(230, 230, 230, 0.4)';
  const highlightColor = colorScheme === 'dark' ? 'rgba(80, 80, 80, 0.4)' : 'rgba(250, 250, 250, 0.4)';
  
  // Animation value
  const opacity = useSharedValue(0.3);
  
  // Start animation on mount
  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.6, { 
        duration: 800,
        easing: Easing.inOut(Easing.ease),
      }),
      -1, // Infinite repeat
      true // Reverse animation
    );
    
    // Cleanup animation on unmount
    return () => {
      cancelAnimation(opacity);
    };
  }, []);
  
  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: baseColor,
    };
  });
  
  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Skeleton card component
interface SkeletonCardProps {
  height?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  height = 120,
  style,
}) => {
  const { colors } = useTheme();
  
  return (
    <View 
      style={[
        styles.card, 
        { height, backgroundColor: colors.card },
        style
      ]}
    >
      <View style={styles.cardHeader}>
        <SkeletonLoader width={40} height={40} borderRadius={20} />
        <View style={styles.cardTitleContainer}>
          <SkeletonLoader width="70%" height={18} style={styles.marginBottom} />
          <SkeletonLoader width="40%" height={12} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={16} style={styles.marginBottom} />
      <SkeletonLoader width="90%" height={12} style={styles.marginBottom} />
      <SkeletonLoader width="60%" height={12} />
    </View>
  );
};

// Transaction list item skeleton
export const SkeletonTransactionItem: React.FC = () => {
  return (
    <View style={styles.transactionItem}>
      <SkeletonLoader width={40} height={40} borderRadius={20} />
      <View style={styles.transactionContent}>
        <View style={styles.transactionLeft}>
          <SkeletonLoader width="70%" height={16} style={styles.marginBottom} />
          <SkeletonLoader width="50%" height={12} />
        </View>
        <View style={styles.transactionRight}>
          <SkeletonLoader width={70} height={16} style={styles.marginBottom} />
          <SkeletonLoader width={50} height={12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    borderRadius: 4,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  marginBottom: {
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  transactionContent: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 12,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
});

export default SkeletonLoader;

export { SkeletonLoader }