// One-off local script — confirms the seeded Mongo Testimonials
// collection is byte-for-byte identical to src/data/testimonialConst.ts,
// AND that sorting by the persistence-only `order` field reproduces the
// exact static array sequence.
//
// Run via: npm run verify:testimonials
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { cards as staticTestimonials } from '@/data/testimonialConst';
import { testimonialSchema } from '@/features/testimonials/schemas/testimonial.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { TestimonialModel } from '@/features/testimonials/services/testimonial.model';

async function main() {
  await connectToDatabase();
  const docs = await TestimonialModel.find({}).sort({ order: 1 }).lean();

  console.log(`Static records: ${staticTestimonials.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticTestimonials.length) {
    throw new Error(
      `Record count mismatch: static=${staticTestimonials.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, order, ...rest } = doc;
    void _id;
    void __v;
    void order;
    const parsed = testimonialSchema.parse(rest);
    mongoBySlug.set(parsed.slug, parsed);
  }

  let missing = 0;
  for (const staticCard of staticTestimonials) {
    const mongoCard = mongoBySlug.get(staticCard.slug);
    if (!mongoCard) {
      console.error(`MISSING in Mongo: ${staticCard.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoCard,
      staticCard,
      `Field mismatch for slug "${staticCard.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  const mongoOrderedSlugs = docs.map((doc) => doc.slug);
  const staticOrderedSlugs = staticTestimonials.map((card) => card.slug);
  assert.deepStrictEqual(
    mongoOrderedSlugs,
    staticOrderedSlugs,
    'Mongo order (sorted by `order` field) does not match static array order'
  );

  console.log(`All ${staticTestimonials.length} records match exactly (count + field-for-field + visual order).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
