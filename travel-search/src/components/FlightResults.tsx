"use client";

import { FlightOption } from "@/types";

interface FlightResultsProps {
  flights: FlightOption[];
  destination: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function FlightResults({
  flights,
  destination,
}: FlightResultsProps) {
  if (!flights.length) return null;

  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-100">
      <div className="px-8 py-6 border-b border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
          Flights from Boston to {destination}
        </h3>
        <p className="text-slate-500 mt-1">
          {flights.length} options found — sorted by price
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {flights.map((flight, idx) => (
          <div
            key={idx}
            className="px-8 py-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center gap-4"
          >
            {/* Airline */}
            <div className="md:w-44 flex-shrink-0">
              <p className="font-semibold text-slate-800">{flight.airline}</p>
              <p className="text-sm text-slate-500">
                {flight.stops === 0
                  ? "Nonstop"
                  : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </p>
            </div>

            {/* Route */}
            <div className="flex-1 flex items-center gap-3">
              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">
                  {flight.departureTime}
                </p>
                <p className="text-xs text-slate-500">BOS</p>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <p className="text-xs text-slate-400 mb-1">
                  {flight.duration}
                </p>
                <div className="w-full flex items-center">
                  <div className="h-px flex-1 bg-slate-300"></div>
                  <svg
                    className="w-4 h-4 text-slate-400 -mx-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {flight.stops > 0 && (
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: flight.stops }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-amber-400"
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="text-center">
                <p className="font-bold text-slate-800 text-lg">
                  {flight.arrivalTime}
                </p>
                <p className="text-xs text-slate-500">
                  {flight.arrival.match(/\(([^)]+)\)/)?.[1] || "DST"}
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="md:w-32 text-right flex-shrink-0">
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(flight.price)}
              </p>
              <p className="text-xs text-slate-500">per person</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
