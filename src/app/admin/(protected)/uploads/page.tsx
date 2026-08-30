import type { Metadata } from "next";
import UploadTester from "./UploadTester";

export const metadata: Metadata = {
  title: "Upload Test | VontrauwitzDEV",
  robots: { index: false, follow: false },
};

// Checkpoint 4.5 — reachable only via admin/(protected)/layout.tsx's
// verifyAdmin() gate, same as every other page in this route group; no
// second check needed here (Checkpoint 4.3's rule: the layout is the
// authoritative render boundary for rendering, not for mutations/API
// calls). The actual upload still goes through /api/admin/uploads/sign,
// which independently calls verifyAdmin() itself.
export default function AdminUploadTestPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center px-4 py-16 bg-light dark:bg-dark">
      <div className="mb-10 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-dark dark:text-light">Upload Test</h1>
        <p className="mt-2 text-sm text-dark/60 dark:text-light/60">
          Infrastructure test surface for Checkpoint 4.5&apos;s signed Cloudinary
          uploads — not final CMS UI, and nothing here is written to the database.
        </p>
      </div>
      <UploadTester />
    </main>
  );
}
