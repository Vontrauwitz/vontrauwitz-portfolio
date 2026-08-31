import "server-only";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connection";
import { CertificateModel } from "./certificate.model";
import { certificateSchema, type Certificate } from "../schemas/certificate.schema";
import type { CertificateInput, CertificateUpdateInput } from "../schemas/certificateInput.schema";

// Checkpoint 5.2 — the admin write-path DAL, alongside
// certificateRepository.ts (the existing public read-path DAL, unchanged
// in spirit). Mirrors projectAdminRepository.ts (Checkpoint 5.1)
// deliberately: same separation rationale (a write path has nothing to
// fall back *to*), same single shared Mongoose model per domain.
//
// IMPORTANT — this file is NOT an authorization boundary. Every function
// here assumes its caller already ran verifyAdmin() (the admin API routes
// under src/app/api/admin/certificates/ each do so independently), or is
// a Server Component already gated by admin/(protected)/layout.tsx.
export type AdminCertificate = Certificate & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

interface RawCertificateDoc {
  _id: mongoose.Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

function toAdminCertificate(doc: RawCertificateDoc): AdminCertificate {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  void __v;
  const parsed = certificateSchema.parse(rest);
  return {
    ...parsed,
    id: _id.toString(),
    // Defensive fallback to the ObjectId's own embedded creation
    // timestamp — same rationale as projectAdminRepository.ts's identical
    // fallback (a real bug there: legacy documents predating
    // `timestamps: true` have no createdAt at all until backfilled; this
    // fallback means the admin UI never crashes over it either way).
    createdAt: (createdAt ?? _id.getTimestamp()).toISOString(),
    updatedAt: (updatedAt ?? _id.getTimestamp()).toISOString(),
  };
}

export async function listAdminCertificates(): Promise<AdminCertificate[]> {
  await connectToDatabase();
  const docs = await CertificateModel.find({}).sort({ order: 1 }).lean();
  return docs.map((doc) => toAdminCertificate(doc as unknown as RawCertificateDoc));
}

/** Returns null for both a malformed id and a genuinely missing document — callers that need to distinguish the two should validate the id shape first (the admin routes do, via isValidCertificateId()). */
export async function getCertificateById(id: string): Promise<AdminCertificate | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await CertificateModel.findById(id).lean();
  if (!doc) return null;
  return toAdminCertificate(doc as unknown as RawCertificateDoc);
}

export function isValidCertificateId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

// Same detection strategy as projectAdminRepository.ts's
// isDuplicateSlugError — deliberately re-implemented here rather than
// imported from that file: Certificates and Projects are separate
// domains with separate models/collections, and this checkpoint's own
// scope rule is not to touch Projects code unless a genuinely shared bug
// requires it. The two are intentionally near-identical, small (a few
// lines), and not worth a forced shared abstraction across domains that
// don't otherwise share a base repository.
export function isDuplicateSlugError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: unknown }).code;
  if (code === 11000) return true;
  return error.message.includes("E11000");
}

/** `input` must already be certificateInputSchema-validated by the caller — this function does not re-validate, it persists. */
export async function createCertificate(input: CertificateInput): Promise<AdminCertificate> {
  await connectToDatabase();
  const doc = await CertificateModel.create(input);
  return toAdminCertificate(doc.toObject() as unknown as RawCertificateDoc);
}

/** `input` must already be certificateUpdateSchema-validated by the caller. Returns null if no document with that id exists. */
export async function updateCertificate(
  id: string,
  input: CertificateUpdateInput
): Promise<AdminCertificate | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await CertificateModel.findByIdAndUpdate(id, input, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
  if (!doc) return null;
  return toAdminCertificate(doc as unknown as RawCertificateDoc);
}

export interface DeleteCertificateResult {
  deleted: boolean;
  // The deleted document's own imagePublicId, read back from the record
  // Mongo just deleted — never from client input. Not acted on here; see
  // the route handler's own comment for why Cloudinary cleanup is
  // deliberately deferred (same policy as Projects, Checkpoint 5.1).
  imagePublicId: string | null;
}

export async function deleteCertificate(id: string): Promise<DeleteCertificateResult> {
  if (!mongoose.isValidObjectId(id)) {
    return { deleted: false, imagePublicId: null };
  }
  await connectToDatabase();
  const doc = await CertificateModel.findByIdAndDelete(id).lean();
  if (!doc) {
    return { deleted: false, imagePublicId: null };
  }
  const raw = doc as unknown as RawCertificateDoc;
  return {
    deleted: true,
    imagePublicId: typeof raw.imagePublicId === "string" ? raw.imagePublicId : null,
  };
}
