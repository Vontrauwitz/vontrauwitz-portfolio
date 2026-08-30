import "server-only";
import { auth } from "./auth";
import { getConfiguredAdminId } from "./adminId";

// Checkpoint 4.3 refinement: two named error classes instead of a single
// generic Error, so callers (the protected admin layout) can distinguish
// "no session at all" (→ send them to sign in, that might fix it) from
// "a session exists but it isn't the admin" (→ never redirect back into
// the same protected area or the login page — that's how loops happen;
// show a safe access-denied message instead). This changes nothing about
// *when* access is denied or *why* — every condition, every fail-closed
// branch below is identical to Checkpoint 4.2. Only the thrown error's
// type is more specific, so a redirect decision doesn't have to
// string-match `.message`.
export class UnauthenticatedError extends Error {
  constructor(message = "Unauthorized: no authenticated session.") {
    super(message);
    this.name = "UnauthenticatedError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized: authenticated identity is not the admin.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

// Centralized authorization — the single authority every admin Server
// Action and every (admin) Route Handler/layout must call directly
// (PLAN.md Part IV §3 / Part II §12's Data Access Layer pattern). Never
// relies on proxy.ts (not added until a later checkpoint, and even then
// only optimistic UX, never the real gate).
//
// Fails closed at every step — no early return ever defaults to "allow":
//   1. No session, or a session with no user at all → UnauthenticatedError.
//   2. ADMIN_GITHUB_ID missing/malformed → UnauthorizedError (a session
//      exists, but there's nothing valid to check it against — never
//      "allow everyone" just because config is broken).
//   3. The session's githubId doesn't match the configured admin id →
//      UnauthorizedError.
// Step 3 is a second, independent re-verification of the same identity
// already checked once in auth.ts's signIn callback — not redundant:
// signIn only gates who could ever create a session in the first place;
// this re-checks the session itself every time it's used, so a future
// change to the signIn callback (or any other code path that ends up
// calling auth()) can't silently bypass authorization.
export async function verifyAdmin() {
  const session = await auth();

  if (!session || !session.user) {
    throw new UnauthenticatedError();
  }

  const adminId = getConfiguredAdminId();
  if (adminId === null) {
    throw new UnauthorizedError("Unauthorized: admin identity is not configured.");
  }

  if (session.user.githubId !== adminId) {
    throw new UnauthorizedError();
  }

  return session;
}
