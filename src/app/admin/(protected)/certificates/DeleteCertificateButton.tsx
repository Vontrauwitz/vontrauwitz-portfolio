"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Mirrors DeleteProjectButton.tsx (Checkpoint 5.1) exactly — see that
// file's comment for why a plain window.confirm() is enough here.
export default function DeleteCertificateButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(typeof body.message === "string" ? body.message : "Delete failed.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="rounded-lg border-2 border-red-500/40 px-3 py-1.5 text-xs font-semibold text-red-600 hover:border-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400"
      >
        {isDeleting ? "Deleting…" : "Delete"}
      </button>
      {error && <span className="text-xs text-red-600 dark:text-red-400">{error}</span>}
    </div>
  );
}
