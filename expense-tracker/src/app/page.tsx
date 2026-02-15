'use client';

import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your spending habits</p>
      </div>
      <Dashboard />
    </div>
  );
}
