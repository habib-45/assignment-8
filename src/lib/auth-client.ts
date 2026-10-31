import { createAuthClient } from "better-auth/react";

/**
 * Better Auth React client. Same-origin by default, so it works unchanged on
 * localhost and on the deployed Vercel URL.
 */
export const authClient = createAuthClient();
