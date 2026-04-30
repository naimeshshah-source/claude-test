"use client";

import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div
        className="bg-cream rounded-sm p-8 max-w-sm w-full"
        style={{
          border: "1.5px solid #1a1a1a",
          boxShadow: "2px 2px 0 #1a1a1a",
          transform: "rotate(-1deg)",
        }}
      >
        <p className="text-5xl mb-4">😬</p>
        <h2 className="font-caveat text-2xl font-bold mb-2" style={{ color: "#1a1a1a" }}>
          Something went wrong
        </h2>
        <p className="font-kalam text-sm mb-6" style={{ color: "rgba(26,26,26,0.65)" }}>
          {error.message || "Failed to load sector picks."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="font-kalam text-sm px-4 py-2 rounded-sm transition-colors hover:bg-ink hover:text-cream"
            style={{ border: "1.5px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}
          >
            Try again
          </button>
          <Link
            href="/"
            className="font-kalam text-sm px-4 py-2 rounded-sm transition-colors hover:bg-ink hover:text-cream"
            style={{ border: "1.5px solid #1a1a1a", boxShadow: "2px 2px 0 #1a1a1a" }}
          >
            All Sectors
          </Link>
        </div>
      </div>
    </div>
  );
}
