"use client";

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse">
      {/* Destination Card Skeleton */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-slate-300 to-slate-200 h-32"></div>
        <div className="p-8 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-full"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
            <div className="h-24 bg-slate-100 rounded-2xl"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-slate-100 rounded-full w-24"></div>
            <div className="h-8 bg-slate-100 rounded-full w-28"></div>
            <div className="h-8 bg-slate-100 rounded-full w-20"></div>
          </div>
        </div>
      </div>

      {/* Flight Skeleton */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
        <div className="px-8 py-6 border-b border-slate-100">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="px-8 py-5 border-b border-slate-50">
            <div className="flex items-center gap-6">
              <div className="h-4 bg-slate-200 rounded w-32"></div>
              <div className="flex-1 h-px bg-slate-200"></div>
              <div className="h-6 bg-slate-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
