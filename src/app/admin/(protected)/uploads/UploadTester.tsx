"use client";

import { useState } from "react";
import { uploadImage, UploadError, type NormalizedUploadResult } from "@/lib/cloudinary/uploadImage";
import { UPLOAD_PURPOSES, type UploadPurpose } from "@/lib/cloudinary/purposes";

// Checkpoint 4.5 — infrastructure/test UI only, to prove the signed-upload
// path end to end (sign → direct browser→Cloudinary POST → normalized
// result) without starting Phase 5's real CRUD forms. Deliberately minimal:
// no cropper, no drag-and-drop, no gallery, no DB write. Safe to delete or
// replace once Phase 5 builds the real project/certificate image fields.
type Status = "idle" | "uploading" | "success" | "error";

export default function UploadTester() {
  const [purpose, setPurpose] = useState<UploadPurpose>(UPLOAD_PURPOSES[0]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<NormalizedUploadResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleUpload() {
    if (!file) return;
    setStatus("uploading");
    setErrorMessage(null);
    setResult(null);
    try {
      const uploaded = await uploadImage(file, purpose);
      setResult(uploaded);
      setStatus("success");
    } catch (error) {
      setErrorMessage(error instanceof UploadError ? error.message : "Upload failed.");
      setStatus("error");
    }
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      <div className="rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
        <label className="mb-2 block text-sm font-semibold text-dark dark:text-light">
          Purpose
        </label>
        <select
          value={purpose}
          onChange={(event) => setPurpose(event.target.value as UploadPurpose)}
          className="mb-4 w-full rounded-lg border-2 border-dark/10 bg-light px-3 py-2 text-dark dark:border-light/10 dark:bg-dark dark:text-light"
        >
          {UPLOAD_PURPOSES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <label className="mb-2 block text-sm font-semibold text-dark dark:text-light">
          Image file
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="mb-4 w-full text-sm text-dark dark:text-light"
        />

        <button
          type="button"
          disabled={!file || status === "uploading"}
          onClick={handleUpload}
          className="bg-dark text-light px-4 py-2 rounded-lg text-sm font-semibold hover:bg-light hover:text-dark border-2 border-solid border-transparent hover:border-black disabled:cursor-not-allowed disabled:opacity-50 dark:text-dark dark:bg-light hover:dark:bg-dark hover:dark:text-light hover:dark:border-light"
        >
          {status === "uploading" ? "Uploading…" : "Upload"}
        </button>
      </div>

      {status === "error" && errorMessage && (
        <div className="rounded-lg border-2 border-red-500/40 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {status === "success" && result && (
        <div className="space-y-3 rounded-lg border-2 border-dark/10 p-4 dark:border-light/10">
          {/* Plain <img>, not next/image — same rationale as the dashboard
              avatar: a single ad-hoc preview of a test upload, not a
              data-fetched content image; a next.config remotePatterns
              entry for Cloudinary belongs to the real CMS work in Phase 5. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.secureUrl}
            alt="Uploaded test asset preview"
            className="max-h-64 rounded-lg border-2 border-dark/10 dark:border-light/10"
          />
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm text-dark dark:text-light">
            <dt className="font-semibold">publicId</dt>
            <dd className="truncate">{result.publicId}</dd>
            <dt className="font-semibold">secureUrl</dt>
            <dd className="truncate">{result.secureUrl}</dd>
            <dt className="font-semibold">width × height</dt>
            <dd>
              {result.width} × {result.height}
            </dd>
            <dt className="font-semibold">format</dt>
            <dd>{result.format}</dd>
            <dt className="font-semibold">bytes</dt>
            <dd>{result.bytes}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
