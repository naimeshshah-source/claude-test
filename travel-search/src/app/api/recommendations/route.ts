import { NextRequest, NextResponse } from "next/server";
import { getMonthlyRecommendations } from "@/lib/travel-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month") || undefined;

  await new Promise((resolve) => setTimeout(resolve, 500));

  const recommendations = getMonthlyRecommendations(month);

  return NextResponse.json(recommendations);
}
