import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ detail: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: user.id,
      role_id: user.role_id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || null,
      is_active: user.is_active,
    });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ detail: "Invalid user ID" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
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
      // Check duplicate
      const exists = await prisma.users.findFirst({
        where: { email, NOT: { id: userId } },
      });
      if (exists) {
        return NextResponse.json({ detail: "Email already exists" }, { status: 409 });
      }
      dataToUpdate.email = email;
    }
    if (body.phone !== undefined) {
      dataToUpdate.phone = body.phone ? body.phone.trim() : null;
    }
    if (body.role_id !== undefined) {
      dataToUpdate.role_id = parseInt(body.role_id, 10);
    }
    if (body.is_active !== undefined) {
      dataToUpdate.is_active = !!body.is_active;
    }

    const updated = await prisma.users.update({
      where: { id: userId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      id: updated.id,
      role_id: updated.role_id,
      first_name: updated.first_name || "",
      last_name: updated.last_name || "",
      email: updated.email,
      phone: updated.phone || null,
      is_active: updated.is_active,
    });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await params;
  const userId = parseInt(resolvedParams.id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ detail: "Invalid user ID" }, { status: 400 });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    await prisma.users.delete({
      where: { id: userId },
    });

    return new Response(null, { status: 204 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
