'use client';

import { useMemo } from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS, ExpenseCategory } from '@/types/expense';
import { formatCurrency } from '@/lib/utils';

const DAILY_BUDGET = 50;

interface DonutSegment {
  category: ExpenseCategory;
  color: string;
  fraction: number;
  amount: number;
}

function DonutChart({ segments, total }: { segments: DonutSegment[]; total: number }) {
  const cx = 90;
  const cy = 90;
  const r = 68;
  const strokeWidth = 22;
  const circumference = 2 * Math.PI * r;

  let cumulativeFraction = 0;

  return (
    <div className="relative flex-shrink-0">
      <svg width="180" height="180" viewBox="0 0 180 180">
        {/* Background ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={strokeWidth}
        />
        {segments.map((seg) => {
          const dashLength = seg.fraction * circumference;
          const dashOffset = -cumulativeFraction * circumference;
          cumulativeFraction += seg.fraction;
          return (
            <circle
              key={seg.category}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90, ${cx}, ${cy})`}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      {/* Center label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-gray-400 font-medium">Spending</span>
        <span className="text-base font-bold text-gray-900 leading-tight">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

export default function MonthlyInsights() {
  const { expenses, isLoaded } = useExpenses();

  const data = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const today = now.getDate();

    const monthlyExpenses = expenses.filter((e) => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

    // Totals per category
    const byCat: Record<string, number> = {};
    CATEGORIES.forEach((c) => (byCat[c] = 0));
    monthlyExpenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] || 0) + e.amount;
    });

    const sorted = CATEGORIES.map((cat) => ({ category: cat as ExpenseCategory, amount: byCat[cat] }))
      .filter((x) => x.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const segments: DonutSegment[] = sorted.map((item) => ({
      category: item.category,
      color: CATEGORY_COLORS[item.category],
      fraction: monthlyTotal > 0 ? item.amount / monthlyTotal : 0,
      amount: item.amount,
    }));

    // Budget streak: consecutive days ending today where daily spending <= DAILY_BUDGET
    let streak = 0;
    for (let d = today; d >= 1; d--) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTotal = monthlyExpenses
        .filter((e) => e.date === dateStr)
        .reduce((sum, e) => sum + e.amount, 0);
      if (dayTotal <= DAILY_BUDGET) {
        streak++;
      } else {
        break;
      }
    }

    const streakPct = today > 0 ? Math.round((streak / today) * 100) : 0;

    return { monthlyTotal, segments, sorted, streak, today, streakPct };
  }, [expenses]);

  if (!isLoaded) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-52" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-72" />
          <div className="bg-white rounded-xl border border-gray-200 p-6 h-72" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Monthly Insights</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Donut Chart + Top Categories */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-5">Spending by Category</h3>

          {data.monthlyTotal === 0 ? (
            <p className="text-sm text-gray-400">No spending recorded this month yet.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <DonutChart segments={data.segments} total={data.monthlyTotal} />

              {/* Top-3 category bars */}
              <div className="flex-1 w-full space-y-4">
                {data.sorted.slice(0, 3).map((item) => {
                  const pct = (item.amount / data.monthlyTotal) * 100;
                  return (
                    <div key={item.category}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-base">{CATEGORY_ICONS[item.category]}</span>
                          <span className="text-sm font-medium text-gray-700">{item.category}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: CATEGORY_COLORS[item.category],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {data.sorted.length > 3 && (
                  <p className="text-xs text-gray-400">
                    +{data.sorted.length - 3} more {data.sorted.length - 3 === 1 ? 'category' : 'categories'}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Budget Streak */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Budget Streak</h3>
          <p className="text-sm text-gray-400 mb-8">
            Consecutive days under ${DAILY_BUDGET}/day this month
          </p>

          <div className="flex flex-col items-center gap-6">
            {/* Big number */}
            <div className="text-center">
              <span className="text-7xl font-black text-green-500 leading-none">{data.streak}</span>
              <p className="text-xl font-bold text-gray-700 mt-2">days!</p>
            </div>

            {/* Progress bar */}
            <div className="w-full">
              <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                <span>0</span>
                <span>{data.today} days elapsed</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-400 rounded-full transition-all duration-700"
                  style={{ width: `${data.streakPct}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                {data.streakPct}% of days within budget
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
