import "server-only";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db/connection";
import { ProjectModel } from "./project.model";
import { projectSchema, type Project } from "../schemas/project.schema";
import type { ProjectInput, ProjectUpdateInput } from "../schemas/projectInput.schema";

// Checkpoint 5.1 — the admin write-path DAL, alongside projectRepository.ts
// (the existing public read-path DAL, unchanged in spirit — see that
// file). Deliberately a separate file rather than added to
// projectRepository.ts: that file's whole design is "read Mongo, fall back
// to static data on any failure," which makes no sense for a write —
// there is nothing to fall back *to* when creating/editing/deleting a
// real record, and mixing the two would risk an admin write silently
// no-op'ing into the read fallback path instead of surfacing a real error.
// Both files share the same ProjectModel (src/features/projects/services/
// project.model.ts) — there is exactly one Mongoose model for this domain.
//
// IMPORTANT — this file is NOT an authorization boundary. Every function
// here assumes its caller already ran verifyAdmin() (the admin API routes
// under src/app/api/admin/projects/ each do so independently, per
// PLAN.md Part IV §3), or is a Server Component already gated by
// admin/(protected)/layout.tsx. Nothing in this file checks who is
// calling it — do not add a new caller without checking that first.
export type AdminProject = Project & {
  id: string;
  createdAt: string;
  updatedAt: string;
};

interface RawProjectDoc {
  _id: mongoose.Types.ObjectId;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
}

// Re-validates every document through the same Zod schema the public read
// path uses (projectSchema) before it ever reaches an admin route response
// — guarantees the shape is real, not just "whatever Mongo happened to
// store," exactly mirroring projectRepository.ts's getProjects() rationale.
function toAdminProject(doc: RawProjectDoc): AdminProject {
  const { _id, __v, createdAt, updatedAt, ...rest } = doc;
  void __v;
  const parsed = projectSchema.parse(rest);
  return {
    ...parsed,
    id: _id.toString(),
    // Defensive fallback to the ObjectId's own embedded creation
    // timestamp / "now": every document in the collection has a real
    // createdAt as of this checkpoint's migration
    // (scripts/migrate/backfillProjectAdminFields.ts), but this function
    // shouldn't crash the admin UI if some future document somehow lacks
    // one — a slightly-off display timestamp is a cosmetic issue, not a
    // reason to 500 the whole page.
    createdAt: (createdAt ?? _id.getTimestamp()).toISOString(),
    updatedAt: (updatedAt ?? _id.getTimestamp()).toISOString(),
  };
}

export async function listAdminProjects(): Promise<AdminProject[]> {
  await connectToDatabase();
  const docs = await ProjectModel.find({}).sort({ order: 1 }).lean();
  return docs.map((doc) => toAdminProject(doc as unknown as RawProjectDoc));
}

/** Returns null for both a malformed id and a genuinely missing document — callers that need to distinguish the two should validate the id shape first (the admin routes do, via isValidProjectId()). */
export async function getProjectById(id: string): Promise<AdminProject | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ProjectModel.findById(id).lean();
  if (!doc) return null;
  return toAdminProject(doc as unknown as RawProjectDoc);
}

export function isValidProjectId(id: string): boolean {
  return mongoose.isValidObjectId(id);
}

// Hardening pass — shared by both admin Project routes (POST and PATCH)
// so their duplicate-slug handling can't silently drift apart. The
// `slug` field carries a real unique index at the database level
// (project.model.ts's `unique: true`, confirmed via
// ProjectModel.collection.indexes() to actually exist as a MongoDB
// index — not just a Mongoose-level pre-check), so this is the DB
// itself rejecting the write, not a race-prone "check then insert"
// done in application code. Checks `.code` first (the actual MongoDB
// driver error code for a duplicate key, stable regardless of message
// wording) and falls back to the message substring only as a second
// signal, since some error-wrapping layers don't preserve `.code`.
export function isDuplicateSlugError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const code = (error as { code?: unknown }).code;
  if (code === 11000) return true;
  return error.message.includes("E11000");
}

/** `input` must already be projectInputSchema-validated by the caller — this function does not re-validate, it persists. */
export async function createProject(input: ProjectInput): Promise<AdminProject> {
  await connectToDatabase();
  const doc = await ProjectModel.create(input);
  return toAdminProject(doc.toObject() as unknown as RawProjectDoc);
}

/** `input` must already be projectUpdateSchema-validated by the caller. Returns null if no document with that id exists. */
export async function updateProject(
  id: string,
  input: ProjectUpdateInput
): Promise<AdminProject | null> {
  if (!mongoose.isValidObjectId(id)) return null;
  await connectToDatabase();
  const doc = await ProjectModel.findByIdAndUpdate(id, input, {
    returnDocument: "after",
    runValidators: true,
  }).lean();
  if (!doc) return null;
  return toAdminProject(doc as unknown as RawProjectDoc);
}

export interface DeleteProjectResult {
  deleted: boolean;
  // The deleted document's own imagePublicId, read back from the record
  // Mongo just deleted — never from client input. Checkpoint 5.1 does not
  // act on this (no Cloudinary destroy call here); see the route handler's
  // own comment for why cleanup is deliberately deferred.
  imagePublicId: string | null;
}

export async function deleteProject(id: string): Promise<DeleteProjectResult> {
  if (!mongoose.isValidObjectId(id)) {
    return { deleted: false, imagePublicId: null };
  }
  await connectToDatabase();
  const doc = await ProjectModel.findByIdAndDelete(id).lean();
  if (!doc) {
    return { deleted: false, imagePublicId: null };
  }
  const raw = doc as unknown as RawProjectDoc;
  return {
    deleted: true,
    imagePublicId: typeof raw.imagePublicId === "string" ? raw.imagePublicId : null,
  };
}
