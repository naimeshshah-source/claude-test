export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  createdAt: string; // ISO datetime string
}

export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export const CATEGORIES: ExpenseCategory[] = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Bills',
  'Other',
];

export const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  Food: '#ef4444',
  Transportation: '#3b82f6',
  Entertainment: '#8b5cf6',
  Shopping: '#f59e0b',
  Bills: '#10b981',
  Other: '#6b7280',
};

export const CATEGORY_ICONS: Record<ExpenseCategory, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦',
};

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  search: string;
  category: ExpenseCategory | 'All';
  dateFrom: string;
  dateTo: string;
  sortBy: 'date' | 'amount' | 'category';
  sortOrder: 'asc' | 'desc';
}
