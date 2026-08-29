import "server-only";
import { getConfiguredAdminId } from "./adminId";

// Pure single-owner allow-list decision — deliberately has zero
// dependency on next-auth/NextAuth() itself, only on adminId.ts. Kept
// separate from auth.ts (which wires this into the actual signIn
// callback) for two reasons: it's independently unit-testable without
// pulling in next-auth's import graph (which transitively touches
// next/navigation's client router context — safe inside a real Next.js
// build, but not importable from a standalone script), and it keeps the
// authorization *decision* isolated from the OAuth *integration* point.
//
// Fails closed at every branch: a missing/malformed ADMIN_GITHUB_ID, or a
// missing profile id, is never treated as "allow."
export function isAllowedAdmin(profileId: unknown): boolean {
  const adminId = getConfiguredAdminId();
  if (adminId === null) {
    return false;
  }
  if (profileId === undefined || profileId === null) {
    return false;
  }
  return profileId.toString() === adminId;
}
