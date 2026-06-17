import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const feedbacks = await prisma.feedbacks.findMany();
    
    const summaryMap: Record<string, { good: number; neutral: number; bad: number; total: number }> = {};

    for (const f of feedbacks) {
      const s = f.service;
      if (!s) continue;
      
      if (!summaryMap[s]) {
        summaryMap[s] = { good: 0, neutral: 0, bad: 0, total: 0 };
      }
      
      summaryMap[s].total++;
      if (f.rating >= 4) {
        summaryMap[s].good++;
      } else if (f.rating === 3) {
        summaryMap[s].neutral++;
      } else {
        summaryMap[s].bad++;
      }
    }

    const list = Object.entries(summaryMap).map(([service, counts]) => ({
      service,
      ...counts,
    })).sort((a, b) => b.total - a.total);

    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
