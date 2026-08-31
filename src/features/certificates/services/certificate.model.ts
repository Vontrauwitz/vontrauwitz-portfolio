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
// Checkpoint 5.2 additions — the same admin-CRUD fields Projects gained
// in Checkpoint 5.1, deliberately NOT including imageWidth/imageHeight:
// CertificateGallery.tsx renders every image at a hardcoded 500x300 box
// regardless of source dimensions (see that component and certConst.ts's
// own header comment), so there is no real UI need for stored dimensions
// — adding them would be exactly the "blindly add fields" this checkpoint
// was told not to do.
//   - `imagePublicId`: nullable, null for the 20 records migrated from
//     src/data/certConst.ts (plain /public paths, never uploaded to
//     Cloudinary); set only once an admin uploads a replacement image via
//     the existing CERTIFICATE_IMAGE signed flow (Checkpoint 4.5).
//   - `order` / `published`: admin-editable list position and public
//     visibility, no schema-level default — every write path (this
//     checkpoint's migration script, and certificateInput.schema.ts for
//     all future admin writes) supplies an explicit value.
//   - `timestamps: true`: Mongoose-managed createdAt/updatedAt.
const certificateMongooseSchema = new Schema(
  {
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
    imagePublicId: { type: String, default: null },
    order: { type: Number, required: true },
    published: { type: Boolean, required: true },
  },
  { timestamps: true }
);

export type CertificateDocument = InferSchemaType<typeof certificateMongooseSchema>;

// Model-reuse guard — same rationale as ProjectModel (Checkpoint 3.2):
// Next.js Fast Refresh re-evaluates this module without restarting the
// Node process, and calling mongoose.model() twice for the same name
// throws OverwriteModelError. Reusing an already-registered model instead
// of re-declaring it survives that.
export const CertificateModel: Model<CertificateDocument> =
  (mongoose.models.Certificate as Model<CertificateDocument> | undefined) ??
  mongoose.model<CertificateDocument>("Certificate", certificateMongooseSchema);
