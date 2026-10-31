import { auth } from "@/lib/auth";
import { validatePassword } from "@/lib/password-rules";

/**
 * Better Auth catch-all handler.
 *
 * Sign-up requests are intercepted first so the password policy from the
 * assignment (uppercase + lowercase + 6 chars) is enforced server-side,
 * before Better Auth ever hashes the password. The response mirrors the
 * Better Auth error shape so the React client surfaces it as a toast.
 */
async function handlePasswordPolicy(request: Request): Promise<Response | null> {
  const { pathname } = new URL(request.url);
  if (!pathname.endsWith("/sign-up/email")) return null;

  let password: unknown;
  try {
    const body = (await request.clone().json()) as { password?: unknown };
    password = body.password;
  } catch {
    return null;
  }

  const violations = validatePassword(String(password ?? ""));
  if (violations.length === 0) return null;

  return Response.json(
    {
      code: "INVALID_PASSWORD",
      message: violations.join(" "),
      status: 400,
    },
    { status: 400 }
  );
}

export async function GET(request: Request) {
  return auth.handler(request);
}

export async function POST(request: Request) {
  const policyResponse = await handlePasswordPolicy(request);
  if (policyResponse) return policyResponse;
  return auth.handler(request);
}

export async function PUT(request: Request) {
  return auth.handler(request);
}

export async function PATCH(request: Request) {
  return auth.handler(request);
}

export async function DELETE(request: Request) {
  return auth.handler(request);
}
