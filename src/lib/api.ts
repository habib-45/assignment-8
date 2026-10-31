/**
 * Client-side helper for the Express API.
 *
 * Requests go through the Next.js rewrite (/api/server/* → Express) so the
 * browser only ever talks to one origin and the HTTPOnly JWT cookie travels
 * with every call.
 */

const BASE = "/api/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

let tokenRequest: Promise<void> | null = null;

/**
 * Asks the Next.js server to mint (or refresh) the HTTPOnly API JWT cookie
 * from the current Better Auth session.
 */
export function ensureApiToken(): Promise<void> {
  if (!tokenRequest) {
    tokenRequest = fetch("/api/auth/token", {
      method: "POST",
      credentials: "include",
    })
      .then(() => undefined)
      .catch(() => undefined)
      .finally(() => {
        window.setTimeout(() => {
          tokenRequest = null;
        }, 0);
      });
  }
  return tokenRequest;
}

type ApiFetchOptions = RequestInit;

/**
 * Performs a JSON request against the StudioSpace API.
 *
 * Responses follow the `{ data }` / `{ message }` envelope; on success the
 * helper unwraps `data`, on failure it throws an `ApiError`. A 401 triggers
 * one silent token refresh + retry before it is surfaced.
 */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const url = path.startsWith("/api/server")
    ? path
    : `${BASE}${path.startsWith("/") ? path : `/${path}`}`;

  const doFetch = () =>
    fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers ?? {}),
      },
    });

  let response = await doFetch();

  if (response.status === 401) {
    await ensureApiToken();
    response = await doFetch();
  }

  const payload = (await response.json().catch(() => null)) as
    | { data?: T; message?: string; error?: string }
    | null;

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Something went wrong (status ${response.status}).`;
    throw new ApiError(message, response.status);
  }

  return (payload && "data" in payload ? payload.data : payload) as T;
}
