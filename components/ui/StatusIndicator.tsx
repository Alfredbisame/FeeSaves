import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'pending';

interface StatusIndicatorProps {
  type: StatusType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  type,
  label,
  size = 'md',
  style,
  labelStyle,
}) => {
  const { colors } = useTheme();
  
  // Determine indicator color based on type
  const getColor = () => {
    switch (type) {
      case 'success':
        return colors.success;
      case 'warning':
        return colors.warning;
      case 'error':
        return colors.error;
      case 'info':
        return colors.info;
      case 'pending':
        return colors.textSecondary;
      default:
        return colors.primary;
    }
  };
  
  // Determine indicator size based on size prop
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 6;
      case 'lg':
        return 12;
      default:
        return 8;
    }
  };

  return (
    <View style={[styles.container, style]}>
      <View 
        style={[
          styles.indicator, 
          { 
            backgroundColor: getColor(),
            width: getSize(),
            height: getSize(), 
          }
        ]} 
      />
      {label && (
        <Text 
          style={[
            styles.label, 
            { color: colors.text },
            labelStyle
          ]}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    borderRadius: 100,
    marginRight: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default StatusIndicator;