"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Checkpoint 5.1 — the browser's own confirm() is enough for a single
// destructive click in an infra-grade admin tool; not worth a custom
// modal component for this checkpoint's scope. The actual authorization
// and existence check happen server-side in DELETE /api/admin/projects/
// [id] regardless of what this button does — this is UX only.
export default function DeleteProjectButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
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
