import Link from "next/link";
import { notFound } from "next/navigation";
import { getPicksForSector, getSectorBySlug } from "@/lib/mock-picks";
import StockCard from "@/components/StockCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SectorPage({ params }: PageProps) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  const picks = await getPicksForSector(slug);

  return (
    <div>
      <nav className="mb-8">
        <Link
          href="/"
          className="font-kalam text-sm underline underline-offset-2 transition-opacity hover:opacity-60"
          style={{ color: "rgba(26,26,26,0.55)" }}
        >
          ← All Sectors
        </Link>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl leading-none">{sector.emoji}</span>
          <h1 className="font-caveat text-5xl font-bold leading-none" style={{ color: "#1a1a1a" }}>
            {sector.name}
          </h1>
        </div>
        <p className="font-kalam text-base mt-2" style={{ color: "rgba(26,26,26,0.6)" }}>
          {sector.description} — top 5 picks
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {picks.map((pick, i) => (
          <StockCard key={pick.ticker} pick={pick} index={i} />
        ))}
      </div>
    </div>
  );
}
