'use client';

import { useState, useEffect } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { Expense, ExpenseCategory, CATEGORIES, CATEGORY_ICONS } from '@/types/expense';
import { getTodayString } from '@/lib/utils';

interface ExpenseFormProps {
  editingExpense?: Expense | null;
  onDone?: () => void;
}

interface FormErrors {
  amount?: string;
  description?: string;
  date?: string;
}

export default function ExpenseForm({ editingExpense, onDone }: ExpenseFormProps) {
  const { addExpense, updateExpense } = useExpenses();
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Food');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setAmount(editingExpense.amount.toString());
      setCategory(editingExpense.category);
      setDescription(editingExpense.description);
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  function validate(): boolean {
    const newErrors: FormErrors = {};
    const amt = parseFloat(amount);
    if (!amount || isNaN(amt) || amt <= 0) {
      newErrors.amount = 'Enter a valid amount greater than 0';
    }
    if (amt > 999999.99) {
      newErrors.amount = 'Amount must be less than $1,000,000';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (description.trim().length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }
    if (!date) {
      newErrors.date = 'Date is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      amount: Math.round(parseFloat(amount) * 100) / 100,
      category,
      description: description.trim(),
      date,
    };

    if (editingExpense) {
      updateExpense(editingExpense.id, data);
    } else {
      addExpense(data);
    }

    // Reset form
    setAmount('');
    setCategory('Food');
    setDescription('');
    setDate(getTodayString());
    setErrors({});
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($)
          </label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (errors.amount) setErrors((prev) => ({ ...prev, amount: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.amount ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              if (errors.date) setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.date ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat]} {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <input
            id="description"
            type="text"
            placeholder="What was this expense for?"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description) setErrors((prev) => ({ ...prev, description: undefined }));
            }}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingExpense && onDone && (
          <button
            type="button"
            onClick={onDone}
            className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        )}
        {showSuccess && (
          <span className="text-emerald-600 text-sm font-medium animate-fade-in">
            {editingExpense ? 'Updated!' : 'Added!'}
          </span>
        )}
      </div>
    </form>
  );
}
