import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ detail: "Invalid or expired token" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const oldPassword = body.old_password;
    const newPassword = (body.new_password || "").trim();

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ detail: "Missing required fields" }, { status: 400 });
    }

    const isMatch = await verifyPassword(oldPassword, user.password_hash);
    if (!isMatch) {
      return NextResponse.json({ detail: "Invalid old password" }, { status: 401 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ detail: "Password too short" }, { status: 400 });
    }

    const newHash = await hashPassword(newPassword);

    await prisma.users.update({
      where: { id: user.id },
      data: { password_hash: newHash },
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
