import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoadingState } from '@/hooks/useLoadingState';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import SavingsPlanCard from '@/components/screens/SavingsPlanCard';
import { SkeletonCard } from '@/components/screens/SkeletonLoader';
import CurrencyAmount from '@/components/screens/CurrencyAmount';
import { Plus, Filter, TrendingUp, Clock, MessageCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SaveScreen() {
  const { colors } = useTheme();
  
  // Loading states
  const savingsPlans = useLoadingState<any[]>({ initialLoading: true });
  const savingSummary = useLoadingState<{totalSaved: number, totalTarget: number}>({ 
    initialLoading: true,
    initialState: { totalSaved: 0, totalTarget: 0 }
  });
  
  // Refreshing state
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Load all savings data
  const loadData = async () => {
    await savingsPlans.execute(async () => {
      const plans = await apiService.getSavingsPlans();
      
      // Calculate summary data
      const totalSaved = plans.reduce((sum: number, plan: any) => sum + plan.currentAmount, 0);
      const totalTarget = plans.reduce((sum: number, plan: any) => sum + plan.targetAmount, 0);
      
      savingSummary.setData({ totalSaved, totalTarget });
      
      return plans;
    });
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Calculate overall progress percentage
  const progressPercentage = savingSummary.data
    ? Math.round((savingSummary.data.totalSaved / savingSummary.data.totalTarget) * 100)
    : 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Savings Plans
        </Text>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.card }]}
        >
          <Filter size={18} color={colors.primary} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Card */}
        <View style={styles.summaryContainer}>
          {savingSummary.isLoading ? (
            <SkeletonCard height={140} />
          ) : (
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <Card variant="glass">
                <Text style={[styles.summaryTitle, { color: colors.text }]}>
                  Total Savings
                </Text>
                
                <View style={styles.amountsContainer}>
                  <View>
                    <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
                      Saved
                    </Text>
                    <CurrencyAmount 
                      amount={savingSummary.data?.totalSaved || 0} 
                      size="lg" 
                      color={colors.primary}
                    />
                  </View>
                  
                  <View>
                    <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>
                      Target
                    </Text>
                    <CurrencyAmount 
                      amount={savingSummary.data?.totalTarget || 0} 
                      size="lg"
                    />
                  </View>
                </View>
                
                <View style={styles.progressTextContainer}>
                  <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                    You're {progressPercentage}% of the way there!
                  </Text>
                </View>
              </Card>
            </Animated.View>
          )}
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Actions
          </Text>
          
          <View style={styles.actionButtonsContainer}>
            <Animated.View 
              style={styles.actionButton}
              entering={FadeInDown.delay(100).duration(600)}
            >
              <TouchableOpacity
                style={[
                  styles.actionButtonInner,
                  { backgroundColor: colors.card }
                ]}
              >
                <TrendingUp size={24} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Add Deposit
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View 
              style={styles.actionButton}
              entering={FadeInDown.delay(200).duration(600)}
            >
              <TouchableOpacity
                style={[
                  styles.actionButtonInner,
                  { backgroundColor: colors.card }
                ]}
              >
                <Clock size={24} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Schedule
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View 
              style={styles.actionButton}
              entering={FadeInDown.delay(300).duration(600)}
            >
              <TouchableOpacity
                style={[
                  styles.actionButtonInner,
                  { backgroundColor: colors.card }
                ]}
              >
                <MessageCircle size={24} color={colors.primary} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>
                  Get Advice
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        
        {/* Savings Plans List */}
        <View style={styles.plansContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Your Plans
          </Text>
          
          {savingsPlans.isLoading ? (
            [...Array(3)].map((_, index) => (
              <SkeletonCard key={index} height={160} />
            ))
          ) : savingsPlans.data?.length === 0 ? (
            <Card variant="outlined">
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  You don't have any savings plans yet.
                </Text>
                <Button
                    title="Create Your First Plan"
                    variant="primary"
                    style={styles.emptyStateButton} onPress={function (): void {
                      throw new Error('Function not implemented.');
                    } }                />
              </View>
            </Card>
          ) : (
            savingsPlans.data?.map((plan, index) => (
              <Animated.View 
                key={plan.id}
                entering={FadeInDown.delay(200 * index).duration(600)}
              >
                <SavingsPlanCard
                  name={plan.name}
                  currentAmount={plan.currentAmount}
                  targetAmount={plan.targetAmount}
                  dueDate={plan.dueDate}
                  interval={plan.interval}
                  status={plan.status}
                />
              </Animated.View>
            ))
          )}
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity
        style={[
          styles.fab,
          { backgroundColor: colors.primary }
        ]}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summaryContainer: {
    padding: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 12,
  },
  amountsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 4,
  },
  progressTextContainer: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonInner: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  plansContainer: {
    paddingHorizontal: 20,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    width: '100%',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 80,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});