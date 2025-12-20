
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, Venture, Budget, Goal, SystemLog } from '../types';

interface DataContextType {
  transactions: Transaction[];
  ventures: Venture[];
  budgets: Budget[];
  goals: Goal[];
  logs: SystemLog[];
  categories: string[];
  addTransaction: (t: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  updateVenture: (id: string, updates: Partial<Venture>) => void;
  updateBudget: (id: string, updates: Partial<Budget>) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addCategory: (category: string) => void;
  addLog: (msg: string, severity: 'info' | 'warning' | 'critical') => void;
  financials: {
    totalIncome: number;
    totalExpense: number;
    netWorth: number;
    monthlyCashflow: number;
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // -- Initial Mock Data (State) --
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Cloud Infrastructure', amount: 1200.00, currency: 'USD', date: '2023-10-25', type: 'expense', category: 'Technology', status: 'approved' },
    { id: '2', description: 'Client Retainer - Alpha', amount: 5000.00, currency: 'USD', date: '2023-10-24', type: 'income', category: 'Sales', status: 'approved' },
    { id: '3', description: 'Office Supplies', amount: 150.50, currency: 'USD', date: '2023-10-23', type: 'expense', category: 'Operations', status: 'pending' },
    { id: '4', description: 'Q3 Bonus Payout', amount: 12000.00, currency: 'USD', date: '2023-10-20', type: 'expense', category: 'Payroll', status: 'approved' },
    { id: '5', description: 'Venture Capital Seed', amount: 50000.00, currency: 'USD', date: '2023-10-15', type: 'income', category: 'Investment', status: 'approved' },
    { id: '6', description: 'AI Service Fee', amount: 50.00, currency: 'USD', date: '2023-10-27', type: 'expense', category: 'AI Services', status: 'approved' },
  ]);

  const [ventures, setVentures] = useState<Venture[]>([
    { id: 'v1', name: 'Project Neon', description: 'Next-gen UI Framework', status: 'Active', roi: 12.5, budget: 100000, spent: 45000, progress: 45, teamSize: 5 },
    { id: 'v2', name: 'Cyber Logistics', description: 'AI Routing System', status: 'Planning', roi: 0, budget: 50000, spent: 1200, progress: 5, teamSize: 2 },
    { id: 'v3', name: 'Quantum Retail', description: 'POS Integration', status: 'Active', roi: 8.2, budget: 75000, spent: 68000, progress: 90, teamSize: 8 },
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    { id: 'b1', category: 'Operations', limit: 5000, spent: 3750, color: '#00FFA3' },
    { id: 'b2', category: 'Marketing', limit: 8000, spent: 4200, color: '#FF6EC7' },
    { id: 'b3', category: 'R&D', limit: 15000, spent: 6000, color: '#FFD500' },
    { id: 'b4', category: 'Payroll', limit: 20000, spent: 12000, color: '#3B82F6' },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    { id: 'g1', title: 'Q4 Revenue Target', targetAmount: 150000, currentAmount: 98000, deadline: '2023-12-31', status: 'On Track' },
    { id: 'g2', title: 'Emergency Fund', targetAmount: 50000, currentAmount: 15000, deadline: '2024-06-30', status: 'At Risk' },
  ]);

  const [logs, setLogs] = useState<SystemLog[]>([
    { id: 'l1', event: 'System Backup Completed', severity: 'info', timestamp: Date.now() - 100000 },
    { id: 'l2', event: 'High Latency Detected in Region US-East', severity: 'warning', timestamp: Date.now() - 500000 },
  ]);

  const [categories, setCategories] = useState<string[]>([
    'Technology', 'Sales', 'Operations', 'Payroll', 'Investment', 'AI Services', 'Marketing', 'Legal'
  ]);

  // -- Computed Financials --
  const financials = {
    totalIncome: transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0),
    totalExpense: transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0),
    netWorth: 0, // Calculated below
    monthlyCashflow: 0 // Mock calculation
  };
  financials.netWorth = financials.totalIncome - financials.totalExpense + 1200000; // Base assets
  financials.monthlyCashflow = financials.totalIncome - financials.totalExpense;

  // -- Actions --
  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
    addLog(`New Transaction: ${t.description} (${t.amount})`, 'info');
    
    // Update budget logic (simple mock)
    if (t.type === 'expense') {
      setBudgets(prev => prev.map(b => 
        b.category.toLowerCase() === t.category.toLowerCase() 
          ? { ...b, spent: b.spent + t.amount } 
          : b
      ));
    }
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    addLog(`Transaction Updated: ${id}`, 'info');
  };

  const updateVenture = (id: string, updates: Partial<Venture>) => {
    setVentures(prev => prev.map(v => v.id === id ? { ...v, ...updates } : v));
    addLog(`Venture Updated: ${id}`, 'info');
  };

  const updateBudget = (id: string, updates: Partial<Budget>) => {
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addLog(`Budget Updated: ${id}`, 'info');
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    addLog(`Goal Updated: ${id}`, 'info');
  };

  const addCategory = (category: string) => {
    if (!categories.includes(category)) {
      setCategories(prev => [...prev, category]);
      addLog(`New Category Added: ${category}`, 'info');
    }
  };

  const addLog = (msg: string, severity: 'info' | 'warning' | 'critical') => {
    setLogs(prev => [{ id: Date.now().toString(), event: msg, severity, timestamp: Date.now() }, ...prev]);
  };

  return (
    <DataContext.Provider value={{ 
      transactions, ventures, budgets, goals, logs, categories,
      addTransaction, updateTransaction, updateVenture, updateBudget, updateGoal, addCategory, addLog, financials 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
