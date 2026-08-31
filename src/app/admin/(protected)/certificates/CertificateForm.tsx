"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage, UploadError, type NormalizedUploadResult } from "@/lib/cloudinary/uploadImage";
import type { AdminCertificate } from "@/features/certificates/services/certificateAdminRepository";

// Mirrors ProjectForm.tsx (Checkpoint 5.1) exactly in structure — one form
// component for both create and edit, plain controlled inputs + fetch, no
// form library, no rich text editor. Validation here is UX-only; the real
// boundary is verifyAdmin() + certificateInputSchema/certificateUpdateSchema
// inside the API route this form POSTs/PATCHes to.
const CATEGORIES = ["fullstack", "frontend", "backend", "misc"] as const;

type FormState = {
  slug: string;
  title: string;
  category: (typeof CATEGORIES)[number];
  school: string;
  credentialUrl: string;
  issued: string;
  image: string;
  imagePublicId: string | null;
  order: number;
  published: boolean;
};

function toFormState(certificate?: AdminCertificate): FormState {
  return {
    slug: certificate?.slug ?? "",
    title: certificate?.title ?? "",
    category: certificate?.category ?? "fullstack",
    school: certificate?.school ?? "",
    credentialUrl: certificate?.credentialUrl ?? "",
    issued: certificate?.issued ?? "",
    image: certificate?.image ?? "",
    imagePublicId: certificate?.imagePublicId ?? null,
    order: certificate?.order ?? 0,
    published: certificate?.published ?? true,
  };
}

function toPayload(state: FormState) {
  return {
    slug: state.slug.trim(),
    title: state.title.trim(),
    category: state.category,
    school: state.school.trim(),
    credentialUrl: state.credentialUrl.trim(),
    issued: state.issued.trim(),
    image: state.image.trim(),
    imagePublicId: state.imagePublicId,
    order: state.order,
    published: state.published,
  };
}

const inputClass =
  "w-full rounded-lg border-2 border-dark/10 bg-light px-3 py-2 text-dark dark:border-light/10 dark:bg-dark dark:text-light";
const labelClass = "mb-1 block text-sm font-semibold text-dark dark:text-light";

export default function CertificateForm({ certificate }: { certificate?: AdminCertificate }) {
  const router = useRouter();
  const isEdit = Boolean(certificate);
  const [state, setState] = useState<FormState>(() => toFormState(certificate));
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  async function handleImageUpload(file: File | null) {
    if (!file) return;
    setUploadStatus("uploading");
    setErrorMessage(null);
    try {
      const result: NormalizedUploadResult = await uploadImage(file, "CERTIFICATE_IMAGE");
      setState((prev) => ({
        ...prev,
        image: result.secureUrl,
        imagePublicId: result.publicId,
      }));
      setUploadStatus("idle");
    } catch (err) {
      setErrorMessage(err instanceof UploadError ? err.message : "Image upload failed.");
      setUploadStatus("error");
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaveStatus("saving");
    setErrorMessage(null);

    const url = isEdit ? `/api/admin/certificates/${certificate!.id}` : "/api/admin/certificates";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(state)),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof body.message === "string" ? body.message : "Save failed.");
      }
      setSaveStatus("success");
      router.push("/admin/certificates");
      router.refresh();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Save failed.");
      setSaveStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-6">
      <div className="space-y-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={inputClass}
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={inputClass}
            value={state.slug}
            onChange={(e) => set("slug", e.target.value)}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="lowercase letters, numbers, and hyphens only"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Category</label>
          <select
            value={state.category}
            onChange={(e) => set("category", e.target.value as FormState["category"])}
            className={inputClass}
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>School / Issuer</label>
          <input
            className={inputClass}
            value={state.school}
            onChange={(e) => set("school", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Issued</label>
          <input
            className={inputClass}
            value={state.issued}
            onChange={(e) => set("issued", e.target.value)}
            placeholder="jan 2023"
            required
          />
        </div>

        <div>
          <label className={labelClass}>Credential URL</label>
          <input
            type="url"
            className={inputClass}
            value={state.credentialUrl}
            onChange={(e) => set("credentialUrl", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
        <label className={labelClass}>Image</label>
        {state.image && (
          <Image
            src={state.image}
            alt="Certificate image preview"
            width={200}
            height={120}
            className="max-h-40 w-auto rounded-lg border-2 border-dark/10 dark:border-light/10"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-dark dark:text-light"
        />
        {uploadStatus === "uploading" && (
          <p className="text-sm text-dark/60 dark:text-light/60">Uploading…</p>
        )}
        {!state.image && (
          <p className="text-sm text-dark/60 dark:text-light/60">No image selected yet.</p>
        )}
      </div>

      <div className="space-y-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Order</label>
            <input
              type="number"
              className={inputClass}
              value={state.order}
              min={0}
              max={9999}
              onChange={(e) => set("order", Number(e.target.value))}
              required
            />
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-dark dark:text-light">
              <input
                type="checkbox"
                checked={state.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-lg border-2 border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saveStatus === "saving" || uploadStatus === "uploading"}
          className="bg-dark text-light px-5 py-2 rounded-lg font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
        >
          {saveStatus === "saving" ? "Saving…" : isEdit ? "Save changes" : "Create certificate"}
        </button>
      </div>
    </form>
  );
}
