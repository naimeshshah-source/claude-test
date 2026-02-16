export interface Attraction {
  name: string;
  description: string;
  imageUrl: string;
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  description: string;
  bestMonths: string[];
  averageTemp: { high: number; low: number };
  highlights: string[];
  imageUrl: string;
  rating: number;
  timezone: string;
  favoriteFood: { name: string; description: string };
  attractions: Attraction[];
}

export interface FlightOption {
  airline: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
}

export interface SearchResult {
  destination: Destination;
  bestTimeToVisit: string;
  currentSeason: string;
  weatherNow: string;
  flights: FlightOption[];
}

export interface MonthlyRecommendation {
  month: string;
  destinations: Destination[];
}

export type SearchStatus = "idle" | "loading" | "success" | "error";
