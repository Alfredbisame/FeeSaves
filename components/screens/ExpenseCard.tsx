import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';
import CurrencyAmount from '@/components/screens/CurrencyAmount';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { Receipt, Clock } from 'lucide-react-native';

interface ExpenseCardProps {
  title: string;
  amount: number;
  date: string;
  category: string;
  status: 'paid' | 'pending' | 'overdue';
  onPress?: () => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  title,
  amount,
  date,
  category,
  status,
  onPress,
}) => {
  const { colors } = useTheme();
  
  // Status mapping to StandardStatus type
  const getStatusType = () => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'info';
    }
  };
  
  // Status label mapping
  const getStatusLabel = () => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Unknown';
    }
  };
  
  return (
    <Card variant="default" onPress={onPress} animated>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Receipt size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>
        <StatusIndicator type={getStatusType()} label={getStatusLabel()} />
      </View>
      
      <View style={styles.amountContainer}>
        <CurrencyAmount amount={amount} size="lg" />
      </View>
      
      <View style={styles.footer}>
        <Text style={[styles.category, { color: colors.primary }]}>
          {category}
        </Text>
        <View style={styles.dateContainer}>
          <Clock size={14} color={colors.textSecondary} />
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            {date}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  amountContainer: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    marginLeft: 4,
  },
});

export default ExpenseCard;