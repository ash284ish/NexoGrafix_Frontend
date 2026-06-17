import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const feedbackId = parseInt(resolvedParams.id, 10);
  if (isNaN(feedbackId)) {
    return NextResponse.json({ detail: "Invalid feedback ID" }, { status: 400 });
  }

  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json({ detail: "Feedback not found" }, { status: 404 });
    }

    return NextResponse.json(feedback);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const feedbackId = parseInt(resolvedParams.id, 10);
  if (isNaN(feedbackId)) {
    return NextResponse.json({ detail: "Invalid feedback ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const feedback = await prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json({ detail: "Feedback not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};
    const allowedFields = [
      "first_name",
      "last_name",
      "role",
      "company",
      "service",
      "rating",
      "rating_label",
      "message",
      "avatar_url",
      "can_publish",
      "publish_status",
      "status",
      "is_featured",
      "source",
      "note"
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        if (field === "rating") {
          dataToUpdate.rating = parseInt(body.rating, 10);
        } else if (field === "can_publish") {
          dataToUpdate.can_publish = !!body.can_publish;
        } else if (field === "is_featured") {
          dataToUpdate.is_featured = !!body.is_featured;
        } else {
          dataToUpdate[field] = body[field];
        }
      }
    }

    dataToUpdate.updated_at = new Date();

    const updated = await prisma.feedbacks.update({
      where: { id: feedbackId },
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
  const feedbackId = parseInt(resolvedParams.id, 10);
  if (isNaN(feedbackId)) {
    return NextResponse.json({ detail: "Invalid feedback ID" }, { status: 400 });
  }

  try {
    const feedback = await prisma.feedbacks.findUnique({
      where: { id: feedbackId },
    });

    if (!feedback) {
      return NextResponse.json({ detail: "Feedback not found" }, { status: 404 });
    }

    await prisma.feedbacks.delete({
      where: { id: feedbackId },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
