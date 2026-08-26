// One-off local script — confirms the seeded Mongo Education collection
// is byte-for-byte identical to src/data/eduConst.ts, AND that sorting by
// `order` reproduces the exact static array sequence. Same shape as
// verifyExperience.ts.
//
// Run via: npm run verify:education
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { education as staticEducation } from '@/data/eduConst';
import { educationSchema } from '@/features/experience/schemas/education.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { EducationModel } from '@/features/experience/services/education.model';

async function main() {
  await connectToDatabase();
  const docs = await EducationModel.find({}).sort({ order: 1 }).lean();

  console.log(`Static records: ${staticEducation.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticEducation.length) {
    throw new Error(
      `Record count mismatch: static=${staticEducation.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, order, ...rest } = doc;
    void _id;
    void __v;
    void order;
    const parsed = educationSchema.parse(rest);
    mongoBySlug.set(parsed.slug, parsed);
  }

  let missing = 0;
  for (const staticEdu of staticEducation) {
    const mongoEdu = mongoBySlug.get(staticEdu.slug);
    if (!mongoEdu) {
      console.error(`MISSING in Mongo: ${staticEdu.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoEdu,
      staticEdu,
      `Field mismatch for slug "${staticEdu.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  const mongoOrderedSlugs = docs.map((doc) => doc.slug);
  const staticOrderedSlugs = staticEducation.map((edu) => edu.slug);
  assert.deepStrictEqual(
    mongoOrderedSlugs,
    staticOrderedSlugs,
    'Mongo order (sorted by `order` field) does not match static array order'
  );

  console.log(`All ${staticEducation.length} records match exactly (count + field-for-field + visual order).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
