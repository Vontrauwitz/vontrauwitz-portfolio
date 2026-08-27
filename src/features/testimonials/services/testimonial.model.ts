import "server-only";
import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

// Persistence-layer counterpart to ../schemas/testimonial.schema.ts — same
// fields, same required-ness. No `timestamps`, same reasoning as every
// other domain.
//
// `order` has no equivalent in testimonialConst.ts's content shape — same
// justified Mongoose-only strategy proven in Skills/Experience/Education:
// computed at seed time from the static array's 0-based index.
// TestimonialList.tsx renders `cards.map(...)` in array order inside a
// `flex flex-wrap` container — wrapping affects layout flow, not the
// underlying render sequence, so which card appears first in reading
// order still depends on array order. experienceRepository-style
// explicit sort avoids relying on Mongo's natural document order. Not
// part of the Zod domain schema.
//
// `slug` gets `unique: true` — verified all 3 values are distinct.
const testimonialMongooseSchema = new Schema({
  slug: { type: String, required: true, unique: true, trim: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String, required: true },
  imageWidth: { type: Number, required: true },
  imageHeight: { type: Number, required: true },
  profileUrl: { type: String, required: true },
  order: { type: Number, required: true },
});

export type TestimonialDocument = InferSchemaType<typeof testimonialMongooseSchema>;

// Model-reuse guard — same rationale as every other domain model.
export const TestimonialModel: Model<TestimonialDocument> =
  (mongoose.models.Testimonial as Model<TestimonialDocument> | undefined) ??
  mongoose.model<TestimonialDocument>("Testimonial", testimonialMongooseSchema);
