import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Platform,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLoadingState } from '@/hooks/useLoadingState';
import apiService from '@/services/apiService';
import Card from '@/components/ui/Card';
import Progress from '@/components/ui/Progress';
import Button from '@/components/ui/Button';
import { SkeletonCard, SkeletonTransactionItem } from '@/components/screens/SkeletonLoader';
import CurrencyAmount from '@/components/screens/CurrencyAmount';
import SavingsPlanCard from '@/components/screens/SavingsPlanCard';
import ExpenseCard from '@/components/screens/ExpenseCard';
import StudentCard from '@/components/screens/StudentCard';
import TransactionItem from '@/components/screens/TransactionItem';
import { Plus, Bell, ChevronRight, ChartBar as BarChart2, Coins, BookA } from 'lucide-react-native';
import Animated, { 
  FadeInDown, 
  FadeIn,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen() {
  const { colors } = useTheme();

    // Get dynamic greeting based on time of day
  const greeting = useMemo(() => {
    const currentHour = new Date().getHours();
    
    if (currentHour >= 5 && currentHour < 12) {
      return 'Good morning,';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Good afternoon,';
    } else if (currentHour >= 18 && currentHour < 22) {
      return 'Good evening,';
    } else {
      return 'Good night,';
    }
  }, []);
  
  

  
  // Loading states for different data
  const dashboard = useLoadingState<any>({ initialLoading: true });
  const students = useLoadingState<any[]>({ initialLoading: true });
  const savingsPlans = useLoadingState<any[]>({ initialLoading: true });
  const expenses = useLoadingState<any[]>({ initialLoading: true });
  const transactions = useLoadingState<any[]>({ initialLoading: true });
  
  // Refreshing state
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Load all data
  const loadData = async () => {
    dashboard.execute(() => apiService.getDashboardData());
    students.execute(() => apiService.getStudents());
    savingsPlans.execute(() => apiService.getSavingsPlans());
    expenses.execute(() => apiService.getExpenses().then(data => data.slice(0, 2)));
    transactions.execute(() => apiService.getTransactions().then(data => data.slice(0, 3)));
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
    // Scroll animation value
  const scrollY = useSharedValue(0);
  
  // Simple native scroll handler function
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = event.nativeEvent.contentOffset.y;
  };
  
  // Web scroll handler effect
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleWebScroll = () => {
        if (window) {
          scrollY.value = window.scrollY;
        }
      };
      
      window.addEventListener('scroll', handleWebScroll);
      return () => {
        window.removeEventListener('scroll', handleWebScroll);
      };
    }
  }, []);

  // Animated header background style
  const headerBackgroundStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [-50, 0, 100],
      [250, 200, 150],
      'clamp'
    );
    
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0.9],
      'clamp'
    );
    
    return {
      height,
      opacity,
    };
  });
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Animated Header Background */}
      <Animated.View style={[styles.headerBackground, headerBackgroundStyle]}>
        <LinearGradient
          colors={[colors.primary, 'transparent']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </Animated.View>
      
      {/* Header */}
      <View style={[styles.header]}>
        <View>
          <Text style={[styles.greeting, { color: colors.secondary }]}>
            {greeting}
          </Text>
          <Text style={[styles.username, { color: colors.secondary }]}>
            Mr. Fred
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color={colors.secondary} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Platform.OS === 'web' ? undefined : handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          {dashboard.isLoading ? (
            <Animated.View entering={FadeIn.duration(400)}>
              <SkeletonCard height={180} />
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInDown.duration(800).springify()}>
              <Card variant="glass">
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Total Education Savings
                </Text>
                
                <CurrencyAmount 
                  amount={dashboard.data?.totalSaved || 0} 
                  size="xl" 
                  color={colors.primary}
                />
                
                <View style={styles.progressContainer}>
                  <Progress
                    value={dashboard.data?.savingsGoalProgress || 0}
                    label="Overall Savings Progress"
                    height={10}
                  />
                </View>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <View style={styles.statIcon}>
                      <Coins size={18} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Total Expenses
                      </Text>
                      <CurrencyAmount 
                        amount={dashboard.data?.totalExpenses || 0} 
                        size="md" 
                      />
                    </View>
                  </View>
                  
                  <View style={styles.statItem}>
                    <View style={styles.statIcon}>
                      <BookA size={18} color={colors.primary} />
                    </View>
                    <View>
                      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                        Upcoming Payments
                      </Text>
                      <Text style={[styles.statValue, { color: colors.text }]}>
                        {dashboard.data?.upcomingPayments || 0}
                      </Text>
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          )}
        </View>
        
        {/* Students */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              My Students
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScrollContent}
          >
            {students.isLoading ? (
              [...Array(2)].map((_, index) => (
                <View key={index} style={styles.studentCard}>
                  <SkeletonCard height={120} style={{ width: 250 }} />
                </View>
              ))
            ) : (
              students.data?.map((student, index) => (
                <Animated.View 
                  key={student.id} 
                  style={styles.studentCard}
                  entering={FadeInDown.delay(200 * index).duration(600)}
                >
                  <StudentCard
                    name={student.name}
                    school={student.school}
                    grade={student.grade}
                    imageUrl={student.imageUrl}
                  />
                </Animated.View>
              ))
            )}
            
            <Animated.View 
              style={styles.studentCard}
              entering={FadeInDown.delay(400).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.addStudentCard, 
                  { 
                    borderColor: colors.border,
                    backgroundColor: colors.card
                  }
                ]}
              >
                <Plus size={30} color={colors.primary} />
                <Text style={[styles.addStudentText, { color: colors.primary }]}>
                  Add Student
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </ScrollView>
        </View>
        
        {/* Savings Plans */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Savings Plans
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {savingsPlans.isLoading ? (
            [...Array(2)].map((_, index) => (
              <Animated.View 
                key={index} 
                entering={FadeIn.delay(200 * index).duration(400)}
              >
                <SkeletonCard height={160} />
              </Animated.View>
            ))
          ) : (
            savingsPlans.data?.slice(0, 2).map((plan, index) => (
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
          
          <Button
            title="New Savings Plan"
            variant="outline"
            icon={<Plus size={18} color={colors.primary} />}
            iconPosition="left"
            style={{
              ...styles.newButton,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.primary,
              backgroundColor: `${colors.primary}10`,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            textStyle={{
              fontWeight: '600',
              letterSpacing: 0.3,
              color: colors.primary,
            }}
            onPress={() => {}}
          />
        </View>
        
        {/* Expenses */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Expenses
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {expenses.isLoading ? (
            [...Array(2)].map((_, index) => (
              <Animated.View 
                key={index} 
                entering={FadeIn.delay(200 * index).duration(400)}
              >
                <SkeletonCard height={140} />
              </Animated.View>
            ))
          ) : (
            expenses.data?.map((expense, index) => (
              <Animated.View 
                key={expense.id}
                entering={FadeInDown.delay(200 * index).duration(600)}
              >
                <ExpenseCard
                  title={expense.title}
                  amount={expense.amount}
                  date={expense.date}
                  category={expense.category}
                  status={expense.status}
                />
              </Animated.View>
            ))
          )}
        </View>
        
        {/* Recent Transactions */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Recent Transactions
            </Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                See All
              </Text>
              <ChevronRight size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <Card variant="default">
            {transactions.isLoading ? (
              [...Array(3)].map((_, index) => (
                <SkeletonTransactionItem key={index} />
              ))
            ) : (
              transactions.data?.map((transaction, index) => (
                <Animated.View 
                  key={transaction.id}
                  entering={FadeInDown.delay(100 * index).duration(600)}
                >
                  <TransactionItem
                    title={transaction.title}
                    description={transaction.description}
                    amount={transaction.amount}
                    date={transaction.date}
                    type={transaction.type}
                  />
                </Animated.View>
              ))
            )}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
    zIndex: 1,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  username: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  summaryContainer: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  progressContainer: {
    marginVertical: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(229, 57, 53, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginRight: 4,
  },
  horizontalScrollContent: {
    paddingRight: 20,
  },
  studentCard: {
    width: 260,
    marginRight: 12,
  },
  addStudentCard: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStudentText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
  },
  newButton: {
  marginTop: 16,
  marginBottom: 8,
  paddingVertical: 12,
  paddingHorizontal: 16,
  alignSelf: 'center',
  minWidth: 250,
},
});
