import { getSectors } from "@/lib/mock-picks";
import SectorTile from "@/components/SectorTile";

export default async function HomePage() {
  const sectors = await getSectors();

  return (
    <div>
      <header className="mb-12">
        <h1 className="font-caveat text-6xl font-bold leading-none mb-3" style={{ color: "#1a1a1a" }}>
          Stock Picker
        </h1>
        <p className="font-kalam text-lg" style={{ color: "rgba(26,26,26,0.6)" }}>
          Choose a sector to see today&apos;s top 5 picks.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {sectors.map((sector, i) => (
          <SectorTile key={sector.slug} sector={sector} index={i} />
        ))}
      </div>
    </div>
  );
}
