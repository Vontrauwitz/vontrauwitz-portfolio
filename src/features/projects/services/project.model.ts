import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/project.schema.ts — same
// fields, same nullability (see that file for the field-by-field rationale
// derived from src/data/projectConst.ts). No `timestamps` here: Checkpoint
// 3.2's instruction is to mirror the current Project shape exactly, and
// `createdAt`/`updatedAt` don't exist in that shape — they may be added
// once Phase 5 admin CRUD gives them an actual use, not preemptively here.
//
// `slug` gets `unique: true` — grounded in projectConst.ts's own header
// comment ("stable, URL-safe id... for future per-project routes/admin
// editing") and already true of every current value, not an invented
// constraint.
//
// `technologies` keeps `default: []` here as a storage-layer convenience
// only (so a document written without the field doesn't error at the DB
// layer) — it is NOT part of the Zod input contract in
// ../schemas/project.schema.ts, which requires the key explicitly with no
// default. The two schemas intentionally diverge on this one point: Zod
// validates what a caller must provide; Mongoose's default is a fallback
// for persistence, not a statement about valid input shape.
//
// Not imported by any repository, query, page, or component yet — that's
// Checkpoint 3.3. This checkpoint only establishes the model shape and the
// hot-reload-safe registration pattern every later domain will reuse.
const projectMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  titleNote: { type: String, default: null },
  type: { type: String, required: true },
  summary: { type: String, required: true },
  note: { type: String, default: null },
  image: { type: String, required: true },
  imageWidth: { type: Number, required: true },
  imageHeight: { type: Number, required: true },
  deployUrl: { type: String, default: null },
  githubUrl: { type: String, required: true },
  icon: { type: String, required: true },
  technologies: { type: [String], default: [] },
  featured: { type: Boolean, required: true, default: false },
});

export type ProjectDocument = InferSchemaType<typeof projectMongooseSchema>;

// Model-reuse guard: Next.js Fast Refresh re-evaluates this module without
// restarting the Node process, and calling mongoose.model() twice for the
// same name throws OverwriteModelError. Reusing an already-registered
// model instead of re-declaring it survives that — the same class of fix
// as the connection-promise caching in lib/db/connection.ts, applied to
// model registration instead of the connection itself.
export const ProjectModel: Model<ProjectDocument> =
  (mongoose.models.Project as Model<ProjectDocument> | undefined) ??
  mongoose.model<ProjectDocument>("Project", projectMongooseSchema);
