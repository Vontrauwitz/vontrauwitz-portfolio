import type { Metadata } from 'next';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/Footer';
import NotFoundContent from '@/components/NotFoundContent';

// Root-level not-found.tsx: Next.js only renders through the root layout
// for a genuinely unmatched URL (there's no matched segment tree to walk a
// nested route group's not-found.tsx from — see
// src/app/(public)/not-found.tsx's comment), so without this file an
// arbitrary bad URL falls back to Next's generic unstyled default. NavBar/
// Footer are rendered directly here (not via the (public) layout, which
// this boundary bypasses) so a mistyped URL still gets the same site
// chrome as every real route.
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | Page Not Found',
};

export default function NotFound() {
  return (
    <>
      <NavBar />
      <NotFoundContent />
      <Footer />
    </>
  );
}
