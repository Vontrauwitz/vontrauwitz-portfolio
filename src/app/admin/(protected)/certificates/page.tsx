import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { listAdminCertificates } from "@/features/certificates/services/certificateAdminRepository";
import DeleteCertificateButton from "./DeleteCertificateButton";

export const metadata: Metadata = {
  title: "Certificates | Admin | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

// Never statically prerendered — mirrors admin/projects/page.tsx's
// identical export exactly (Checkpoint 5.1 found this the hard way: a
// real `next build` failure prerendering against live Mongo data). This
// page reads live, auth-gated Mongo data via listAdminCertificates() with
// no dynamic-API call to otherwise signal that to Next automatically.
export const dynamic = "force-dynamic";

// Checkpoint 5.2 — no verifyAdmin() call here, same established rule as
// every other page inside admin/(protected)/: the layout already ran the
// authorization decision before this page was ever reached.
// listAdminCertificates() is called directly (not via the
// /api/admin/certificates route) since a Server Component can read the
// DAL in-process — the API route exists for the client-side
// create/edit/delete forms.
export default async function AdminCertificatesPage() {
  const certificates = await listAdminCertificates();

  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="w-full max-w-3xl">
        <div className="mb-10 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-dark dark:text-light">Certificates</h1>
          <Link
            href="/admin/certificates/new"
            className="bg-dark text-light px-4 py-2 rounded-lg text-sm font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
          >
            New certificate
          </Link>
        </div>

        {certificates.length === 0 ? (
          <p className="text-dark/60 dark:text-light/60">No certificates yet.</p>
        ) : (
          <ul className="space-y-3">
            {certificates.map((certificate) => (
              <li
                key={certificate.id}
                className="flex items-center gap-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-dark/5 dark:bg-light/5">
                  {certificate.image && (
                    <Image
                      src={certificate.image}
                      alt={certificate.title}
                      width={64}
                      height={64}
                      className="h-16 w-16 object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-dark dark:text-light">{certificate.title}</p>
                  <p className="text-sm text-dark/60 dark:text-light/60">
                    {certificate.school} · {certificate.category} · order: {certificate.order} ·{" "}
                    {certificate.published ? "published" : "unpublished"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <Link
                    href={`/admin/certificates/${certificate.id}/edit`}
                    className="rounded-lg border-2 border-dark/10 px-3 py-1.5 text-xs font-semibold text-dark hover:border-primary dark:border-light/10 dark:text-light hover:dark:border-primaryDark"
                  >
                    Edit
                  </Link>
                  <DeleteCertificateButton id={certificate.id} title={certificate.title} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
