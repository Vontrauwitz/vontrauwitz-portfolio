import "server-only";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

// Checkpoint 4.1 — pure Auth.js configuration only: GitHub provider + JWT
// session strategy. Deliberately NO authorization logic here (no signIn
// callback, no session callback, no allow-list check, no truthiness gate
// on `auth`/`req.auth`). This file only wires up the OAuth flow itself;
// it does not decide who's allowed in. That's Checkpoint 4.2's job
// (src/lib/auth/verifyAdmin.ts), which must validate a real session AND
// the explicit ADMIN_GITHUB_ID — never a bare truthiness check, per the
// fail-open advisory that motivated pinning next-auth@5.0.0-beta.32.
//
// GitHub provider reads AUTH_GITHUB_ID/AUTH_GITHUB_SECRET from the
// environment automatically via Auth.js's own naming convention — no
// explicit clientId/clientSecret passed here. AUTH_SECRET is read
// implicitly by NextAuth() itself, same convention.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
});
