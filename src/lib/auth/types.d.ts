import type { DefaultSession } from "next-auth";

// Module augmentation, not `any`/suppression: threads the GitHub numeric
// user id through the JWT and into the session (see auth.ts's jwt/session
// callbacks), so verifyAdmin.ts can independently re-verify identity from
// the session alone rather than just trusting that the signIn callback
// already gate-kept who could sign in in the first place.
declare module "next-auth" {
  interface Session {
    user: {
      githubId?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    githubId?: string;
  }
}
