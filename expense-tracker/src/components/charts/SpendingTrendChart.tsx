'use client';

// SpendingTrendChart — line/bar chart of monthly spending totals
// TODO: replace stub data with real analytics once getSpendingTrends is implemented

import { SpendingTrend } from '@/lib/analytics';

interface Props {
  trends: SpendingTrend[];
}

export default function SpendingTrendChart({ trends }: Props) {
  if (trends.length === 0) {
    return <p className="text-gray-400 text-sm">No trend data available.</p>;
  }

  // TODO: swap placeholder bars for a proper charting library (e.g. Recharts)
  const max = Math.max(...trends.map((t) => t.total), 1);

  return (
    <div className="space-y-2">
      {trends.map(({ month, total }) => (
        <div key={month} className="flex items-center gap-3">
          <span className="w-16 text-xs text-gray-500">{month}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 bg-blue-500 rounded-full"
              style={{ width: `${(total / max) * 100}%` }}
            />
          </div>
          <span className="w-16 text-right text-xs font-medium">${total.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
