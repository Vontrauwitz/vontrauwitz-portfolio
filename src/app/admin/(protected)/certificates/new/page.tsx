import type { Metadata } from "next";
import CertificateForm from "../CertificateForm";

export const metadata: Metadata = {
  title: "New Certificate | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

export default function NewCertificatePage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-dark dark:text-light">New certificate</h1>
      </div>
      <CertificateForm />
    </main>
  );
}
