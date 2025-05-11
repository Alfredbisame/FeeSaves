import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import CurrencyAmount from '@/components/screens/CurrencyAmount';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { Calendar, Bookmark } from 'lucide-react-native';

interface SavingsPlanCardProps {
  name: string;
  currentAmount: number;
  targetAmount: number;
  dueDate: string;
  interval: string;
  status: 'active' | 'completed' | 'overdue';
  onPress?: () => void;
}

const SavingsPlanCard: React.FC<SavingsPlanCardProps> = ({
  name,
  currentAmount,
  targetAmount,
  dueDate,
  interval,
  status,
  onPress,
}) => {
  const { colors } = useTheme();
  
  // Calculate progress percentage
  const progressPercentage = Math.min(
    Math.round((currentAmount / targetAmount) * 100),
    100
  );
  
  // Status mapping to StandardStatus type
  const getStatusType = () => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'info';
      case 'overdue':
        return 'error';
      default:
        return 'pending';
    }
  };
  
  // Status label mapping
  const getStatusLabel = () => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'overdue':
        return 'Overdue';
      default:
        return 'Pending';
    }
  };
  
  return (
    <Card variant="default" onPress={onPress} animated>
      <View style={styles.header}>
        <Bookmark size={18} color={colors.primary} />
        <Text style={[styles.name, { color: colors.text }]}>{name}</Text>
      </View>
      
      <View style={styles.amountRow}>
        <View>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Current
          </Text>
          <CurrencyAmount amount={currentAmount} size="lg" />
        </View>
        <View>
          <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
            Target
          </Text>
          <CurrencyAmount amount={targetAmount} size="lg" />
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <Progress value={progressPercentage} />
      </View>
      
      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[styles.date, { color: colors.textSecondary }]}>
            Due: {dueDate}
          </Text>
        </View>
        <StatusIndicator type={getStatusType()} label={getStatusLabel()} />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  progressContainer: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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

export default SavingsPlanCard;