import SkeletonCard from "@/components/SkeletonCard";

export default function Loading() {
  return (
    <div>
      {/* Back link placeholder */}
      <div className="mb-8">
        <div className="h-4 w-24 rounded animate-pulse" style={{ background: "rgba(26,26,26,0.08)" }} />
      </div>

      {/* Header placeholder */}
      <div className="mb-10 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded animate-pulse" style={{ background: "rgba(26,26,26,0.08)" }} />
          <div className="h-12 w-56 rounded animate-pulse" style={{ background: "rgba(26,26,26,0.08)" }} />
        </div>
        <div className="h-4 w-48 rounded animate-pulse" style={{ background: "rgba(26,26,26,0.08)" }} />
      </div>

      {/* Card grid skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} index={i} />
        ))}
      </div>
    </div>
  );
}
