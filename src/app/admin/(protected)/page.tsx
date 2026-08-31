import type { Metadata } from 'next';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard | VontrauwitzDEV',
  robots: { index: false, follow: false },
};

// Checkpoint 4.3 cleanup: no longer calls verifyAdmin() here.
// admin/(protected)/layout.tsx is the authoritative render boundary — it
// already ran the full authorization decision (session exists, admin id
// configured, identity matches) before this page was ever reached; there
// is no code path that renders this component without that gate having
// already passed. Re-running the same check here would be pure duplicate
// work, not additional protection.
//
// This still isn't a client-side auth state: `auth()` is a plain,
// request-memoized server read (Auth.js v5 dedupes it within a single
// request) used only to display the signed-in owner's name/avatar — it
// makes no authorization decision and throws nothing.
//
// This does NOT change the standing rule for anything that mutates or is
// independently reachable (a future Server Action or protected Route
// Handler): those must each call verifyAdmin() themselves, since they
// aren't gated by this layout's render path the way a nested page is.
export default async function AdminDashboardPage() {
  const session = await auth();

  async function handleSignOut() {
    'use server';
    await signOut({ redirectTo: '/admin/login' });
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="w-full max-w-2xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark dark:text-light">
            Portfolio Admin
          </h1>
          <form action={handleSignOut}>
            <button
              type="submit"
              className="bg-dark text-light px-4 py-2 rounded-lg text-sm font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
            >
              Sign out
            </button>
          </form>
        </div>

        <div className="mb-12 flex items-center gap-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
          {session?.user?.image && (
            // Plain <img>, not next/image: this is a single small avatar
            // from an external OAuth provider (avatars.githubusercontent.com),
            // not a data-fetched content image — adding a next.config.js
            // remotePatterns entry for one avatar is out of this
            // checkpoint's scope.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt={session.user.name ? `${session.user.name}'s avatar` : 'Admin avatar'}
              className="h-12 w-12 rounded-full"
            />
          )}
          <div>
            <p className="font-semibold text-dark dark:text-light">
              {session?.user?.name ?? 'Signed in'}
            </p>
            <p className="text-sm text-dark/60 dark:text-light/60">Portfolio owner</p>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-dark dark:text-light">
          Content
        </h2>
        {/* Checkpoint 5.1/5.2 — Projects and Certificates are both real
            CRUD areas now. */}
        <ul className="space-y-2">
          <li>
            <Link
              href="/admin/projects"
              className="block rounded-lg border-2 border-dark/10 px-4 py-3 text-dark hover:border-primary dark:border-light/10 dark:text-light hover:dark:border-primaryDark"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="/admin/certificates"
              className="block rounded-lg border-2 border-dark/10 px-4 py-3 text-dark hover:border-primary dark:border-light/10 dark:text-light hover:dark:border-primaryDark"
            >
              Certificates
            </Link>
          </li>
          {/* Checkpoint 4.5 — the only real link in this list so far: the
              signed upload infrastructure actually exists now, unlike the
              two placeholders above. This is its test surface, not final
              CMS UI. */}
          <li>
            <Link
              href="/admin/uploads"
              className="block rounded-lg border-2 border-dark/10 px-4 py-3 text-dark hover:border-primary dark:border-light/10 dark:text-light hover:dark:border-primaryDark"
            >
              Upload test (Cloudinary, infra-only)
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
