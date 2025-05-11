import React, { useEffect, useState } from 'react';
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
import ExpenseCard from '@/components/screens/ExpenseCard';
import StatusIndicator from '@/components/ui/StatusIndicator';
import { SkeletonCard } from '@/components/screens/SkeletonLoader';
import { Plus, Filter, BookA, Backpack, Receipt, Shirt } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function ExpensesScreen() {
  const { colors } = useTheme();
  
  // Loading states
  const expenses = useLoadingState<any[]>({ initialLoading: true });
  
  // Tab state
  const [activeTab, setActiveTab] = useState('all');
  
  // Refreshing state
  const [refreshing, setRefreshing] = React.useState(false);
  
  // Load initial data
  useEffect(() => {
    loadData();
  }, []);
  
  // Load expenses data
  const loadData = async () => {
    await expenses.execute(() => apiService.getExpenses());
  };
  
  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Filter expenses based on active tab
  const getFilteredExpenses = () => {
    if (!expenses.data) return [];
    
    if (activeTab === 'all') return expenses.data;
    
    if (activeTab === 'pending') {
      return expenses.data.filter((expense) => expense.status === 'pending');
    }
    
    if (activeTab === 'paid') {
      return expenses.data.filter((expense) => expense.status === 'paid');
    }
    
    return expenses.data;
  };
  
  const filteredExpenses = getFilteredExpenses();
  
  // Category icons
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'tuition':
        return <BookA size={24} color={colors.primary} />;
      case 'books':
        return <Receipt size={24} color={colors.info} />;
      case 'uniform':
        return <Shirt size={24} color={colors.warning} />;
      default:
        return <Backpack size={24} color={colors.primary} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          School Expenses
        </Text>
        <TouchableOpacity 
          style={[styles.filterButton, { backgroundColor: colors.card }]}
        >
          <Filter size={18} color={colors.primary} />
          <Text style={[styles.filterText, { color: colors.text }]}>Filter</Text>
        </TouchableOpacity>
      </View>
      
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'all' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('all')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'all' ? colors.primary : colors.textSecondary }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'pending' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'pending' ? colors.primary : colors.textSecondary }
            ]}
          >
            Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tab, 
            activeTab === 'paid' && [styles.activeTab, { borderColor: colors.primary }]
          ]}
          onPress={() => setActiveTab('paid')}
        >
          <Text 
            style={[
              styles.tabText, 
              { color: activeTab === 'paid' ? colors.primary : colors.textSecondary }
            ]}
          >
            Paid
          </Text>
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
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Categories
          </Text>
          
          <View style={styles.categoriesGrid}>
            <Animated.View 
              style={styles.categoryItem}
              entering={FadeInDown.delay(100).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.categoryButton, 
                  { backgroundColor: colors.card }
                ]}
              >
                <BookA size={24} color={colors.primary} />
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  Tuition
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View 
              style={styles.categoryItem}
              entering={FadeInDown.delay(150).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.categoryButton, 
                  { backgroundColor: colors.card }
                ]}
              >
                <Receipt size={24} color={colors.info} />
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  Books
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View 
              style={styles.categoryItem}
              entering={FadeInDown.delay(200).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.categoryButton, 
                  { backgroundColor: colors.card }
                ]}
              >
                <Shirt size={24} color={colors.warning} />
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  Uniform
                </Text>
              </TouchableOpacity>
            </Animated.View>
            
            <Animated.View 
              style={styles.categoryItem}
              entering={FadeInDown.delay(250).duration(600)}
            >
              <TouchableOpacity 
                style={[
                  styles.categoryButton, 
                  { backgroundColor: colors.card }
                ]}
              >
                <Backpack size={24} color={colors.success} />
                <Text style={[styles.categoryText, { color: colors.text }]}>
                  Others
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
        
        {/* Expenses List */}
        <View style={styles.expensesContainer}>
          <View style={styles.expensesHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Expenses
            </Text>
            
            {activeTab !== 'all' && (
              <View style={styles.activeFilterContainer}>
                <StatusIndicator 
                  type={activeTab === 'paid' ? 'success' : 'warning'} 
                  label={activeTab === 'paid' ? 'Paid' : 'Pending'} 
                />
              </View>
            )}
          </View>
          
          {expenses.isLoading ? (
            [...Array(3)].map((_, index) => (
              <SkeletonCard key={index} height={140} />
            ))
          ) : filteredExpenses.length === 0 ? (
            <Card variant="outlined">
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                  No {activeTab !== 'all' ? activeTab : ''} expenses found.
                </Text>
                <Button
                  title="Add New Expense"
                  variant="primary"
                  style={styles.emptyStateButton}
                />
              </View>
            </Card>
          ) : (
            filteredExpenses.map((expense, index) => (
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
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: a = 20,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 12,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  categoryItem: {
    width: '25%',
    padding: 4,
  },
  categoryButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  expensesContainer: {
    paddingHorizontal: 20,
  },
  expensesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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