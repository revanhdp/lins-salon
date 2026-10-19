import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "lins_admin";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function secretKey(): Uint8Array | null {
  const secret = process.env.SESSION_SECRET;
  return secret && secret.length >= 16 ? new TextEncoder().encode(secret) : null;
}

/** True jika ADMIN_PASSWORD dan SESSION_SECRET sudah diatur di environment. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && secretKey() !== null;
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

/** Perbandingan password yang aman terhadap timing attack. */
export function passwordMatches(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(digest(input), digest(expected));
}

export async function createSession(): Promise<void> {
  const key = secretKey();
  if (!key) throw new Error("SESSION_SECRET belum diatur");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(key);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const key = secretKey();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!key || !token) return false;
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}

/** Panggil di setiap halaman admin dan setiap Server Action. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}
