'use client';

import Dashboard from '@/components/Dashboard';

const VIDEO_URL = ''; // Replace with your video URL (YouTube, Loom, etc.)

export default function Home() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your spending habits</p>
      </div>
      <Dashboard />

      {/* Video Tutorial Section */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorial</h3>
        <p className="text-sm text-gray-500 mb-4">
          Learn how to get the most out of ExpenseTracker — adding expenses, filtering, exporting reports, and more.
        </p>
        {VIDEO_URL ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
            <iframe
              src={VIDEO_URL}
              title="ExpenseTracker Tutorial"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-gray-400 font-medium">Video tutorial coming soon</p>
            <p className="text-xs text-gray-300 mt-1">Add your video URL in src/app/page.tsx</p>
          </div>
        )}
      </div>

      {/* Credits */}
      <div className="mt-6 text-center py-4 border-t border-gray-100">
        <p className="text-sm text-gray-400">
          Built with care by <span className="font-medium text-gray-600">Naimesh Shah</span> - feature-data-export-v3
        </p>
      </div>
    </div>
  );
}
