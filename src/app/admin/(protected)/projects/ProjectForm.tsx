"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage, UploadError, type NormalizedUploadResult } from "@/lib/cloudinary/uploadImage";
import type { AdminProject } from "@/features/projects/services/projectAdminRepository";

// Checkpoint 5.1 — one form component for both create and edit, per the
// checkpoint's own "reuse a single form component where practical"
// instruction. Deliberately plain controlled inputs + fetch, no form
// library, no rich text editor, no drag/drop — matches this repo's
// existing admin UI style (UploadTester.tsx, Checkpoint 4.5). Validation
// here is UX-only (clearer inline messages, faster feedback); the actual
// authorization/validation boundary is verifyAdmin() + projectInputSchema/
// projectUpdateSchema inside the API route this form POSTs/PATCHes to —
// this component trusts nothing about its own client-side checks.
type FormState = {
  slug: string;
  title: string;
  titleNote: string;
  type: string;
  summary: string;
  note: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imagePublicId: string | null;
  deployUrl: string;
  githubUrl: string;
  icon: string;
  technologies: string;
  featured: boolean;
  order: number;
  published: boolean;
};

function toFormState(project?: AdminProject): FormState {
  return {
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    titleNote: project?.titleNote ?? "",
    type: project?.type ?? "",
    summary: project?.summary ?? "",
    note: project?.note ?? "",
    image: project?.image ?? "",
    imageWidth: project?.imageWidth ?? 0,
    imageHeight: project?.imageHeight ?? 0,
    imagePublicId: project?.imagePublicId ?? null,
    deployUrl: project?.deployUrl ?? "",
    githubUrl: project?.githubUrl ?? "",
    icon: project?.icon ?? "github",
    technologies: project?.technologies.join(", ") ?? "",
    featured: project?.featured ?? false,
    order: project?.order ?? 0,
    published: project?.published ?? true,
  };
}

function toPayload(state: FormState) {
  return {
    slug: state.slug.trim(),
    title: state.title.trim(),
    titleNote: state.titleNote.trim() === "" ? null : state.titleNote.trim(),
    type: state.type.trim(),
    summary: state.summary.trim(),
    note: state.note.trim() === "" ? null : state.note.trim(),
    image: state.image.trim(),
    imageWidth: state.imageWidth,
    imageHeight: state.imageHeight,
    imagePublicId: state.imagePublicId,
    deployUrl: state.deployUrl.trim() === "" ? null : state.deployUrl.trim(),
    githubUrl: state.githubUrl.trim(),
    icon: state.icon.trim(),
    technologies: state.technologies
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0),
    featured: state.featured,
    order: state.order,
    published: state.published,
  };
}

const inputClass =
  "w-full rounded-lg border-2 border-dark/10 bg-light px-3 py-2 text-dark dark:border-light/10 dark:bg-dark dark:text-light";
const labelClass = "mb-1 block text-sm font-semibold text-dark dark:text-light";

export default function ProjectForm({ project }: { project?: AdminProject }) {
  const router = useRouter();
  const isEdit = Boolean(project);
  const [state, setState] = useState<FormState>(() => toFormState(project));
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
      const result: NormalizedUploadResult = await uploadImage(file, "PROJECT_IMAGE");
      setState((prev) => ({
        ...prev,
        image: result.secureUrl,
        imageWidth: result.width,
        imageHeight: result.height,
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

    const url = isEdit ? `/api/admin/projects/${project!.id}` : "/api/admin/projects";
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
      router.push("/admin/projects");
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
          <label className={labelClass}>Title note (optional)</label>
          <input
            className={inputClass}
            value={state.titleNote}
            onChange={(e) => set("titleNote", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Type</label>
          <input
            className={inputClass}
            value={state.type}
            onChange={(e) => set("type", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Summary</label>
          <textarea
            className={inputClass}
            rows={4}
            value={state.summary}
            onChange={(e) => set("summary", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Note (optional)</label>
          <input className={inputClass} value={state.note} onChange={(e) => set("note", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
        <label className={labelClass}>Image</label>
        {state.image && (
          <Image
            src={state.image}
            alt="Project image preview"
            width={state.imageWidth || 200}
            height={state.imageHeight || 120}
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
        <div>
          <label className={labelClass}>Deploy URL (optional)</label>
          <input
            type="url"
            className={inputClass}
            value={state.deployUrl}
            onChange={(e) => set("deployUrl", e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>GitHub URL</label>
          <input
            type="url"
            className={inputClass}
            value={state.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Technologies (comma-separated)</label>
          <input
            className={inputClass}
            value={state.technologies}
            onChange={(e) => set("technologies", e.target.value)}
            placeholder="React, Next.js, Tailwind CSS"
          />
        </div>

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
          <div className="flex items-end gap-4 pb-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-dark dark:text-light">
              <input
                type="checkbox"
                checked={state.published}
                onChange={(e) => set("published", e.target.checked)}
              />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-dark dark:text-light">
              <input
                type="checkbox"
                checked={state.featured}
                onChange={(e) => set("featured", e.target.checked)}
              />
              Featured
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
          {saveStatus === "saving" ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}
