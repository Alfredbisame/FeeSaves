import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface CurrencyAmountProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  showSign?: boolean;
  style?: ViewStyle;
  amountStyle?: TextStyle;
}

const CurrencyAmount: React.FC<CurrencyAmountProps> = ({
  amount,
  size = 'md',
  color,
  showSign = true,
  style,
  amountStyle,
}) => {
  const { colors } = useTheme();
  
  // Format amount with commas
  const formattedAmount = amount.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  // Determine text size based on size prop
  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return { currencySize: 12, amountSize: 14 };
      case 'lg':
        return { currencySize: 16, amountSize: 24 };
      case 'xl':
        return { currencySize: 20, amountSize: 32 };
      default:
        return { currencySize: 14, amountSize: 18 };
    }
  };
  
  const { currencySize, amountSize } = getTextSize();
  
  // Get the text color
  const textColor = color || colors.text;
  
  return (
    <View style={[styles.container, style]}>
      {showSign && (
        <Text 
          style={[
            styles.currency, 
            { 
              fontSize: currencySize,
              color: textColor,
            }
          ]}
        >
          ₵
        </Text>
      )}
      <Text 
        style={[
          styles.amount, 
          { 
            fontSize: amountSize,
            color: textColor,
          },
          amountStyle
        ]}
      >
        {formattedAmount}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currency: {
    fontWeight: '600',
    marginRight: 2,
  },
  amount: {
    fontWeight: '700',
  },
});

export default CurrencyAmount;