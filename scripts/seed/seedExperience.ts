// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Experience collection in whichever database
// MONGODB_URI (.env.local) currently points to, from the existing
// src/data/expConst.ts static array (only its 4 live/uncommented
// entries — the 5th, agave-lab-front-end-developer, stays commented out
// in source and is never seeded). Same shape as seedSkills.ts.
//
// Run via: npm run seed:experience
//
// Idempotency: upserts each record keyed by `slug` (verified unique
// across all 4 live records) rather than inserting. `order` is
// (re-)written as the static array's current 0-based index on every run.
// Never touches any other collection.
import mongoose from 'mongoose';
import { experience } from '@/data/expConst';
import { experienceSchema } from '@/features/experience/schemas/experience.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { ExperienceModel } from '@/features/experience/services/experience.model';

async function main() {
  console.log(`Validating ${experience.length} static experience records against experienceSchema...`);
  const validated = experience.map((exp) => experienceSchema.parse(exp));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (let index = 0; index < validated.length; index++) {
    const exp = validated[index];
    await ExperienceModel.findOneAndUpdate(
      { slug: exp.slug },
      { ...exp, order: index },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted (order ${index}): ${exp.slug}`);
  }

  const count = await ExperienceModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
