import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCertificateById, isValidCertificateId } from "@/features/certificates/services/certificateAdminRepository";
import CertificateForm from "../../CertificateForm";

export const metadata: Metadata = {
  title: "Edit Certificate | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

// See admin/certificates/page.tsx's identical export for why this is
// required rather than left to Next's default prerendering heuristics.
export const dynamic = "force-dynamic";

export default async function EditCertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!isValidCertificateId(id)) {
    notFound();
  }

  const certificate = await getCertificateById(id);
  if (!certificate) {
    notFound();
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Edit certificate</h1>
      </div>
      <CertificateForm certificate={certificate} />
    </main>
  );
}
