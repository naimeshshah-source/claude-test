'use client';

import ExpenseForm from '@/components/ExpenseForm';

export default function AddExpensePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add Expense</h1>
        <p className="text-sm text-gray-500 mt-1">Record a new expense</p>
      </div>
      <ExpenseForm />
    </div>
  );
}
