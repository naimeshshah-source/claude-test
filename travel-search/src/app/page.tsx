"use client";

import { useState, useCallback } from "react";
import { SearchResult, SearchStatus } from "@/types";
import SearchForm from "@/components/SearchForm";
import DestinationCard from "@/components/DestinationCard";
import FlightResults from "@/components/FlightResults";
import MonthlyRecommendations from "@/components/MonthlyRecommendations";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Home() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [status, setStatus] = useState<SearchStatus>("idle");
  const [error, setError] = useState("");

  const handleSearch = useCallback(async (query: string) => {
    setStatus("loading");
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setResult(data);
      setStatus("success");
    } catch {
      setError("Failed to connect. Please check your connection and try again.");
      setStatus("error");
    }
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-20">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-2">
              <svg
                className="w-8 h-8 text-blue-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xl font-bold">TravelScout</span>
            </div>
            <div className="hidden sm:flex items-center gap-6 text-sm text-blue-200">
              <a href="#search" className="hover:text-white transition-colors">
                Search
              </a>
              <a
                href="#recommendations"
                className="hover:text-white transition-colors"
              >
                Recommendations
              </a>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Discover Your Next
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
                Adventure
              </span>
            </h1>
            <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Find the perfect time to visit any destination, explore flight
              options from Boston, and get personalized travel recommendations.
            </p>

            <div id="search">
              <SearchForm
                onSearch={handleSearch}
                isLoading={status === "loading"}
              />
            </div>

            {/* Quick Suggestions */}
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <span className="text-blue-300 text-sm">Popular:</span>
              {["Paris", "Tokyo", "Bali", "Barcelona", "Santorini"].map(
                (dest) => (
                  <button
                    key={dest}
                    onClick={() => handleSearch(dest)}
                    className="text-sm text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition-all"
                  >
                    {dest}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 60"
            className="w-full h-auto"
            preserveAspectRatio="none"
          >
            <path
              d="M0,40 C360,80 720,0 1440,40 L1440,60 L0,60 Z"
              fill="#f8fafc"
            />
          </svg>
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-4xl mx-auto px-4 py-8 -mt-4">
        {status === "loading" && <LoadingSkeleton />}

        {status === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <svg
              className="w-12 h-12 text-red-400 mx-auto mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {status === "success" && result && (
          <div className="space-y-6">
            <DestinationCard result={result} />
            <FlightResults
              flights={result.flights}
              destination={result.destination.name}
            />
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      <section id="recommendations" className="max-w-6xl mx-auto px-4 py-16">
        <MonthlyRecommendations />
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-white font-semibold">TravelScout</span>
          </div>
          <p className="text-sm">
            Discover the best time to visit any destination worldwide.
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Flight prices are estimates for reference only.
          </p>
        </div>
      </footer>
    </main>
  );
}
