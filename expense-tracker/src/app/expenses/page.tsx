'use client';

import ExpenseList from '@/components/ExpenseList';

export default function ExpensesPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <p className="text-sm text-gray-500 mt-1">View, search, and manage your expenses</p>
      </div>
      <ExpenseList />
    </div>
  );
}
