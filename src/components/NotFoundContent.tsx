import Link from 'next/link';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';
import TransitionEffect from '@/components/TransitionEffect';

// Shared by src/app/not-found.tsx (root — the only boundary Next.js uses
// for a genuinely unmatched URL, since there's no matched segment tree to
// walk a nested route-group's not-found.tsx from) and
// src/app/(public)/not-found.tsx (per PLAN.md's Checkpoint 2.10 row and
// Principle 14, for notFound() calls thrown within a (public) page).
// Keeping the actual UI in one place avoids the two files drifting apart.
export default function NotFoundContent() {
  return (
    <>
      <TransitionEffect />
      <main className='flex w-full min-h-screen flex-col items-center justify-center text-dark dark:text-light'>
        <Layout className='flex flex-col items-center text-center'>
          <AnimatedText text="404" className='mb-8 lg:!text-7xl md:!text-5xl sm:!text-4xl' />
          <p className='max-w-xl text-lg font-medium'>
            This page could not be found.
          </p>
          <Link
            href="/"
            className='mt-8 flex items-center bg-dark text-light p-1.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
          >
            Back Home
          </Link>
        </Layout>
      </main>
    </>
  );
}
