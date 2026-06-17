import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletter_subscriber_status } from "@/generated/prisma/client";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q");
    const limitParam = request.nextUrl.searchParams.get("limit");
    const offsetParam = request.nextUrl.searchParams.get("offset");

    const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

    const whereClause = q
      ? {
          OR: [
            { first_name: { contains: q, mode: "insensitive" as const } },
            { last_name: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const list = await prisma.newsletter_subscribers.findMany({
      where: whereClause,
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json(list);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const firstName = (body.first_name || "").trim();
    const lastName = (body.last_name || "").trim();
    const status = body.status || "active";

    if (!email || !firstName || !lastName) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    const exists = await prisma.newsletter_subscribers.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json({ detail: "Email already subscribed" }, { status: 409 });
    }

    const newSub = await prisma.newsletter_subscribers.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        status: status as newsletter_subscriber_status,
      },
    });

    return NextResponse.json(newSub, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
