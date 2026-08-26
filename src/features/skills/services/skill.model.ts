import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/skill.schema.ts — same
// fields, same nullability (see that file for the field-by-field
// rationale derived from src/data/skillsConst.ts). No `timestamps`, same
// reasoning as Projects/Certificates.
//
// `order` has no equivalent in skillsConst.ts's content shape — it's
// computed at seed time from the static array's 0-based global index (not
// per-category; the source array's category blocks are already
// contiguous, so a single global sequence preserves both intra- and
// inter-category order) and exists purely to reproduce today's visual
// ordering deterministically, since MongoDB's natural document order
// isn't a documented guarantee. skillRepository.ts always explicitly
// sorts by `order` ascending when reading — never relies on natural
// order. Not part of the Zod domain schema (skillSchema), the same
// treatment Projects gave `timestamps`: infrastructure metadata, not a
// real content field.
//
// `slug` gets `unique: true` — verified all 48 current values are
// distinct.
const skillMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["frontend", "backend", "tools"],
  },
  description: { type: String, required: true },
  icon: { type: String, default: null },
  iconClassName: { type: String, default: null },
  link: { type: String, default: null },
  order: { type: Number, required: true },
});

export type SkillDocument = InferSchemaType<typeof skillMongooseSchema>;

// Model-reuse guard — same rationale as ProjectModel/CertificateModel.
export const SkillModel: Model<SkillDocument> =
  (mongoose.models.Skill as Model<SkillDocument> | undefined) ??
  mongoose.model<SkillDocument>("Skill", skillMongooseSchema);
