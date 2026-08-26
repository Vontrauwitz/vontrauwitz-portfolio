import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/education.schema.ts — same
// treatment as experience.model.ts (same file, separate collection/model
// per the explicit Checkpoint 3.6 instruction: Experience and Education
// are separate collections even though they share this feature folder).
// No `timestamps`. `order` is the same Mongoose-only, seed-time-computed,
// explicitly-sorted strategy — EducationTimeline.tsx also renders in
// array order.
//
// `slug` gets `unique: true` — verified all 5 values are distinct.
const educationMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  program: { type: String, required: true, trim: true },
  institution: { type: String, required: true, trim: true },
  institutionUrl: { type: String, required: true },
  period: { type: String, required: true },
  description: { type: String, required: true },
  order: { type: Number, required: true },
});

export type EducationDocument = InferSchemaType<typeof educationMongooseSchema>;

export const EducationModel: Model<EducationDocument> =
  (mongoose.models.Education as Model<EducationDocument> | undefined) ??
  mongoose.model<EducationDocument>("Education", educationMongooseSchema);
