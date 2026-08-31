// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Projects collection in whichever database
// MONGODB_URI (.env.local) currently points to, from the existing
// src/data/projectConst.ts static array (the source of truth for content
// until this domain's Mongo data is trusted — see PLAN.md Part IV §5).
//
// Run via: npm run seed:projects
// (must use the `--conditions=react-server` flag — see package.json script
// definition and the Checkpoint 3.3 report for why: connection.ts and
// project.model.ts both `import "server-only"`, which unconditionally
// throws outside Next.js's own bundler unless that condition is set,
// exactly mirroring how Next's bundler resolves it as a no-op.)
//
// Idempotency: upserts each record keyed by `slug` (findOneAndUpdate with
// upsert:true) rather than inserting — running this script any number of
// times converges on the same 9 documents, never duplicates. Never touches
// any other collection.
//
// Checkpoint 5.1 correction: `imagePublicId`/`order`/`published` are now
// applied via `$setOnInsert`, never `$set` — a real bug caught while
// building Checkpoint 5.1's admin CRUD. projectSchema.parse() gives every
// static record the SAME defaults for these three fields (order: 0,
// published: true, imagePublicId: null — see that schema's own comment),
// since the static array has no concept of them at all. Before this fix,
// re-running this script after Checkpoint 5.1's migration had backfilled
// real per-project `order` values (0–8) would have silently overwritten
// every one of them back to `order: 0`, and would have clobbered any
// admin edit to `published`/`imagePublicId` too — exactly the "destroy
// existing Mongo data blindly" this checkpoint was told not to do.
// `$setOnInsert` only applies those three on a genuine upsert-insert (a
// static project that doesn't exist in Mongo yet); every other field
// still refreshes via `$set` on every run, matching this script's
// original "keep Mongo content synced with the static source" purpose.
import mongoose from 'mongoose';
import { projects } from '@/data/projectConst';
import { projectSchema } from '@/features/projects/schemas/project.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { ProjectModel } from '@/features/projects/services/project.model';

async function main() {
  console.log(`Validating ${projects.length} static project records against projectSchema...`);
  const validated = projects.map((project) => projectSchema.parse(project));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (const [index, project] of validated.entries()) {
    const { imagePublicId, order, published, ...content } = project;
    void imagePublicId;
    void order;
    void published;
    await ProjectModel.findOneAndUpdate(
      { slug: project.slug },
      {
        $set: content,
        $setOnInsert: { order: index, published: true, imagePublicId: null },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted: ${project.slug}`);
  }

  const count = await ProjectModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  // error.name only — never error.message or the connection object, in
  // case a driver error path embeds connection details.
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
