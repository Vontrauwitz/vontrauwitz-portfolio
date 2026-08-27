// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Testimonials collection in whichever database
// MONGODB_URI (.env.local) currently points to, from the existing
// src/data/testimonialConst.ts static array. Same shape as
// seedSkills.ts/seedExperience.ts/seedEducation.ts.
//
// Run via: npm run seed:testimonials
//
// Idempotency: upserts each record keyed by `slug` (verified unique
// across all 3 records) rather than inserting. `order` is (re-)written as
// the static array's current 0-based index on every run. Never touches
// any other collection.
import mongoose from 'mongoose';
import { cards } from '@/data/testimonialConst';
import { testimonialSchema } from '@/features/testimonials/schemas/testimonial.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { TestimonialModel } from '@/features/testimonials/services/testimonial.model';

async function main() {
  console.log(`Validating ${cards.length} static testimonial records against testimonialSchema...`);
  const validated = cards.map((card) => testimonialSchema.parse(card));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (let index = 0; index < validated.length; index++) {
    const card = validated[index];
    await TestimonialModel.findOneAndUpdate(
      { slug: card.slug },
      { ...card, order: index },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted (order ${index}): ${card.slug}`);
  }

  const count = await TestimonialModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
