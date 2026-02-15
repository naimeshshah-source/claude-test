import { Destination, FlightOption } from "@/types";

const destinations: Record<string, Destination> = {
  paris: {
    name: "Paris",
    country: "France",
    description:
      "The City of Light enchants visitors with its iconic landmarks, world-class museums, and charming café culture. From the Eiffel Tower to Montmartre, every corner tells a story.",
    bestMonths: ["April", "May", "June", "September", "October"],
    averageTemp: { high: 20, low: 10 },
    highlights: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame Cathedral",
      "Montmartre",
      "Seine River Cruise",
    ],
    imageUrl: "/destinations/paris.jpg",
    rating: 4.8,
  },
  tokyo: {
    name: "Tokyo",
    country: "Japan",
    description:
      "A mesmerizing blend of ultramodern and traditional, Tokyo dazzles with neon-lit skyscrapers, ancient temples, incredible food, and a culture that seamlessly bridges past and future.",
    bestMonths: ["March", "April", "May", "October", "November"],
    averageTemp: { high: 22, low: 12 },
    highlights: [
      "Shibuya Crossing",
      "Senso-ji Temple",
      "Tsukiji Fish Market",
      "Meiji Shrine",
      "Akihabara",
    ],
    imageUrl: "/destinations/tokyo.jpg",
    rating: 4.9,
  },
  bali: {
    name: "Bali",
    country: "Indonesia",
    description:
      "A tropical paradise known for its lush rice terraces, stunning temples, vibrant arts scene, and world-class surfing. Bali offers spiritual rejuvenation and adventure in equal measure.",
    bestMonths: ["April", "May", "June", "July", "August", "September"],
    averageTemp: { high: 30, low: 24 },
    highlights: [
      "Ubud Rice Terraces",
      "Uluwatu Temple",
      "Seminyak Beach",
      "Mount Batur Sunrise",
      "Tanah Lot",
    ],
    imageUrl: "/destinations/bali.jpg",
    rating: 4.7,
  },
  barcelona: {
    name: "Barcelona",
    country: "Spain",
    description:
      "A vibrant Mediterranean gem where Gaudí's fantastical architecture meets golden beaches, incredible tapas, and an electric nightlife scene that pulses through winding Gothic streets.",
    bestMonths: ["May", "June", "September", "October"],
    averageTemp: { high: 24, low: 14 },
    highlights: [
      "Sagrada Familia",
      "Park Güell",
      "La Rambla",
      "Gothic Quarter",
      "Barceloneta Beach",
    ],
    imageUrl: "/destinations/barcelona.jpg",
    rating: 4.7,
  },
  "new york": {
    name: "New York",
    country: "USA",
    description:
      "The city that never sleeps offers an unmatched energy with iconic skyline views, Broadway shows, diverse neighborhoods, world-class dining, and cultural institutions at every turn.",
    bestMonths: ["April", "May", "June", "September", "October", "November"],
    averageTemp: { high: 18, low: 8 },
    highlights: [
      "Central Park",
      "Statue of Liberty",
      "Times Square",
      "Brooklyn Bridge",
      "Metropolitan Museum",
    ],
    imageUrl: "/destinations/newyork.jpg",
    rating: 4.6,
  },
  london: {
    name: "London",
    country: "United Kingdom",
    description:
      "A city steeped in history yet buzzing with contemporary culture. From Buckingham Palace to Borough Market, London offers royal grandeur alongside cutting-edge art and cuisine.",
    bestMonths: ["May", "June", "July", "August", "September"],
    averageTemp: { high: 18, low: 9 },
    highlights: [
      "Tower of London",
      "British Museum",
      "Buckingham Palace",
      "West End Theatre",
      "Hyde Park",
    ],
    imageUrl: "/destinations/london.jpg",
    rating: 4.7,
  },
  rome: {
    name: "Rome",
    country: "Italy",
    description:
      "The Eternal City where ancient ruins stand alongside Renaissance masterpieces. Savor la dolce vita with incredible pasta, gelato, and espresso amid 3,000 years of history.",
    bestMonths: ["April", "May", "June", "September", "October"],
    averageTemp: { high: 24, low: 12 },
    highlights: [
      "Colosseum",
      "Vatican City",
      "Trevi Fountain",
      "Roman Forum",
      "Pantheon",
    ],
    imageUrl: "/destinations/rome.jpg",
    rating: 4.8,
  },
  dubai: {
    name: "Dubai",
    country: "UAE",
    description:
      "A futuristic oasis of luxury rising from the desert. Dubai dazzles with record-breaking architecture, lavish shopping malls, golden beaches, and an ever-evolving skyline.",
    bestMonths: [
      "November",
      "December",
      "January",
      "February",
      "March",
    ],
    averageTemp: { high: 32, low: 20 },
    highlights: [
      "Burj Khalifa",
      "Dubai Mall",
      "Palm Jumeirah",
      "Desert Safari",
      "Dubai Marina",
    ],
    imageUrl: "/destinations/dubai.jpg",
    rating: 4.6,
  },
  sydney: {
    name: "Sydney",
    country: "Australia",
    description:
      "A stunning harbor city where golden beaches meet cosmopolitan culture. Iconic landmarks, world-class dining, and year-round outdoor adventures make Sydney truly unforgettable.",
    bestMonths: ["September", "October", "November", "March", "April", "May"],
    averageTemp: { high: 24, low: 16 },
    highlights: [
      "Sydney Opera House",
      "Harbour Bridge",
      "Bondi Beach",
      "Darling Harbour",
      "Blue Mountains",
    ],
    imageUrl: "/destinations/sydney.jpg",
    rating: 4.7,
  },
  "machu picchu": {
    name: "Machu Picchu",
    country: "Peru",
    description:
      "The Lost City of the Incas perched high in the Andes. This breathtaking archaeological wonder offers a profound connection to ancient civilization amid dramatic mountain scenery.",
    bestMonths: ["April", "May", "September", "October"],
    averageTemp: { high: 20, low: 8 },
    highlights: [
      "Inca Trail",
      "Sun Gate",
      "Temple of the Sun",
      "Huayna Picchu",
      "Sacred Valley",
    ],
    imageUrl: "/destinations/machupicchu.jpg",
    rating: 4.9,
  },
  santorini: {
    name: "Santorini",
    country: "Greece",
    description:
      "A breathtaking volcanic island with iconic white-washed buildings and blue domes perched on dramatic cliffs overlooking the azure Aegean Sea. Famous for spectacular sunsets.",
    bestMonths: ["May", "June", "September", "October"],
    averageTemp: { high: 26, low: 18 },
    highlights: [
      "Oia Sunset",
      "Red Beach",
      "Fira Town",
      "Akrotiri Ruins",
      "Wine Tasting",
    ],
    imageUrl: "/destinations/santorini.jpg",
    rating: 4.8,
  },
  maldives: {
    name: "Maldives",
    country: "Maldives",
    description:
      "A tropical paradise of crystal-clear turquoise waters, pristine white-sand beaches, and luxury overwater villas. The ultimate destination for diving, relaxation, and romance.",
    bestMonths: [
      "November",
      "December",
      "January",
      "February",
      "March",
      "April",
    ],
    averageTemp: { high: 31, low: 26 },
    highlights: [
      "Overwater Villas",
      "Snorkeling & Diving",
      "Bioluminescent Beach",
      "Whale Shark Spotting",
      "Underwater Restaurant",
    ],
    imageUrl: "/destinations/maldives.jpg",
    rating: 4.9,
  },
};

