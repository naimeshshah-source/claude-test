"use client";

import Image from "next/image";
import { SearchResult } from "@/types";

function countryFlag(countryCode: string) {
  return countryCode
    .toUpperCase()
    .split("")
    .map((c) => String.fromCodePoint(0x1f1e6 + c.charCodeAt(0) - 65))
    .join("");
}

interface DestinationCardProps {
  result: SearchResult;
}

function SeasonBadge({ season }: { season: string }) {
  const colors: Record<string, string> = {
    peak: "bg-emerald-100 text-emerald-800 border-emerald-200",
    shoulder: "bg-amber-100 text-amber-800 border-amber-200",
    "off-peak": "bg-blue-100 text-blue-800 border-blue-200",
  };

  const labels: Record<string, string> = {
    peak: "Peak Season",
    shoulder: "Shoulder Season",
    "off-peak": "Off-Peak Season",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colors[season] || colors["shoulder"]}`}
    >
      {labels[season] || season}
    </span>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= Math.round(rating) ? "text-yellow-400" : "text-slate-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm text-slate-500">{rating}</span>
    </div>
  );
}

function LocalTime({ timezone }: { timezone: string }) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    weekday: "short",
  });
  return <>{formatter.format(now)}</>;
}

export default function DestinationCard({ result }: DestinationCardProps) {
  const { destination, bestTimeToVisit, currentSeason, weatherNow } = result;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100 transition-all hover:shadow-xl">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-8 text-white">
        <div className="flex items-start justify-between">
          <div>
<<<<<<< HEAD
            <h2 className="text-3xl font-bold">
              <span className="mr-2">{countryFlag(destination.countryCode)}</span>
              {destination.name}
            </h2>
            <p className="text-blue-100 text-lg mt-1">
              <span className="inline-flex items-center gap-1.5">
                {destination.country}
                <span className="bg-white/15 text-white text-xs font-mono px-1.5 py-0.5 rounded">
                  {destination.countryCode}
                </span>
=======
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Image
                src={`https://flagcdn.com/w80/${destination.countryCode.toLowerCase()}.png`}
                alt={`${destination.country} flag`}
                width={40}
                height={30}
                className="rounded shadow-sm"
              />
              {destination.name}
            </h2>
            <p className="text-blue-100 text-lg mt-1 inline-flex items-center gap-1.5">
              {destination.country}
              <span className="bg-white/15 text-white text-xs font-mono px-1.5 py-0.5 rounded">
                {destination.countryCode}
>>>>>>> 603ebe820d0543c46b5721a1d66ed62624f14aff
              </span>
            </p>
          </div>
          <div className="text-right">
            <StarRating rating={destination.rating} />
            <SeasonBadge season={currentSeason} />
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Description */}
        <p className="text-slate-600 text-lg leading-relaxed mb-6">
          {destination.description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Best Time */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-emerald-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="font-semibold text-emerald-800">
                Best Time to Visit
              </h3>
            </div>
            <p className="text-emerald-700">{bestTimeToVisit}</p>
          </div>

          {/* Weather */}
          <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-sky-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <h3 className="font-semibold text-sky-800">Current Weather</h3>
            </div>
            <p className="text-sky-700">{weatherNow}</p>
          </div>

          {/* Local Time */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-5 border border-violet-100">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-5 h-5 text-violet-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-violet-800">Local Time</h3>
            </div>
            <p className="text-violet-700">
              <LocalTime timezone={destination.timezone} />
            </p>
          </div>
        </div>

        {/* Local Favorite Food */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 border border-orange-100 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <svg
              className="w-5 h-5 text-orange-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <h3 className="font-semibold text-orange-800">Local Favorite Food</h3>
          </div>
          <p className="text-orange-900 font-bold text-lg">{destination.favoriteFood.name}</p>
          <p className="text-orange-700 text-sm mt-1">{destination.favoriteFood.description}</p>
        </div>

        {/* Highlights */}
        <div className="mb-2">
          <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
            Top Highlights
          </h3>
          <div className="flex flex-wrap gap-2">
            {destination.highlights.map((h) => (
              <a
                key={h}
                href={`https://www.google.com/search?q=${encodeURIComponent(h + " " + destination.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-indigo-100 hover:text-indigo-700 transition-colors cursor-pointer"
              >
                {h}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
