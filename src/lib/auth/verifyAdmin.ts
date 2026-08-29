import "server-only";
import { auth } from "./auth";
import { getConfiguredAdminId } from "./adminId";

// Centralized authorization — the single authority every admin Server
// Action and every future (admin) Route Handler must call directly
// (PLAN.md Part IV §3 / Part II §12's Data Access Layer pattern). Never
// relies on proxy.ts (not added until Checkpoint 4.4, and even then only
// optimistic UX, never the real gate).
//
// Fails closed at every step — no early return ever defaults to "allow":
//   1. No session, or a session with no user at all → denied.
//   2. ADMIN_GITHUB_ID missing/malformed → denied (never "allow everyone"
//      just because there's nothing configured to check against).
//   3. The session's githubId doesn't match the configured admin id →
//      denied.
// Step 3 is a second, independent re-verification of the same identity
// already checked once in auth.ts's signIn callback — not redundant:
// signIn only gates who could ever create a session in the first place;
// this re-checks the session itself every time it's used, so a future
// change to the signIn callback (or any other code path that ends up
// calling auth()) can't silently bypass authorization.
export async function verifyAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Unauthorized: no authenticated session.");
  }

  const adminId = getConfiguredAdminId();
  if (adminId === null) {
    throw new Error("Unauthorized: admin identity is not configured.");
  }

  if (session.user.githubId !== adminId) {
    throw new Error("Unauthorized: authenticated identity does not match the configured admin.");
  }

  return session;
}
