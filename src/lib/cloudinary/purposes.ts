import { z } from "zod";

// Checkpoint 4.5 — the controlled allow-list a client may request an upload
// for. Deliberately isomorphic (no "server-only", no secrets): both the
// signing route and the client upload helper need the same purpose union
// for typing, and knowing the folder *names* below isn't a security
// boundary — the Cloudinary signature (server-only, see sign.ts) is. The
// route handler is what actually rejects an unknown purpose; this module
// only supplies the shared vocabulary.
export const UPLOAD_PURPOSES = [
  "PROJECT_IMAGE",
  "CERTIFICATE_IMAGE",
  "PROFILE_IMAGE",
] as const;

export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number];

export const uploadPurposeSchema = z.enum(UPLOAD_PURPOSES);

const PURPOSE_FOLDERS: Record<UploadPurpose, string> = {
  PROJECT_IMAGE: "portfolio/projects",
  CERTIFICATE_IMAGE: "portfolio/certificates",
  PROFILE_IMAGE: "portfolio/profile",
};

/** Fails closed — an unrecognized purpose throws rather than falling back to a default folder. */
export function getFolderForPurpose(purpose: UploadPurpose): string {
  const folder = PURPOSE_FOLDERS[purpose];
  if (!folder) {
    throw new Error(`No folder mapping configured for upload purpose "${purpose}".`);
  }
  return folder;
}
