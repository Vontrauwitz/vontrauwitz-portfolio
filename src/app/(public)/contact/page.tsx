import type { Metadata } from 'next';
import Layout from '@/components/Layout';
import TransitionEffect from '@/components/TransitionEffect';
import ContactForm from '@/features/contact/components/ContactForm';

// Full generateMetadata/OG work (per Principle 13) is Checkpoint 2.10's
// explicit scope — same minimal static-metadata treatment already used for
// "/", "/about", "/projects", and "/certificates".
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | Contact',
  other: {
    contact: 'contact me',
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
