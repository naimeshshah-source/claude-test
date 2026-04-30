const ROTATIONS = ["-0.8deg", "0.5deg", "-0.3deg", "0.7deg", "-0.5deg"];

interface SkeletonCardProps {
  index?: number;
}

export default function SkeletonCard({ index = 0 }: SkeletonCardProps) {
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <div
      className="bg-cream rounded-sm p-5 flex flex-col gap-3 animate-pulse"
      style={{
        border: "1.5px solid rgba(26,26,26,0.25)",
        boxShadow: "2px 2px 0 rgba(26,26,26,0.15)",
        transform: `rotate(${rotation})`,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="h-7 w-20 rounded" style={{ background: "rgba(26,26,26,0.08)" }} />
        <div className="h-5 w-14 rounded" style={{ background: "rgba(26,26,26,0.08)" }} />
      </div>

      <div className="h-4 w-3/4 rounded" style={{ background: "rgba(26,26,26,0.08)" }} />

      <div
        className="flex items-center justify-between mt-auto pt-2"
        style={{ borderTop: "1px solid rgba(26,26,26,0.10)" }}
      >
        <div className="h-6 w-24 rounded" style={{ background: "rgba(26,26,26,0.08)" }} />
        <div className="h-4 w-10 rounded" style={{ background: "rgba(26,26,26,0.08)" }} />
      </div>
    </div>
  );
}
