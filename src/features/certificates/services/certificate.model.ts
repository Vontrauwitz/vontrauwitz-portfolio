import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/certificate.schema.ts — same
// fields, same required-ness (see that file for the field-by-field
// rationale derived from src/data/certConst.ts). No `timestamps`, per the
// same reasoning as Projects (Checkpoint 3.2): createdAt/updatedAt don't
// exist in the current domain shape and aren't preemptively added here.
//
// `slug` gets `unique: true` — verified all 20 current values are
// distinct, and it's the field CertificateGallery's own React `key` prop
// already relies on for stable per-item identity.
//
// `category` is a Mongoose `enum` matching the Zod schema's exactly —
// same 4-value closed set, kept aligned between the two schemas.
//
// Not imported by any repository, query, page, or component yet — that's
// wired up in the same Checkpoint 3.4 commit as this file's own
// repository counterpart (certificateRepository.ts).
const certificateMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["fullstack", "frontend", "backend", "misc"],
  },
  school: { type: String, required: true, trim: true },
  credentialUrl: { type: String, required: true },
  issued: { type: String, required: true },
  image: { type: String, required: true },
});

export type CertificateDocument = InferSchemaType<typeof certificateMongooseSchema>;

// Model-reuse guard — same rationale as ProjectModel (Checkpoint 3.2):
// Next.js Fast Refresh re-evaluates this module without restarting the
// Node process, and calling mongoose.model() twice for the same name
// throws OverwriteModelError. Reusing an already-registered model instead
// of re-declaring it survives that.
export const CertificateModel: Model<CertificateDocument> =
  (mongoose.models.Certificate as Model<CertificateDocument> | undefined) ??
  mongoose.model<CertificateDocument>("Certificate", certificateMongooseSchema);
