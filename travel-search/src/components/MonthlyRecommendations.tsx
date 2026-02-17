"use client";

import { useState, useEffect } from "react";
import { Destination } from "@/types";

function countryFlag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MonthlyRecommendations() {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getMonth()]
  );
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/recommendations?month=${encodeURIComponent(selectedMonth)}`
        );
        const data = await res.json();
        setDestinations(data.destinations);
      } catch {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [selectedMonth]);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Where to Go This Month
        </h2>
        <p className="text-slate-500">
          Discover the best destinations for each month of the year
        </p>
      </div>

      {/* Month Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {months.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedMonth === month
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {month.substring(0, 3)}
          </button>
        ))}
      </div>

      {/* Destinations */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 border border-slate-100 animate-pulse"
            >
              <div className="h-6 bg-slate-200 rounded w-1/2 mb-3"></div>
              <div className="h-4 bg-slate-100 rounded w-1/3 mb-4"></div>
              <div className="h-20 bg-slate-100 rounded mb-4"></div>
              <div className="flex gap-2">
                <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                <div className="h-6 bg-slate-100 rounded-full w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : destinations.length === 0 ? (
        <p className="text-center text-slate-500 py-8">
          No recommendations found for {selectedMonth}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div
              key={dest.name}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group cursor-default"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    <span className="mr-1.5">{countryFlag(dest.countryCode)}</span>
                    {dest.name}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    <span className="inline-flex items-center gap-1.5">
                      {dest.country}
                      <span className="bg-slate-100 text-slate-500 text-xs font-mono px-1.5 py-0.5 rounded">
                        {dest.countryCode}
                      </span>
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <svg
                    className="w-3.5 h-3.5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-semibold text-yellow-700">
                    {dest.rating}
                  </span>
                </div>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                {dest.description}
              </p>

              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-4 h-4 text-emerald-500 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-emerald-700 font-medium">
                  {dest.averageTemp.high}°C High / {dest.averageTemp.low}°C Low
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {dest.highlights.slice(0, 3).map((h) => (
                  <span
                    key={h}
                    className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
