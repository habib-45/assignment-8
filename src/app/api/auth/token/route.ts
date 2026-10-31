import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  API_TOKEN_COOKIE,
  API_TOKEN_MAX_AGE,
  signApiToken,
} from "@/lib/api-token";

/**
 * JWT cookie bridge (Challenge 1).
 *
 * POST   → mints an HS256 JWT from the active Better Auth session and stores
 *          it in an HTTPOnly cookie the Express API can verify.
 * DELETE → clears the cookie on logout.
 *
 * The token is never readable by client-side JavaScript.
 */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    return NextResponse.json(
      { message: "You must be signed in to mint an API token." },
      { status: 401 }
    );
  }

  const token = await signApiToken({
    sub: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image ?? undefined,
  });

  const response = NextResponse.json({ success: true });
  response.cookies.set(API_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: API_TOKEN_MAX_AGE,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(API_TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
