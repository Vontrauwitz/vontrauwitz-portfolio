// One-off local script — confirms the seeded Mongo Skills collection is
// byte-for-byte identical to src/data/skillsConst.ts, AND that sorting by
// the persistence-only `order` field reproduces the exact static array
// sequence (since SkillsTabs.tsx's client-side category filter relies on
// relative source order being preserved — see skill.model.ts).
//
// Run via: npm run verify:skills
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { skills as staticSkills } from '@/data/skillsConst';
import { skillSchema } from '@/features/skills/schemas/skill.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { SkillModel } from '@/features/skills/services/skill.model';

async function main() {
  await connectToDatabase();
  const docs = await SkillModel.find({}).sort({ order: 1 }).lean();

  console.log(`Static records: ${staticSkills.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticSkills.length) {
    throw new Error(
      `Record count mismatch: static=${staticSkills.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, order, ...rest } = doc;
    void _id;
    void __v;
    void order;
    const parsed = skillSchema.parse(rest);
    mongoBySlug.set(parsed.slug, parsed);
  }

  let missing = 0;
  for (const staticSkill of staticSkills) {
    const mongoSkill = mongoBySlug.get(staticSkill.slug);
    if (!mongoSkill) {
      console.error(`MISSING in Mongo: ${staticSkill.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoSkill,
      staticSkill,
      `Field mismatch for slug "${staticSkill.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  // Ordering check: sorting Mongo by `order` ascending must reproduce the
  // exact static array sequence.
  const mongoOrderedSlugs = docs.map((doc) => doc.slug);
  const staticOrderedSlugs = staticSkills.map((skill) => skill.slug);
  assert.deepStrictEqual(
    mongoOrderedSlugs,
    staticOrderedSlugs,
    'Mongo order (sorted by `order` field) does not match static array order'
  );

  console.log(`All ${staticSkills.length} records match exactly (count + field-for-field + visual order).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
