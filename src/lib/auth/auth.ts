import "server-only";
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { isAllowedAdmin } from "./allowList";
// types.d.ts (in this directory) augments Session/JWT with `githubId` —
// picked up automatically via tsconfig's `**/*.ts` include, no explicit
// import needed for ambient module augmentation.

// Checkpoint 4.1 wired up GitHub + JWT sessions with zero authorization
// logic. Checkpoint 4.2 adds the single-owner allow-list here — the
// decision logic itself lives in ./allowList.ts (kept free of any
// next-auth import so it stays independently testable without pulling in
// next-auth's import graph, which transitively touches next/navigation's
// client router context).
//
// GitHub provider reads AUTH_GITHUB_ID/AUTH_GITHUB_SECRET from the
// environment automatically via Auth.js's own naming convention. AUTH_SECRET
// is read implicitly by NextAuth() itself, same convention.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Gate at the OAuth exchange itself: returning false here rejects the
    // sign-in outright (Auth.js's own documented mechanism for denying a
    // login attempt) — not a truthiness check on a resulting session.
    signIn({ profile }) {
      return isAllowedAdmin(profile?.id);
    },
    // Beyond this checkpoint's literal "add the signIn callback" wording,
    // but load-bearing for it: without threading the GitHub id into the
    // session, verifyAdmin.ts (Checkpoint 4.2's other required piece)
    // would have no independent way to re-verify identity — it could only
    // check "is there some session," which the checkpoint explicitly says
    // not to rely on. jwt/session here only carry the id through; they
    // decide nothing.
    jwt({ token, profile }) {
      if (profile?.id) {
        token.githubId = profile.id.toString();
      }
      return token;
    },
    session({ session, token }) {
      if (typeof token.githubId === "string") {
        session.user.githubId = token.githubId;
      }
      return session;
    },
  },
});
