"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import AnimatedText from '@/components/AnimatedText';

// Checkpoint 2.10: baseline error boundary at the (public) layout level per
// PLAN.md's Checkpoint 2.10 row and Principle 14. Must be a Client
// Component (Next.js requirement for error.tsx — it receives `reset`, a
// function, which can't cross the server/client boundary as a prop).
// Deliberately doesn't render TransitionEffect: an error boundary should
// stay minimal so it isn't itself a source of new errors.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className='flex w-full min-h-screen flex-col items-center justify-center text-dark dark:text-light'>
      <Layout className='flex flex-col items-center text-center'>
        <AnimatedText text="Something Went Wrong" className='mb-8 lg:!text-6xl md:!text-4xl sm:!text-3xl' />
        <p className='max-w-xl text-lg font-medium'>
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={() => reset()}
          className='mt-8 flex items-center bg-dark text-light p-1.5 px-6 rounded-lg text-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light'
        >
          Try Again
        </button>
        <Link href="/" className='mt-4 underline'>
          Back Home
        </Link>
      </Layout>
    </main>
  );
}
