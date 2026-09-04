import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { z } from "zod";

const configuredSecret = process.env.AUTH_SECRET;
const isPlaceholderSecret = configuredSecret === "dev-local-secret-change-me-in-production" || configuredSecret === "replace-with-a-long-random-secret";
if (process.env.NODE_ENV === "production" && (!configuredSecret || configuredSecret.length < 32 || isPlaceholderSecret)) {
  throw new Error("AUTH_SECRET must be set to at least 32 characters in production.");
}

const secret = new TextEncoder().encode(configuredSecret || "local-development-secret");
const sessionIssuer = "paultech-store";
const sessionAudience = "paultech-store-users";
const sessionDurationSeconds = 60 * 60 * 24 * 30;

export type Session = { id: string; email: string; role: "CUSTOMER" | "ADMIN"; name: string };

const sessionSchema = z.object({
  id: z.string().min(1),
  email: z.email(),
  role: z.enum(["CUSTOMER", "ADMIN"]),
  name: z.string().min(1)
});

export async function createSession(session: Session) {
  const token = await new SignJWT(session).setProtectedHeader({ alg: "HS256" })
    .setIssuer(sessionIssuer).setAudience(sessionAudience).setIssuedAt().setExpirationTime("30d").sign(secret);
  (await cookies()).set("pt_session", token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", priority: "high", path: "/", maxAge: sessionDurationSeconds });
}

export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get("pt_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { issuer: sessionIssuer, audience: sessionAudience });
    return sessionSchema.parse(payload);
  } catch {
    return null;
  }
}

export async function destroySession() {
  (await cookies()).delete("pt_session");
}
