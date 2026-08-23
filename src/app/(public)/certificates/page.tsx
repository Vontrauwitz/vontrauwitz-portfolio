import type { Metadata } from 'next';
import AnimatedText from '@/components/AnimatedText';
import TransitionEffect from '@/components/TransitionEffect';
import CertificateGallery from '@/features/certificates/components/CertificateGallery';
import { getCertificates } from '@/features/certificates/queries/getCertificates';

// Full generateMetadata/OG work (per Principle 13) is Checkpoint 2.10's
// explicit scope — same minimal static-metadata treatment already used for
// "/", "/about", and "/projects".
export const metadata: Metadata = {
  title: 'VontrauwitzDEV | Certificates',
  other: {
    certificates: 'my certificates',
  },
};

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