const airlines = [
  "Delta Air Lines",
  "JetBlue Airways",
  "United Airlines",
  "American Airlines",
  "Emirates",
  "British Airways",
  "Lufthansa",
  "Air France",
  "Japan Airlines",
  "Singapore Airlines",
  "Qatar Airways",
  "Turkish Airlines",
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function searchDestination(query: string): Destination | null {
  const key = query.toLowerCase().trim();
  // Direct match
  if (destinations[key]) return destinations[key];
  // Partial match
  for (const [k, v] of Object.entries(destinations)) {
    if (k.includes(key) || v.country.toLowerCase().includes(key)) {
      return v;
    }
  }
  return null;
}

export function getAllDestinations(): Destination[] {
  return Object.values(destinations);
}

export function getBestTimeToVisit(destination: Destination): string {
  const best = destination.bestMonths;
  if (best.length <= 2) return best.join(" and ");
  return `${best.slice(0, -1).join(", ")}, and ${best[best.length - 1]}`;
}

export function getCurrentSeason(destination: Destination): string {
  const currentMonth = months[new Date().getMonth()];
  if (destination.bestMonths.includes(currentMonth)) {
    return "peak";
  }
  // Check if within one month of peak
  const currentIdx = new Date().getMonth();
  for (const m of destination.bestMonths) {
    const mIdx = months.indexOf(m);
    if (Math.abs(currentIdx - mIdx) <= 1 || Math.abs(currentIdx - mIdx) >= 11) {
      return "shoulder";
    }
  }
  return "off-peak";
}

export function getWeatherDescription(
  destination: Destination,
  season: string
): string {
  const { high, low } = destination.averageTemp;
  const seasonDescriptions: Record<string, string> = {
    peak: `Perfect weather with temperatures around ${high}°C (${Math.round(high * 1.8 + 32)}°F). Ideal conditions for sightseeing and outdoor activities.`,
    shoulder: `Pleasant weather with mild temperatures between ${low}°C and ${high}°C (${Math.round(low * 1.8 + 32)}°F–${Math.round(high * 1.8 + 32)}°F). Fewer crowds and good value.`,
    "off-peak": `Off-season temperatures around ${low}°C (${Math.round(low * 1.8 + 32)}°F). Budget-friendly with fewer tourists, but weather may be less ideal.`,
  };
  return seasonDescriptions[season] || seasonDescriptions["shoulder"];
}

export function generateFlights(destination: Destination): FlightOption[] {
  const basePrice: Record<string, number> = {
    France: 450,
    Japan: 850,
    Indonesia: 950,
    Spain: 500,
    USA: 180,
    "United Kingdom": 550,
    Italy: 520,
    UAE: 750,
    Australia: 1200,
    Peru: 600,
    Greece: 620,
    Maldives: 1100,
  };

  const price = basePrice[destination.country] || 600;
  const numFlights = 4 + Math.floor(Math.random() * 3);
  const flights: FlightOption[] = [];

  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)];
    const stops = Math.random() > 0.4 ? (Math.random() > 0.5 ? 2 : 1) : 0;
    const baseHours = stops === 0 ? 6 + Math.random() * 10 : 10 + Math.random() * 14;
    const hours = Math.floor(baseHours);
    const minutes = Math.floor(Math.random() * 60);
    const departHour = 5 + Math.floor(Math.random() * 16);
    const departMin = Math.floor(Math.random() * 60);
    const arriveHour = (departHour + hours) % 24;
    const arriveMin = (departMin + minutes) % 60;
    const variation = 0.7 + Math.random() * 0.8;
    const finalPrice = Math.round(price * variation * (stops === 0 ? 1.3 : stops === 1 ? 1 : 0.85));

    flights.push({
      airline,
      departure: "Boston (BOS)",
      arrival: `${destination.name} (${destination.name.substring(0, 3).toUpperCase()})`,
      duration: `${hours}h ${minutes}m`,
      stops,
      price: finalPrice,
      departureTime: `${departHour.toString().padStart(2, "0")}:${departMin.toString().padStart(2, "0")}`,
      arrivalTime: `${arriveHour.toString().padStart(2, "0")}:${arriveMin.toString().padStart(2, "0")}`,
    });
  }

  return flights.sort((a, b) => a.price - b.price);
}

export function getMonthlyRecommendations(month?: string) {
  const targetMonth = month || months[new Date().getMonth()];
  const allDests = Object.values(destinations);
  const recommended = allDests.filter((d) =>
    d.bestMonths.includes(targetMonth)
  );
  return {
    month: targetMonth,
    destinations: recommended.length > 0 ? recommended : allDests.slice(0, 4),
  };
}
