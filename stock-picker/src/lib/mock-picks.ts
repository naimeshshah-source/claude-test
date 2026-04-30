export interface Sector {
  name: string;
  slug: string;
  emoji: string;
  description: string;
}

export interface StockPick {
  ticker: string;
  name: string;
  price: number;
  changePercent: number;
  marketCap: string;
}

const SECTORS: Sector[] = [
  { name: "Technology", slug: "technology", emoji: "💻", description: "Software, hardware & semiconductors" },
  { name: "Healthcare", slug: "healthcare", emoji: "🏥", description: "Pharma, biotech & medtech" },
  { name: "Energy", slug: "energy", emoji: "⚡", description: "Oil, gas & renewables" },
  { name: "Financials", slug: "financials", emoji: "🏦", description: "Banks, insurance & capital markets" },
  { name: "Consumer Discretionary", slug: "consumer-discretionary", emoji: "🛍️", description: "Retail, autos & leisure" },
  { name: "Consumer Staples", slug: "consumer-staples", emoji: "🛒", description: "Food, beverage & household" },
  { name: "Industrials", slug: "industrials", emoji: "🏭", description: "Aerospace, defense & manufacturing" },
  { name: "Materials", slug: "materials", emoji: "⚙️", description: "Chemicals, metals & mining" },
  { name: "Real Estate", slug: "real-estate", emoji: "🏠", description: "REITs & real estate services" },
  { name: "Utilities", slug: "utilities", emoji: "💡", description: "Electric, gas & water utilities" },
  { name: "Communication Services", slug: "communication-services", emoji: "📡", description: "Telecom, media & internet" },
];

const PICKS: Record<string, StockPick[]> = {
  technology: [
    { ticker: "NVDA", name: "Nvidia Corp.", price: 875.40, changePercent: 3.12, marketCap: "2.1T" },
    { ticker: "MSFT", name: "Microsoft Corp.", price: 415.50, changePercent: 0.87, marketCap: "3.1T" },
    { ticker: "AAPL", name: "Apple Inc.", price: 187.32, changePercent: 1.24, marketCap: "2.9T" },
    { ticker: "META", name: "Meta Platforms", price: 523.60, changePercent: 1.98, marketCap: "1.3T" },
    { ticker: "GOOGL", name: "Alphabet Inc.", price: 172.18, changePercent: -0.43, marketCap: "2.1T" },
  ],
  healthcare: [
    { ticker: "LLY", name: "Eli Lilly & Co.", price: 784.20, changePercent: 2.41, marketCap: "745B" },
    { ticker: "UNH", name: "UnitedHealth Group", price: 524.75, changePercent: 0.65, marketCap: "484B" },
    { ticker: "ABBV", name: "AbbVie Inc.", price: 168.90, changePercent: 0.94, marketCap: "298B" },
    { ticker: "JNJ", name: "Johnson & Johnson", price: 158.40, changePercent: -0.32, marketCap: "381B" },
    { ticker: "PFE", name: "Pfizer Inc.", price: 27.85, changePercent: -1.87, marketCap: "157B" },
  ],
  energy: [
    { ticker: "XOM", name: "Exxon Mobil", price: 113.45, changePercent: 0.52, marketCap: "452B" },
    { ticker: "COP", name: "ConocoPhillips", price: 118.60, changePercent: 1.15, marketCap: "142B" },
    { ticker: "CVX", name: "Chevron Corp.", price: 157.80, changePercent: -0.28, marketCap: "291B" },
    { ticker: "EOG", name: "EOG Resources", price: 128.90, changePercent: 0.83, marketCap: "76B" },
    { ticker: "SLB", name: "SLB", price: 47.25, changePercent: -0.73, marketCap: "67B" },
  ],
  financials: [
    { ticker: "JPM", name: "JPMorgan Chase", price: 198.75, changePercent: 0.41, marketCap: "576B" },
    { ticker: "GS", name: "Goldman Sachs", price: 473.50, changePercent: 1.34, marketCap: "156B" },
    { ticker: "WFC", name: "Wells Fargo", price: 57.90, changePercent: 0.88, marketCap: "209B" },
    { ticker: "BRK.B", name: "Berkshire Hathaway B", price: 372.40, changePercent: -0.15, marketCap: "815B" },
    { ticker: "BAC", name: "Bank of America", price: 38.20, changePercent: -0.26, marketCap: "302B" },
  ],
};

function fallback(sector: string): StockPick[] {
  return [
    { ticker: "TBD1", name: `${sector} Leader 1`, price: 100.00, changePercent: 0.50, marketCap: "—" },
    { ticker: "TBD2", name: `${sector} Leader 2`, price: 85.00, changePercent: -0.30, marketCap: "—" },
    { ticker: "TBD3", name: `${sector} Leader 3`, price: 210.00, changePercent: 1.20, marketCap: "—" },
    { ticker: "TBD4", name: `${sector} Leader 4`, price: 54.00, changePercent: 0.10, marketCap: "—" },
    { ticker: "TBD5", name: `${sector} Leader 5`, price: 320.00, changePercent: -0.75, marketCap: "—" },
  ];
}

export async function getSectors(): Promise<Sector[]> {
  return SECTORS;
}

export async function getPicksForSector(slug: string): Promise<StockPick[]> {
  return PICKS[slug] ?? fallback(slug);
}

export function getSectorBySlug(slug: string): Sector | undefined {
  return SECTORS.find((s) => s.slug === slug);
}
