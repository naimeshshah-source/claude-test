'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { loadExpenses, saveExpenses } from '@/lib/storage';
import { generateId } from '@/lib/utils';

interface ExpenseContextType {
  expenses: Expense[];
  isLoaded: boolean;
  addExpense: (data: { amount: number; category: ExpenseCategory; description: string; date: string }) => void;
  updateExpense: (id: string, data: { amount: number; category: ExpenseCategory; description: string; date: string }) => void;
  deleteExpense: (id: string) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setExpenses(loadExpenses());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveExpenses(expenses);
    }
  }, [expenses, isLoaded]);

  const addExpense = useCallback(
    (data: { amount: number; category: ExpenseCategory; description: string; date: string }) => {
      const expense: Expense = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
      };
      setExpenses((prev) => [expense, ...prev]);
    },
    []
  );

  const updateExpense = useCallback(
    (id: string, data: { amount: number; category: ExpenseCategory; description: string; date: string }) => {
      setExpenses((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      );
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <ExpenseContext.Provider value={{ expenses, isLoaded, addExpense, updateExpense, deleteExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
