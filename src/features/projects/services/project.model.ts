import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/project.schema.ts — same
// fields, same nullability (see that file for the field-by-field rationale
// derived from src/data/projectConst.ts).
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
// Checkpoint 5.1 additions — the fields Phase 3's own comment here
// explicitly deferred ("may be added once Phase 5 admin CRUD gives them an
// actual use, not preemptively here"):
//   - `imagePublicId`: nullable, not required. `null` for the 9 records
//     migrated from src/data/projectConst.ts (they're static /public paths,
//     never uploaded to Cloudinary); set only once an admin actually
//     uploads a replacement image via the signed Cloudinary flow. Exists
//     so a future asset-replacement/deletion feature can derive the
//     Cloudinary public_id to delete from the stored Project record
//     itself, never from client input (PLAN.md security principle, and
//     this checkpoint's own §9 requirement) — deliberately not acted on
//     yet (see projectAdminRepository.ts's deleteProject() comment).
//   - `order` / `published`: admin-editable list position and visibility.
//     No default here on purpose — every write path (the Checkpoint 5.1
//     migration script for the 9 existing docs, and projectInput.schema.ts
//     for all future admin writes) supplies an explicit value; a silent
//     Mongoose default would mask a caller forgetting to set one.
//   - `timestamps: true`: Mongoose-managed createdAt/updatedAt, set only
//     by Mongoose itself on insert/update — never accepted as client
//     input anywhere in the admin API (see projectInput.schema.ts).
const projectMongooseSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    titleNote: { type: String, default: null },
    type: { type: String, required: true },
    summary: { type: String, required: true },
    note: { type: String, default: null },
    image: { type: String, required: true },
    imageWidth: { type: Number, required: true },
    imageHeight: { type: Number, required: true },
    imagePublicId: { type: String, default: null },
    deployUrl: { type: String, default: null },
    githubUrl: { type: String, required: true },
    icon: { type: String, required: true },
    technologies: { type: [String], default: [] },
    featured: { type: Boolean, required: true, default: false },
    order: { type: Number, required: true },
    published: { type: Boolean, required: true },
  },
  { timestamps: true }
);

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
