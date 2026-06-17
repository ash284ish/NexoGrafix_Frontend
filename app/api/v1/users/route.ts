import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const offsetParam = request.nextUrl.searchParams.get("offset");

    const limit = limitParam ? parseInt(limitParam, 10) || 50 : 50;
    const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

    const list = await prisma.users.findMany({
      orderBy: { id: "desc" },
      take: limit,
      skip: offset,
    });

    const sanitized = list.map((user) => ({
      id: user.id,
      role_id: user.role_id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || null,
      is_active: user.is_active,
    }));

    return NextResponse.json(sanitized);
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const roleId = parseInt(body.role_id, 10);
    const firstName = (body.first_name || "").trim();
    const lastName = (body.last_name || "").trim();
    const phone = body.phone ? body.phone.trim() : null;
    const password = body.password;
    const isActive = body.is_active !== undefined ? !!body.is_active : true;

    if (!email || isNaN(roleId) || !firstName || !lastName || !password) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    const exists = await prisma.users.findUnique({
      where: { email },
    });

    if (exists) {
      return NextResponse.json({ detail: "Email already exists" }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.users.create({
      data: {
        role_id: roleId,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password_hash: passwordHash,
        is_active: isActive,
      },
    });

    return NextResponse.json({
      id: user.id,
      role_id: user.role_id,
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email,
      phone: user.phone || null,
      is_active: user.is_active,
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
