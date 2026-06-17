import crypto from "crypto";
import argon2 from "argon2";
import { prisma } from "./prisma";

const SECRET_KEY = process.env.SECRET_KEY || "07164c272026931775234da392b985e9029f5e7a3e5126d67783203af2de6539";
const ACCESS_TOKEN_EXPIRE_MINUTES = parseInt(process.env.ACCESS_TOKEN_EXPIRE_MINUTES || "1440", 10);

function sign(payload: string): string {
  return crypto
    .createHmac("sha256", SECRET_KEY)
    .update(payload)
    .digest("hex");
}

export function createToken(userId: number): string {
  const expire = Math.floor(Date.now() / 1000) + ACCESS_TOKEN_EXPIRE_MINUTES * 60;
  const payload = `${userId}.${expire}`;
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): number {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("malformed");
    }
    const [userIdStr, expireStr, sig] = parts;
    const payload = `${userIdStr}.${expireStr}`;

    const expected = sign(payload);
    // Constant-time comparison
    const sigBuffer = Buffer.from(sig, "hex");
    const expectedBuffer = Buffer.from(expected, "hex");
    if (sigBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
      throw new Error("invalid signature");
    }

    if (Math.floor(Date.now() / 1000) > parseInt(expireStr, 10)) {
      throw new Error("token expired");
    }

    return parseInt(userIdStr, 10);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    throw new Error("invalid token");
  }
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  try {
    return await argon2.verify(hashed, plain);
  } catch (err) {
    return false;
  }
}

export async function hashPassword(plain: string): Promise<string> {
  return await argon2.hash(plain);
}

export async function getCurrentUser(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  try {
    const userId = verifyToken(token);
    const user = await prisma.users.findUnique({
      where: { id: userId },
      include: { roles: true },
    });
    if (!user || !user.is_active) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
}
