import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const phone = (body.phone || "").trim();
    const password = body.password;

    if (!phone || !password) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    const user = await prisma.users.findFirst({
      where: { phone },
    });

    if (!user) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    if (!user.is_active) {
      return NextResponse.json({ detail: "User is inactive" }, { status: 403 });
    }

    const isMatch = await verifyPassword(password, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ detail: "Invalid credentials" }, { status: 401 });
    }

    // Update last login
    await prisma.users.update({
      where: { id: user.id },
      data: { last_login_at: new Date() },
    });

    const token = createToken(user.id);

    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      user: {
        id: user.id,
        role_id: user.role_id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email,
        phone: user.phone || null,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
