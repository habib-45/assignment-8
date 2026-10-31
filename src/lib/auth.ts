import "server-only";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";
import { validatePassword } from "@/lib/password-rules";

/**
 * Better Auth instance (MongoDB adapter) shared with the Express API through
 * a bridged JWT cookie — see /api/auth/token.
 *
 * The MongoClient is created lazily-safe: the driver only opens sockets on
 * the first operation, so importing this module (e.g. during `next build`)
 * never blocks on a live database.
 */
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/studiospace";

const client = new MongoClient(MONGODB_URI);
const db = client.db(process.env.MONGODB_DB_NAME || undefined);

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "studiospace-dev-secret-change-me",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: mongodbAdapter(db),
  telemetry: { enabled: false },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh once a day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24,
    },
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false, // email verification is out of scope
    autoSignIn: true,
  },
  // Google social login — only registered when credentials are configured so
  // the app still boots with placeholder env values.
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),
});

export type Auth = typeof auth;
