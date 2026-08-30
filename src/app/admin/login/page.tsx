import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { signIn } from '@/lib/auth/auth';
import { verifyAdmin } from '@/lib/auth/verifyAdmin';

// Deliberately not indexed — an admin sign-in screen has no public/social
// relevance.
export const metadata: Metadata = {
  title: 'Admin Sign In | VontrauwitzDEV',
  robots: { index: false, follow: false },
};

// Not wrapped by admin/(protected)/layout.tsx's verifyAdmin() gate — this
// page must always be reachable by an unauthenticated visitor, or the
// protected layout's own "redirect to /admin/login on Unauthenticated"
// behavior would loop back into itself. See verifyAdmin.ts's Checkpoint
// 4.3 comment for the same reasoning from the other side.
//
// If verifyAdmin() already succeeds here (an already-authorized owner
// revisiting /admin/login), send them straight to the dashboard instead
// of showing the sign-in button again. Any failure — unauthenticated OR
// authenticated-but-wrong-account — falls through to the same sign-in
// screen; this page doesn't need to distinguish those two cases the way
// the protected layout does, since "sign in with GitHub" is the correct
// next step either way.
export default async function AdminLoginPage() {
  // redirect() works by throwing internally — it must never be called
  // inside a try block whose catch has no type filter, or that catch
  // would silently swallow the redirect. Resolve success into a plain
  // boolean first, then redirect() only after the try/catch has closed.
  let isAuthorized = false;
  try {
    await verifyAdmin();
    isAuthorized = true;
  } catch {
    // Not authorized (either reason) — falls through to render the
    // sign-in screen below.
  }

  if (isAuthorized) {
    redirect('/admin');
  }

  async function handleSignIn() {
    'use server';
    await signIn('github', { redirectTo: '/admin' });
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-light px-4 dark:bg-dark">
      <h1 className="mb-8 text-3xl font-bold text-dark dark:text-light">
        Admin Sign In
      </h1>
      <form action={handleSignIn}>
        <button
          type="submit"
          className="flex items-center bg-dark text-light px-6 py-3 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
        >
          Sign in with GitHub
        </button>
      </form>
    </main>
  );
}
