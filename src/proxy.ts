import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";

// Checkpoint 4.4 — optimistic UX gate only, per PLAN.md Part IV §3 and the
// official Next.js warning (Part II §3): a proxy `matcher` can silently stop
// covering a route (refactor, typo, a Server Action moved elsewhere), and
// Server Actions are independently POST-reachable regardless of what the
// matcher below says. So this file NEVER makes the real authorization
// decision — it only redirects anonymous visitors away from the protected
// shell before it renders, to avoid a pointless round trip. The actual,
// fail-closed decision is verifyAdmin() in admin/(protected)/layout.tsx
// (and, later, in every admin Server Action / protected Route Handler) —
// unchanged and unbypassable by anything below.
//
// Deliberately checks session *existence* only (`!!req.auth`), never
// `req.auth.user.githubId` against ADMIN_GITHUB_ID. Duplicating that
// comparison here would let this file silently drift out of sync with
// verifyAdmin.ts's fail-closed logic (e.g. its ADMIN_GITHUB_ID-missing
// branch) and would falsely suggest proxy is a second real gate. A signed-in
// but wrong-account visitor is intentionally let through to the protected
// boundary — verifyAdmin() is what denies them there, per requirement (E).
export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Always reachable anonymously, and never redirected away by this file —
  // redirecting an authenticated visitor off /admin/login is the login
  // page's own job (it already calls verifyAdmin() and redirects the real
  // owner to /admin itself). Doing it here too would duplicate that
  // decision and, for a signed-in-but-wrong-account visitor, would replace
  // their normal sign-in screen with the protected layout's access-denied
  // page for no UX benefit.
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  if (!req.auth) {
    return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
