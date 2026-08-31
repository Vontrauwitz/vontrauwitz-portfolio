// One-off local script — never an HTTP endpoint, never run automatically.
// Checkpoint 5.1: backfills `order`, `published`, and `imagePublicId` onto
// every existing Project document that predates those fields (the 9
// records seeded from src/data/projectConst.ts in Phase 3). Must run
// before projectRepository.ts's getProjects() query (`{published: true}`,
// sorted by `order`) is exercised against real data — otherwise every
// existing document silently fails that filter and the public /projects
// page would render zero projects until this runs.
//
// `order` is derived from each project's index in the static array (the
// same order the public page has always displayed them in, and the same
// order already confirmed to match Mongo's natural document order — see
// the Checkpoint 5.1 report). `published` is set to `true` for all of
// them: every one of these 9 projects is already live on the public site
// today, so backfilling anything else would be a real, user-visible
// regression, not a neutral default. `imagePublicId` is set to `null`:
// none of these 9 images were ever uploaded through the Cloudinary flow
// (they're /public paths), so there is no real public_id to record.
//
// Also backfills `createdAt` for any document that predates the schema's
// `timestamps: true` option (added this same checkpoint) — Mongoose's
// timestamps plugin only auto-sets `createdAt` on genuine document
// creation, never retroactively on a plain updateOne() against an
// already-existing document, so these 9 records would otherwise have no
// `createdAt` at all (discovered via a real build failure: admin/projects
// tried to prerender at build time and crashed on
// `undefined.toISOString()` — see admin/projects/page.tsx's
// `force-dynamic` export for the other half of that fix). Backfilled from
// each document's own ObjectId-embedded creation timestamp
// (`_id.getTimestamp()`) — a real historical value, not an invented one.
// Written via the native driver (`ProjectModel.collection.updateOne`),
// bypassing Mongoose's own query middleware entirely: `timestamps: true`
// makes Mongoose's regular `updateOne()`/`findOneAndUpdate()` silently
// strip a manually-set `createdAt` from `$set` (by design, to keep it
// immutable after creation) — confirmed by testing (a `$set` through the
// Mongoose model appeared to succeed with no error, but re-reading the
// documents afterward showed `createdAt` was still absent). The native
// driver has no such restriction and is the correct escape hatch for a
// one-time historical backfill like this.
//
// Idempotency: only ever touches a document that is still missing `order`
// (`{ order: { $exists: false } }`) or `createdAt`
// (`{ createdAt: { $exists: false } }`), via updateOne — running this
// script again after an admin has since edited real values through the UI
// is a safe no-op, never overwrites an admin's later edit.
//
// Run via: npm run migrate:projectAdminFields
import mongoose from 'mongoose';
import { projects as staticProjects } from '@/data/projectConst';
import { connectToDatabase } from '@/lib/db/connection';
import { ProjectModel } from '@/features/projects/services/project.model';

async function main() {
  await connectToDatabase();
  console.log('Connected to Mongo.');

  let updated = 0;
  let skipped = 0;

  for (const [index, project] of staticProjects.entries()) {
    const result = await ProjectModel.updateOne(
      { slug: project.slug, order: { $exists: false } },
      {
        $set: {
          order: index,
          published: true,
          imagePublicId: null,
        },
      }
    );

    if (result.matchedCount > 0) {
      updated++;
      console.log(`  ✓ backfilled: ${project.slug} (order=${index}, published=true)`);
    } else {
      skipped++;
      console.log(`  – skipped (already has order, or slug not found): ${project.slug}`);
    }
  }

  const missingCreatedAt = await ProjectModel.find({ createdAt: { $exists: false } }).lean();
  for (const doc of missingCreatedAt) {
    const createdAt = doc._id.getTimestamp();
    // Native driver, not ProjectModel.updateOne() — see header comment.
    await ProjectModel.collection.updateOne({ _id: doc._id }, { $set: { createdAt } });
    console.log(`  ✓ backfilled createdAt: ${doc.slug} (${createdAt.toISOString()})`);
  }

  const total = await ProjectModel.countDocuments();
  const stillMissingOrder = await ProjectModel.countDocuments({ order: { $exists: false } });
  const stillMissingCreatedAt = await ProjectModel.countDocuments({ createdAt: { $exists: false } });

  console.log(
    `\nBackfill complete. ${updated} updated, ${skipped} skipped, ` +
    `${missingCreatedAt.length} createdAt backfilled. Collection has ${total} document(s), ` +
    `${stillMissingOrder} still missing 'order', ${stillMissingCreatedAt} still missing 'createdAt'.`
  );

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
