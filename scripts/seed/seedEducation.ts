// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Education collection from the existing
// src/data/eduConst.ts static array. Same shape as seedExperience.ts.
//
// Run via: npm run seed:education
//
// Idempotency: upserts each record keyed by `slug` (verified unique
// across all 5 records). `order` is (re-)written as the static array's
// current 0-based index on every run. Never touches any other collection.
import mongoose from 'mongoose';
import { education } from '@/data/eduConst';
import { educationSchema } from '@/features/experience/schemas/education.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { EducationModel } from '@/features/experience/services/education.model';

async function main() {
  console.log(`Validating ${education.length} static education records against educationSchema...`);
  const validated = education.map((edu) => educationSchema.parse(edu));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (let index = 0; index < validated.length; index++) {
    const edu = validated[index];
    await EducationModel.findOneAndUpdate(
      { slug: edu.slug },
      { ...edu, order: index },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted (order ${index}): ${edu.slug}`);
  }

  const count = await EducationModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
