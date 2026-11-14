import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "haii_weaes_jwt_ultra_secret_key_2026_afterdark";

export interface UserTokenPayload {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

export function signToken(payload: UserTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): UserTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserTokenPayload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export async function getSessionUser(): Promise<UserTokenPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("hw_auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}
