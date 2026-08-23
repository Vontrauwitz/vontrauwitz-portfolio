import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TransitionEffect from '@/components/TransitionEffect';
import ContactForm from '@/features/contact/components/ContactForm';

// Checkpoint 2.10: description/OG sourced from this page's own copy below
// (ContactForm.tsx's "open to freelance opportunities" text).
const title = 'VontrauwitzDEV | Contact';
const description = 'Get in touch with Hans Trauwitz for freelance opportunities and collaborations.';

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title,
    description,
    url: '/contact',
    type: 'website',
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/opengraph-image'],
  },
};

export default function Contact() {
  return (
    <>
      <TransitionEffect />
      <main className='dark:text-light'>
        <Layout>
          <ContactForm />
        </Layout>
      </main>
    </>
  );
}
