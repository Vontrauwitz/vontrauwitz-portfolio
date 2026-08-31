// One-off local script — confirms the seeded Mongo Projects collection is
// byte-for-byte identical to src/data/projectConst.ts before that domain
// is ever allowed to become the primary read source in production (see
// PLAN.md Part IV §5's "verify before retiring the static source"
// protocol). Compared by `slug`, not array order — Mongo's natural
// document order isn't guaranteed to match the static array's order.
//
// Checkpoint 5.1 update: `imagePublicId`/`order`/`published` are excluded
// from the comparison below. Those three are genuinely new, admin-only
// fields (Checkpoint 5.1's migration backfilled them onto every existing
// document) that src/data/projectConst.ts never had and never will —
// asserting equality on them would fail this check permanently, not
// detect a real problem. The original migrated content (every field this
// script already checked before Checkpoint 5.1) is still asserted
// byte-for-byte identical, unchanged.
//
// Run via: npm run verify:projects
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { projects as staticProjects } from '@/data/projectConst';
import { projectSchema } from '@/features/projects/schemas/project.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { ProjectModel } from '@/features/projects/services/project.model';

async function main() {
  await connectToDatabase();
  const docs = await ProjectModel.find({}).lean();

  console.log(`Static records: ${staticProjects.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticProjects.length) {
    throw new Error(
      `Record count mismatch: static=${staticProjects.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, ...rest } = doc;
    void _id;
    void __v;
    // Re-validating through the same schema strips any stray Mongo/
    // Mongoose-injected keys beyond _id/__v and guarantees the comparison
    // is against a genuinely Project-shaped object, not raw driver output.
    const parsed = projectSchema.parse(rest);
    // Strip the Checkpoint 5.1 admin-only fields before comparing — see
    // this file's header comment.
    const { imagePublicId, order, published, ...comparable } = parsed;
    void imagePublicId;
    void order;
    void published;
    mongoBySlug.set(parsed.slug, comparable);
  }

  let missing = 0;
  for (const staticProject of staticProjects) {
    const mongoProject = mongoBySlug.get(staticProject.slug);
    if (!mongoProject) {
      console.error(`MISSING in Mongo: ${staticProject.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoProject,
      staticProject,
      `Field mismatch for slug "${staticProject.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  console.log(`All ${staticProjects.length} records match exactly (count + field-for-field).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
