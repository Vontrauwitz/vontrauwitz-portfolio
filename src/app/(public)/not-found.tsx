import type { Metadata } from 'next';
import NotFoundContent from '@/components/NotFoundContent';

// Checkpoint 2.10: placed at the (public) layout level per PLAN.md's
// Checkpoint 2.10 row and Principle 14 — catches notFound() calls thrown
// by a page within (public) (rendered inside NavBar/Footer via that
// layout). A genuinely unmatched URL (no matching route at all) is instead
// caught by the root src/app/not-found.tsx — see that file's comment.
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | Page Not Found',
};

export default function NotFound() {
  return <NotFoundContent />;
}
