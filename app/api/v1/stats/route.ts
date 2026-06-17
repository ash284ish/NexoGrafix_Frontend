import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const totalNewsletters = await prisma.newsletter_subscribers.count();

    const totalNew = await prisma.contact_requests.count({
      where: { status: "new" },
    });

    const totalInProgress = await prisma.contact_requests.count({
      where: { status: "in_progress" },
    });

    const totalResolved = await prisma.contact_requests.count({
      where: { status: "resolved" },
    });

    return NextResponse.json({
      total_newsletters: totalNewsletters,
      total_new_requests: totalNew,
      total_in_progress: totalInProgress,
      total_resolved: totalResolved,
    });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
