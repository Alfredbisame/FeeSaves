import { Platform } from 'react-native';

// Simulated API data
const mockData = {
  user: {
    id: '1',
    name: 'Mr. Fred',
    email: 'fred.mensah@example.com',
    phone: '+233 55 123 4567',
  },
  
  students: [
    {
      id: '1',
      name: 'Abena Mensah',
      school: 'Golden Gate International School',
      grade: 'Grade 9',
      imageUrl: 'https://images.pexels.com/photos/3755511/pexels-photo-3755511.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
    },
    {
      id: '2',
      name: 'Kwame Mensah',
      school: 'Future Academy',
      grade: 'Grade 6',
      imageUrl: 'https://images.pexels.com/photos/5212339/pexels-photo-5212339.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=500',
    },
  ],
  
  savingsPlans: [
    {
      id: '1',
      name: 'School Fees 2025',
      studentId: '1',
      currentAmount: 3500.00,
      targetAmount: 5000.00,
      dueDate: 'Sep 5, 2025',
      interval: 'Monthly',
      status: 'active',
    },
    {
      id: '2',
      name: 'Summer Camp',
      studentId: '1',
      currentAmount: 1200.00,
      targetAmount: 1200.00,
      dueDate: 'Jul 15, 2025',
      interval: 'Weekly',
      status: 'completed',
    },
    {
      id: '3',
      name: 'School Fees 2025',
      studentId: '2',
      currentAmount: 1800.00,
      targetAmount: 4500.00,
      dueDate: 'Aug 30, 2025',
      interval: 'Monthly',
      status: 'active',
    },
  ],
  
  expenses: [
    {
      id: '1',
      title: 'Term 2 Fees',
      studentId: '1',
      amount: 2500.00,
      date: 'Mar 15, 2025',
      category: 'Tuition',
      status: 'paid',
    },
    {
      id: '2',
      title: 'School Uniform',
      studentId: '1',
      amount: 350.00,
      date: 'Mar 22, 2025',
      category: 'Uniform',
      status: 'pending',
    },
    {
      id: '3',
      title: 'School Books',
      studentId: '2',
      amount: 420.00,
      date: 'Feb 28, 2025',
      category: 'Books',
      status: 'paid',
    },
  ],
  
  transactions: [
    {
      id: '1',
      title: 'Saved to School Fees 2025',
      description: 'Abena Mensah',
      amount: 500.00,
      date: 'Apr 1, 2025',
      type: 'deposit',
    },
    {
      id: '2',
      title: 'Paid Term 2 Fees',
      description: 'Abena Mensah',
      amount: 2500.00,
      date: 'Mar 15, 2025',
      type: 'payment',
    },
    {
      id: '3',
      title: 'Saved to School Fees 2025',
      description: 'Kwame Mensah',
      amount: 600.00,
      date: 'Mar 1, 2025',
      type: 'deposit',
    },
    {
      id: '4',
      title: 'Withdrawal for Exam Fees',
      description: 'Abena Mensah',
      amount: 200.00,
      date: 'Feb 10, 2025',
      type: 'withdrawal',
    },
  ],
  
  dashboard: {
    totalSaved: 6500.00,
    totalExpenses: 3270.00,
    upcomingPayments: 2,
    savingsGoalProgress: 65,
  },
};

// Simulate a network request with response delay
const simulateRequest = async <T>(data: T): Promise<T> => {
  // Add realistic network delay 
  const delay = 1000 + Math.random() * 1000; // 1-2 seconds
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Randomly fail some requests to test error handling (10% chance)
  if (Math.random() < 0.1) {
    throw new Error('Network request failed. Please try again.');
  }
  
  return data;
};

// API Service methods
export const apiService = {
  // User endpoints
  getUser: () => simulateRequest(mockData.user),
  updateUser: (userData: Partial<typeof mockData.user>) => 
    simulateRequest({ ...mockData.user, ...userData }),
  
  // Students endpoints
  getStudents: () => simulateRequest(mockData.students),
  getStudent: (id: string) => 
    simulateRequest(mockData.students.find(student => student.id === id) || null),
  addStudent: (student: Omit<typeof mockData.students[0], 'id'>) => 
    simulateRequest({ ...student, id: Math.random().toString() }),
  updateStudent: (id: string, student: Partial<typeof mockData.students[0]>) => 
    simulateRequest({ ...mockData.students.find(s => s.id === id), ...student, id }),
  
  // Savings plans endpoints
  getSavingsPlans: () => simulateRequest(mockData.savingsPlans),
  getSavingsPlan: (id: string) => 
    simulateRequest(mockData.savingsPlans.find(plan => plan.id === id) || null),
  getStudentSavingsPlans: (studentId: string) => 
    simulateRequest(mockData.savingsPlans.filter(plan => plan.studentId === studentId)),
  addSavingsPlan: (plan: Omit<typeof mockData.savingsPlans[0], 'id'>) => 
    simulateRequest({ ...plan, id: Math.random().toString() }),
  updateSavingsPlan: (id: string, plan: Partial<typeof mockData.savingsPlans[0]>) => 
    simulateRequest({ ...mockData.savingsPlans.find(p => p.id === id), ...plan, id }),
  
  // Expenses endpoints
  getExpenses: () => simulateRequest(mockData.expenses),
  getExpense: (id: string) => 
    simulateRequest(mockData.expenses.find(expense => expense.id === id) || null),
  getStudentExpenses: (studentId: string) => 
    simulateRequest(mockData.expenses.filter(expense => expense.studentId === studentId)),
  addExpense: (expense: Omit<typeof mockData.expenses[0], 'id'>) => 
    simulateRequest({ ...expense, id: Math.random().toString() }),
  updateExpense: (id: string, expense: Partial<typeof mockData.expenses[0]>) => 
    simulateRequest({ ...mockData.expenses.find(e => e.id === id), ...expense, id }),
  
  // Transactions endpoints
  getTransactions: () => simulateRequest(mockData.transactions),
  
  // Dashboard endpoints
  getDashboardData: () => simulateRequest(mockData.dashboard),
};

export default apiService;