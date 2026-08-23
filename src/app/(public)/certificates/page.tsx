import type { Metadata } from 'next';
import AnimatedText from '@/components/AnimatedText';
import TransitionEffect from '@/components/TransitionEffect';
import CertificateGallery from '@/features/certificates/components/CertificateGallery';
import { getCertificates } from '@/features/certificates/queries/getCertificates';

// Checkpoint 2.10: generateMetadata (not a static `metadata` export) so the
// description reflects the real certificate count via the same
// getCertificates() query the page itself reads — distinct, factual
// per-page metadata per Principle 13, with no invented numbers.
const title = 'VontrauwitzDEV | Certificates';

export async function generateMetadata(): Promise<Metadata> {
  const certificates = await getCertificates();
  const description = `Browse ${certificates.length} certificates and courses completed by Hans Trauwitz.`;

  return {
    title,
    description,
    alternates: {
      canonical: '/certificates',
    },
    openGraph: {
      title,
      description,
      url: '/certificates',
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
}

export default async function Certificates() {
  const certificates = await getCertificates();

  return (
    <>
      <TransitionEffect />
      <main className="flex w-full h-full flex-col items-center justify-center mb-20 ">
        <AnimatedText className="mb-16 lg:!text-7xl md:!text-5xl sm:!text-4xl" text="Certificates 🎉" />
        <CertificateGallery certificates={certificates} />
      </main>
    </>
  );
}
