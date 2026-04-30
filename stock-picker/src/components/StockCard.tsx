import type { StockPick } from "@/lib/mock-picks";

const ROTATIONS = ["-0.8deg", "0.6deg", "-0.4deg", "0.9deg", "-0.3deg"];

interface StockCardProps {
  pick: StockPick;
  index: number;
}

export default function StockCard({ pick, index }: StockCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];
  const isPositive = pick.changePercent >= 0;
  const changeColor = isPositive ? "#1f8a3a" : "#c8341c";
  const changeSign = isPositive ? "+" : "";

  return (
    <div
      className="bg-cream rounded-sm p-5 flex flex-col gap-3"
      style={{
        border: "1.5px solid #1a1a1a",
        boxShadow: "2px 2px 0 #1a1a1a",
        transform: `rotate(${rotation})`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-caveat text-2xl font-bold text-ink leading-none">{pick.ticker}</span>
        <span
          className="font-kalam text-base font-semibold tabular-nums leading-none"
          style={{ color: changeColor }}
        >
          {changeSign}{pick.changePercent.toFixed(2)}%
        </span>
      </div>

      <p className="font-kalam text-sm leading-tight" style={{ color: "rgba(26,26,26,0.75)" }}>
        {pick.name}
      </p>

      <div
        className="flex items-center justify-between mt-auto pt-2"
        style={{ borderTop: "1px solid rgba(26,26,26,0.15)" }}
      >
        <span className="font-caveat text-lg font-semibold text-ink">
          ${pick.price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
        <span className="font-kalam text-xs" style={{ color: "rgba(26,26,26,0.5)" }}>
          {pick.marketCap}
        </span>
      </div>
    </div>
  );
}
