import Link from "next/link";
import type { Sector } from "@/lib/mock-picks";

// Deterministic slight rotations — gives the hand-drawn tile-board feel
const ROTATIONS = ["-1deg", "0.5deg", "-0.5deg", "1deg", "-1.2deg", "0.8deg", "-0.3deg", "1.2deg", "-0.7deg", "0.3deg", "1.5deg"];

interface SectorTileProps {
  sector: Sector;
  index: number;
}

export default function SectorTile({ sector, index }: SectorTileProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <Link href={`/sector/${sector.slug}`} className="block group">
      <div
        className="bg-cream rounded-sm p-4 flex flex-col gap-2 cursor-pointer transition-transform duration-150 group-hover:scale-[1.04]"
        style={{
          border: "1.5px solid #1a1a1a",
          boxShadow: "2px 2px 0 #1a1a1a",
          transform: `rotate(${rotation})`,
        }}
      >
        <span className="text-3xl leading-none">{sector.emoji}</span>
        <h2 className="font-caveat text-xl font-bold leading-tight text-ink mt-1">{sector.name}</h2>
        <p className="font-kalam text-sm leading-snug" style={{ color: "rgba(26,26,26,0.65)" }}>
          {sector.description}
        </p>
      </div>
    </Link>
  );
}
