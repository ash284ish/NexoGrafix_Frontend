import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const requestId = parseInt(resolvedParams.id, 10);
  if (isNaN(requestId)) {
    return NextResponse.json({ detail: "Invalid request ID" }, { status: 400 });
  }

  try {
    const contactReq = await prisma.contact_requests.findUnique({
      where: { id: requestId },
    });

    if (!contactReq) {
      return NextResponse.json({ detail: "Contact request not found" }, { status: 404 });
    }

    return NextResponse.json(contactReq);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const requestId = parseInt(resolvedParams.id, 10);
  if (isNaN(requestId)) {
    return NextResponse.json({ detail: "Invalid request ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const contactReq = await prisma.contact_requests.findUnique({
      where: { id: requestId },
    });

    if (!contactReq) {
      return NextResponse.json({ detail: "Contact request not found" }, { status: 404 });
    }

    const dataToUpdate: any = {};

    if (body.first_name !== undefined) {
      dataToUpdate.first_name = (body.first_name || "").trim();
    }
    if (body.last_name !== undefined) {
      dataToUpdate.last_name = (body.last_name || "").trim();
    }
    if (body.email !== undefined) {
      dataToUpdate.email = (body.email || "").trim().toLowerCase();
    }
    if (body.phone !== undefined) {
      dataToUpdate.phone = body.phone ? body.phone.trim() : null;
    }
    if (body.service !== undefined) {
      dataToUpdate.service = body.service ? body.service.trim() : null;
    }
    if (body.message !== undefined) {
      dataToUpdate.message = (body.message || "").trim();
    }
    if (body.status !== undefined) {
      dataToUpdate.status = body.status;
    }
    if (body.note !== undefined) {
      dataToUpdate.note = body.note ? body.note.trim() : null;
    }

    dataToUpdate.updated_at = new Date();

    const updated = await prisma.contact_requests.update({
      where: { id: requestId },
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
  const requestId = parseInt(resolvedParams.id, 10);
  if (isNaN(requestId)) {
    return NextResponse.json({ detail: "Invalid request ID" }, { status: 400 });
  }

  try {
    const contactReq = await prisma.contact_requests.findUnique({
      where: { id: requestId },
    });

    if (!contactReq) {
      return NextResponse.json({ detail: "Contact request not found" }, { status: 404 });
    }

    await prisma.contact_requests.delete({
      where: { id: requestId },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
