// One-off local script — confirms the seeded Mongo Experience collection
// is byte-for-byte identical to src/data/expConst.ts's 4 live records,
// AND that sorting by the persistence-only `order` field reproduces the
// exact static array sequence (ExperienceTimeline.tsx renders in array
// order and the whole point of a timeline is that order is meaningful).
//
// Run via: npm run verify:experience
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { experience as staticExperience } from '@/data/expConst';
import { experienceSchema } from '@/features/experience/schemas/experience.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { ExperienceModel } from '@/features/experience/services/experience.model';

async function main() {
  await connectToDatabase();
  const docs = await ExperienceModel.find({}).sort({ order: 1 }).lean();

  console.log(`Static records: ${staticExperience.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticExperience.length) {
    throw new Error(
      `Record count mismatch: static=${staticExperience.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, order, ...rest } = doc;
    void _id;
    void __v;
    void order;
    const parsed = experienceSchema.parse(rest);
    mongoBySlug.set(parsed.slug, parsed);
  }

  let missing = 0;
  for (const staticExp of staticExperience) {
    const mongoExp = mongoBySlug.get(staticExp.slug);
    if (!mongoExp) {
      console.error(`MISSING in Mongo: ${staticExp.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoExp,
      staticExp,
      `Field mismatch for slug "${staticExp.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  const mongoOrderedSlugs = docs.map((doc) => doc.slug);
  const staticOrderedSlugs = staticExperience.map((exp) => exp.slug);
  assert.deepStrictEqual(
    mongoOrderedSlugs,
    staticOrderedSlugs,
    'Mongo order (sorted by `order` field) does not match static array order'
  );

  console.log(`All ${staticExperience.length} records match exactly (count + field-for-field + visual order).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
