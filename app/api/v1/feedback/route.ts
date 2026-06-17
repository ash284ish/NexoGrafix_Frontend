import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const offsetParam = request.nextUrl.searchParams.get("offset");

    const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

    const list = await prisma.feedbacks.findMany({
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

    const required = ["first_name", "last_name", "service", "rating", "rating_label", "message", "can_publish", "publish_status", "status", "is_featured", "source"];
    for (const field of required) {
      if (body[field] === undefined) {
        return NextResponse.json({ detail: `Missing required field: ${field}` }, { status: 400 });
      }
    }

    const now = new Date();
    const row = await prisma.feedbacks.create({
      data: {
        first_name: body.first_name,
        last_name: body.last_name,
        role: body.role || null,
        company: body.company || null,
        service: body.service,
        rating: parseInt(body.rating, 10),
        rating_label: body.rating_label,
        message: body.message,
        avatar_url: body.avatar_url || null,
        can_publish: !!body.can_publish,
        publish_status: body.publish_status,
        status: body.status,
        is_featured: !!body.is_featured,
        source: body.source,
        note: body.note || null,
        created_at: now,
        updated_at: now,
      },
    });

    return NextResponse.json(row, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
