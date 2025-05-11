import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import CurrencyAmount from '@/components/screens/CurrencyAmount';
import { CircleArrowDown as ArrowDownCircle, CircleArrowUp as ArrowUpCircle } from 'lucide-react-native';

type TransactionType = 'deposit' | 'withdrawal' | 'payment';

interface TransactionItemProps {
  title: string;
  description?: string;
  amount: number;
  date: string;
  type: TransactionType;
  onPress?: () => void;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  title,
  description,
  amount,
  date,
  type,
  onPress,
}) => {
  const { colors } = useTheme();
  
  // Get icon and colors based on transaction type
  const getTransactionDetails = () => {
    switch (type) {
      case 'deposit':
        return {
          icon: <ArrowDownCircle size={24} color={colors.success} />,
          color: colors.success,
        };
      case 'withdrawal':
        return {
          icon: <ArrowUpCircle size={24} color={colors.error} />,
          color: colors.error,
        };
      case 'payment':
        return {
          icon: <ArrowUpCircle size={24} color={colors.primary} />,
          color: colors.primary,
        };
      default:
        return {
          icon: <ArrowDownCircle size={24} color={colors.info} />,
          color: colors.info,
        };
    }
  };
  
  const { icon, color } = getTransactionDetails();
  
  return (
    <TouchableOpacity onPress={onPress} style={styles.container} activeOpacity={0.7}>
      <View style={styles.iconContainer}>{icon}</View>
      
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {description && (
            <Text style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          )}
        </View>
        
        <View style={styles.amountContainer}>
          <CurrencyAmount amount={amount} color={color} />
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {date}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  date: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default TransactionItem;