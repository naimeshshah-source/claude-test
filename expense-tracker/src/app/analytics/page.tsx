// Analytics Dashboard Page — /analytics
// TODO: fetch real expense data and wire up analytics functions

import SpendingTrendChart from '@/components/charts/SpendingTrendChart';
import { getSpendingTrends, getCategoryBreakdown, getInsights } from '@/lib/analytics';

export default function AnalyticsPage() {
  // Stub: replace with actual data fetching (e.g. from storage/db)
  const expenses: never[] = [];

  const trends    = getSpendingTrends(expenses);
  const breakdown = getCategoryBreakdown(expenses);
  const insights  = getInsights(trends, breakdown);

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-2xl font-bold">Analytics</h1>

      {/* Insights */}
      {insights.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Insights</h2>
          <ul className="space-y-2">
            {insights.map((insight, i) => (
              <li key={i} className="p-3 bg-yellow-50 rounded-lg text-sm">
                {insight.message}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Spending Trends */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Monthly Spending</h2>
        <SpendingTrendChart trends={trends} />
      </section>

      {/* Category Breakdown */}
      <section>
        <h2 className="text-lg font-semibold mb-3">By Category</h2>
        {breakdown.length === 0 ? (
          <p className="text-gray-400 text-sm">No category data available.</p>
        ) : (
          <ul className="space-y-2">
            {breakdown.map(({ category, total, percentage }) => (
              <li key={category} className="flex justify-between text-sm">
                <span>{category}</span>
                <span className="text-gray-500">
                  ${total.toFixed(2)} ({percentage.toFixed(1)}%)
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
