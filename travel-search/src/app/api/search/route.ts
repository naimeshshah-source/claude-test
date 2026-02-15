import { NextRequest, NextResponse } from "next/server";
import {
  searchDestination,
  getBestTimeToVisit,
  getCurrentSeason,
  getWeatherDescription,
  generateFlights,
} from "@/lib/travel-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { error: "Please provide a destination to search" },
      { status: 400 }
    );
  }

  // Simulate network delay for realistic UX
  await new Promise((resolve) => setTimeout(resolve, 800));

  const destination = searchDestination(query);

  if (!destination) {
    return NextResponse.json(
      {
        error: `No results found for "${query}". Try searching for popular destinations like Paris, Tokyo, Bali, or Barcelona.`,
      },
      { status: 404 }
    );
  }

  const season = getCurrentSeason(destination);

  return NextResponse.json({
    destination,
    bestTimeToVisit: getBestTimeToVisit(destination),
    currentSeason: season,
    weatherNow: getWeatherDescription(destination, season),
    flights: generateFlights(destination),
  });
}
