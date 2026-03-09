import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Transaction, Budget, Category } from '../types';
import {
  generateId,
  getSeedTransactions,
  getDefaultBudgets,
  getCurrentMonth,
  getTransactionsForMonth,
  getTotalByType,
  getSpendingByCategory,
} from '../utils/helpers';

interface UseFinanceReturn {
  transactions: Transaction[];
  budgets: Budget[];
  currentMonth: string;
  setCurrentMonth: (month: string) => void;
  monthTransactions: Transaction[];
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  spendingByCategory: Record<Category, number>;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: Category, limit: number) => void;
}

function getInitialTransactions(): Transaction[] {
  const existing = window.localStorage.getItem('lyncs-transactions');
  if (existing) return JSON.parse(existing) as Transaction[];
  return getSeedTransactions();
}

export function useFinance(): UseFinanceReturn {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'lyncs-transactions',
    getInitialTransactions()
  );
  const [budgets, setBudgets] = useLocalStorage<Budget[]>(
    'lyncs-budgets',
    getDefaultBudgets()
  );
  const [currentMonth, setCurrentMonth] = useLocalStorage(
    'lyncs-current-month',
    getCurrentMonth()
  );

  const monthTransactions = getTransactionsForMonth(transactions, currentMonth);
  const totalIncome = getTotalByType(monthTransactions, 'income');
  const totalExpenses = getTotalByType(monthTransactions, 'expense');
  const balance = totalIncome - totalExpenses;
  const spendingByCategory = getSpendingByCategory(monthTransactions);

  const addTransaction = useCallback(
    (tx: Omit<Transaction, 'id'>) => {
      const newTx: Transaction = { ...tx, id: generateId() };
      setTransactions((prev) => [newTx, ...prev]);
    },
    [setTransactions]
  );

  const deleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    },
    [setTransactions]
  );

  const updateBudget = useCallback(
    (category: Category, limit: number) => {
      setBudgets((prev) => {
        const existing = prev.find((b) => b.category === category);
        if (existing) {
          return prev.map((b) =>
            b.category === category ? { ...b, limit } : b
          );
        }
        return [...prev, { category, limit }];
      });
    },
    [setBudgets]
  );

  return {
    transactions,
    budgets,
    currentMonth,
    setCurrentMonth,
    monthTransactions,
    totalIncome,
    totalExpenses,
    balance,
    spendingByCategory,
    addTransaction,
    deleteTransaction,
    updateBudget,
  };
}
