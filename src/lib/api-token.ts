import "server-only";
import { SignJWT, jwtVerify } from "jose";

/**
 * JWT bridge between the Next.js app (Better Auth sessions) and the Express
 * API (Challenge 1: HTTPOnly cookie protected mutations).
 *
 * The token is minted server-side only — it never reaches localStorage or
 * client-readable JavaScript — and the Express server verifies it with the
 * same AUTH_JWT_SECRET.
 */
export const API_TOKEN_COOKIE = "studiospace_token";
export const API_TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface ApiTokenClaims {
  sub: string;
  email: string;
  name: string;
  image?: string;
}

function secretKey() {
  return new TextEncoder().encode(
    process.env.AUTH_JWT_SECRET || "studiospace-dev-jwt-secret-change-me"
  );
}

export async function signApiToken(claims: ApiTokenClaims): Promise<string> {
  return new SignJWT({
    email: claims.email,
    name: claims.name,
    image: claims.image,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + API_TOKEN_MAX_AGE)
    .sign(secretKey());
}

export async function verifyApiToken(
  token: string
): Promise<ApiTokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub || !payload.email) return null;
    return {
      sub: String(payload.sub),
      email: String(payload.email),
      name: String(payload.name ?? ""),
      image: typeof payload.image === "string" ? payload.image : undefined,
    };
  } catch {
    return null;
  }
}
