

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const offsetParam = request.nextUrl.searchParams.get("offset");
    const statusFilter = request.nextUrl.searchParams.get("status_filter");

    const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

    const whereClause: any = {};
    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const list = await prisma.contact_requests.findMany({
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
    const firstName = (body.first_name || "").trim();
    const lastName = (body.last_name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const phone = body.phone ? body.phone.trim() : null;
    const service = body.service ? body.service.trim() : null;
    const message = (body.message || "").trim();
    const note = body.note ? body.note.trim() : null;

    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    const now = new Date();
    const requestRow = await prisma.contact_requests.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        service,
        message,
        note,
        status: "new",
        created_at: now,
        updated_at: now,
      },
    });

    return NextResponse.json(requestRow, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
