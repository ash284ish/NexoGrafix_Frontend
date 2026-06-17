import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { newsletter_subscriber_status } from "@/generated/prisma/client";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const subId = parseInt(resolvedParams.id, 10);
  if (isNaN(subId)) {
    return NextResponse.json({ detail: "Invalid subscriber ID" }, { status: 400 });
  }

  try {
    const sub = await prisma.newsletter_subscribers.findUnique({
      where: { id: subId },
    });

    if (!sub) {
      return NextResponse.json({ detail: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json(sub);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const subId = parseInt(resolvedParams.id, 10);
  if (isNaN(subId)) {
    return NextResponse.json({ detail: "Invalid subscriber ID" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const firstName = (body.first_name || "").trim();
    const lastName = (body.last_name || "").trim();
    const status = body.status;

    if (!email || !firstName || !lastName || !status) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    const sub = await prisma.newsletter_subscribers.findUnique({
      where: { id: subId },
    });

    if (!sub) {
      return NextResponse.json({ detail: "Subscriber not found" }, { status: 404 });
    }

    const exists = await prisma.newsletter_subscribers.findFirst({
      where: { email, NOT: { id: subId } },
    });

    if (exists) {
      return NextResponse.json({ detail: "Email already subscribed" }, { status: 409 });
    }

    const updated = await prisma.newsletter_subscribers.update({
      where: { id: subId },
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        status: status as newsletter_subscriber_status,
      },
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const subId = parseInt(resolvedParams.id, 10);
  if (isNaN(subId)) {
    return NextResponse.json({ detail: "Invalid subscriber ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const sub = await prisma.newsletter_subscribers.findUnique({
      where: { id: subId },
    });

    if (!sub) {
      return NextResponse.json({ detail: "Subscriber not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (body.first_name !== undefined) {
      dataToUpdate.first_name = (body.first_name || "").trim();
    }
    if (body.last_name !== undefined) {
      dataToUpdate.last_name = (body.last_name || "").trim();
    }
    if (body.email !== undefined) {
      const email = (body.email || "").trim().toLowerCase();
      const exists = await prisma.newsletter_subscribers.findFirst({
        where: { email, NOT: { id: subId } },
      });
      if (exists) {
        return NextResponse.json({ detail: "Email already subscribed" }, { status: 409 });
      }
      dataToUpdate.email = email;
    }
    if (body.status !== undefined) {
      dataToUpdate.status = body.status as newsletter_subscriber_status;
    }

    const updated = await prisma.newsletter_subscribers.update({
      where: { id: subId },
      data: dataToUpdate,
    });

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const subId = parseInt(resolvedParams.id, 10);
  if (isNaN(subId)) {
    return NextResponse.json({ detail: "Invalid subscriber ID" }, { status: 400 });
  }

  try {
    const sub = await prisma.newsletter_subscribers.findUnique({
      where: { id: subId },
    });

    if (!sub) {
      return NextResponse.json({ detail: "Subscriber not found" }, { status: 404 });
    }

    await prisma.newsletter_subscribers.delete({
      where: { id: subId },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
