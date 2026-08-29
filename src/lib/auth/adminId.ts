import "server-only";

// Shared validation for the single source of truth about who the admin
// is. GitHub numeric user ids are always digit-only — anything missing,
// empty, or non-numeric is treated as unconfigured/malformed, never as
// "match anything." Used independently by both the signIn callback
// (auth.ts, checked against the OAuth profile at login time) and
// verifyAdmin.ts (checked against the session at every authorization
// check) — two separate verification points sharing one rule for what
// counts as a validly configured admin id, not one point trusting the
// other.
export function getConfiguredAdminId(): string | null {
  const adminId = process.env.ADMIN_GITHUB_ID;
  if (!adminId || !/^\d+$/.test(adminId)) {
    return null;
  }
  return adminId;
}
