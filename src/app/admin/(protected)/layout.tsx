import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { verifyAdmin, UnauthenticatedError } from '@/lib/auth/verifyAdmin';
import { signOut } from '@/lib/auth/auth';

// The authoritative server-side gate for every route under
// admin/(protected)/ — verifyAdmin() is called here, before any protected
// content is returned. Route hiding, a redirect in some client component,
// or a bare `if (session)` truthiness check are explicitly NOT sufficient
// authorization (PLAN.md Part II §3's official warning) — this server
// component is the one place that decides whether children ever render.
//
// Two distinct failure modes, handled differently on purpose:
//   - Unauthenticated (no session at all) → redirect('/admin/login'),
//     since signing in might actually resolve it.
//   - Anything else (wrong GitHub account, misconfigured
//     ADMIN_GITHUB_ID, or any unexpected error) → never redirect
//     anywhere. Redirecting an authenticated-but-wrong-account visitor
//     back to /admin/login risks a confusing loop (they're already
//     signed in; signing in again with the same account just fails the
//     same way). Render a plain, safe "access denied" message instead —
//     children are never reached.
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  let authorized = false;

  try {
    await verifyAdmin();
    authorized = true;
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      redirect('/admin/login');
    }
    // Falls through to the access-denied render below — deliberately not
    // re-thrown, and deliberately not rendering `children`.
  }

  if (!authorized) {
    async function handleSignOut() {
      'use server';
      await signOut({ redirectTo: '/admin/login' });
    }

    return (
      <main className="flex min-h-screen w-full flex-col items-center justify-center bg-light px-4 text-center dark:bg-dark">
        <h1 className="mb-4 text-2xl font-bold text-dark dark:text-light">
          Access denied
        </h1>
        <p className="mb-8 max-w-md text-dark/75 dark:text-light/75">
          The admin session could not be authorized.
        </p>
        <form action={handleSignOut}>
          <button
            type="submit"
            className="bg-dark text-light px-5 py-2 rounded-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
          >
            Sign out
          </button>
        </form>
      </main>
    );
  }

  return <>{children}</>;
}
