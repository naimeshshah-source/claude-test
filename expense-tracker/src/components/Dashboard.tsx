'use client';

import { useMemo } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { ExpenseCategory, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';
import { exportDashboardToPDF } from '@/lib/storage';

export default function Dashboard() {
  const { expenses, isLoaded } = useExpenses();

  const stats = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenses.filter((e) => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    const byCategory: Record<string, number> = {};
    CATEGORIES.forEach((c) => (byCategory[c] = 0));
    expenses.forEach((e) => (byCategory[e.category] = (byCategory[e.category] || 0) + e.amount));

    const monthlyCategoryTotals: Record<string, number> = {};
    CATEGORIES.forEach((c) => (monthlyCategoryTotals[c] = 0));
    monthlyExpenses.forEach(
      (e) => (monthlyCategoryTotals[e.category] = (monthlyCategoryTotals[e.category] || 0) + e.amount)
    );

    const topCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0];

    // Last 6 months spending
    const monthlyTrend: { month: string; amount: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const amount = expenses
        .filter((e) => {
          const ed = new Date(e.date + 'T00:00:00');
          return ed.getMonth() === m && ed.getFullYear() === y;
        })
        .reduce((sum, e) => sum + e.amount, 0);
      monthlyTrend.push({
        month: d.toLocaleDateString('en-US', { month: 'short' }),
        amount,
      });
    }

    const avgDaily = monthlyTotal / now.getDate();

    return {
      total,
      monthlyTotal,
      byCategory,
      monthlyCategoryTotals,
      topCategory,
      monthlyTrend,
      avgDaily,
      expenseCount: expenses.length,
      monthlyCount: monthlyExpenses.length,
    };
  }, [expenses]);

  if (!isLoaded) {
    return <DashboardSkeleton />;
  }

  const maxTrend = Math.max(...stats.monthlyTrend.map((t) => t.amount), 1);
  const maxCategory = Math.max(...Object.values(stats.monthlyCategoryTotals), 1);

  return (
    <div className="space-y-6">
      {/* Header with PDF export */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => exportDashboardToPDF(expenses, stats.monthlyTrend)}
          disabled={expenses.length === 0}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Spending"
          value={formatCurrency(stats.total)}
          subtitle={`${stats.expenseCount} expenses`}
          color="bg-blue-500"
        />
        <SummaryCard
          title="This Month"
          value={formatCurrency(stats.monthlyTotal)}
          subtitle={`${stats.monthlyCount} expenses`}
          color="bg-emerald-500"
        />
        <SummaryCard
          title="Daily Average"
          value={formatCurrency(stats.avgDaily)}
          subtitle="This month"
          color="bg-violet-500"
        />
        <SummaryCard
          title="Top Category"
          value={stats.topCategory ? stats.topCategory[0] : 'N/A'}
          subtitle={stats.topCategory ? formatCurrency(stats.topCategory[1]) : ''}
          color="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <div className="flex items-end gap-2 h-48">
            {stats.monthlyTrend.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500 font-medium">
                  {item.amount > 0 ? formatCurrency(item.amount) : ''}
                </span>
                <div
                  className="w-full bg-blue-500 rounded-t-md transition-all duration-500 min-h-[4px]"
                  style={{ height: `${Math.max((item.amount / maxTrend) * 160, 4)}px` }}
                />
                <span className="text-xs text-gray-600 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown (this month) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month by Category</h3>
          <div className="space-y-3">
            {CATEGORIES.map((cat) => {
              const amount = stats.monthlyCategoryTotals[cat] || 0;
              const pct = maxCategory > 0 ? (amount / maxCategory) * 100 : 0;
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg w-7">{CATEGORY_ICONS[cat]}</span>
                  <span className="text-sm font-medium text-gray-700 w-28">{cat}</span>
                  <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: CATEGORY_COLORS[cat as ExpenseCategory],
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                    {formatCurrency(amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* All-time category pie representation */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">All-Time Spending Distribution</h3>
        {stats.total > 0 ? (
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((cat) => {
              const amount = stats.byCategory[cat] || 0;
              const pct = stats.total > 0 ? (amount / stats.total) * 100 : 0;
              if (amount === 0) return null;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200"
                  style={{ borderLeftColor: CATEGORY_COLORS[cat as ExpenseCategory], borderLeftWidth: 4 }}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800">{cat}</div>
                    <div className="text-xs text-gray-500">
                      {formatCurrency(amount)} ({pct.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No expenses recorded yet. Add your first expense to see analytics.</p>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 h-28">
            <div className="h-3 bg-gray-200 rounded w-24 mb-3" />
            <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
            <div className="h-2 bg-gray-100 rounded w-20" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-72" />
        <div className="bg-white rounded-xl border border-gray-200 p-6 h-72" />
      </div>
    </div>
  );
}
