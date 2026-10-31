/**
 * Password policy shared by the registration form (inline errors) and the
 * /api/auth route handler (server-side enforcement before Better Auth ever
 * hashes the password).
 *
 * Rules from the assignment:
 *  - must contain an uppercase letter
 *  - must contain a lowercase letter
 *  - must be at least 6 characters long
 */
export const PASSWORD_RULES = [
  {
    id: "uppercase",
    label: "At least one uppercase letter (A–Z)",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: "lowercase",
    label: "At least one lowercase letter (a–z)",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: "length",
    label: "At least 6 characters long",
    test: (value: string) => value.length >= 6,
  },
] as const;

export type PasswordRuleId = (typeof PASSWORD_RULES)[number]["id"];

/** Returns the human-readable messages of every rule the value breaks. */
export function validatePassword(password: string): string[] {
  return PASSWORD_RULES.filter((rule) => !rule.test(password)).map(
    (rule) => `Password must have ${rule.label.toLowerCase()}.`
  );
}
