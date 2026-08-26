import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/experience.schema.ts — same
// fields, same required-ness. No `timestamps`, same reasoning as
// Projects/Certificates/Skills.
//
// `order` has no equivalent in expConst.ts's content shape — same
// justified Mongoose-only strategy proven in Skills (Checkpoint 3.5):
// computed at seed time from the static array's 0-based index, exists
// purely to reproduce today's visual timeline sequence deterministically
// (ExperienceTimeline.tsx renders in array order, and the whole point of
// a timeline is that order is meaningful), since MongoDB's natural
// document order isn't a documented guarantee. experienceRepository.ts
// always explicitly sorts by `order` ascending. Not part of the Zod
// domain schema.
//
// `slug` gets `unique: true` — verified all 4 live values are distinct.
const experienceMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  position: { type: String, required: true, trim: true },
  company: { type: String, required: true, trim: true },
  companyUrl: { type: String, required: true },
  period: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
});

export type ExperienceDocument = InferSchemaType<typeof experienceMongooseSchema>;

// Model-reuse guard — same rationale as every other domain model.
export const ExperienceModel: Model<ExperienceDocument> =
  (mongoose.models.Experience as Model<ExperienceDocument> | undefined) ??
  mongoose.model<ExperienceDocument>("Experience", experienceMongooseSchema);
