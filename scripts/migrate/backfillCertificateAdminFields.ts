// One-off local script — never an HTTP endpoint, never run automatically.
// Checkpoint 5.2: backfills `order`, `published`, `imagePublicId`, and
// `createdAt` onto every existing Certificate document that predates them
// (the 20 records seeded from src/data/certConst.ts in Phase 3). Must run
// before certificateRepository.ts's getCertificates() query
// (`{published: true}`, sorted by `order`) is exercised against real
// data — otherwise every existing document silently fails that filter and
// the public /certificates page would render zero certificates until this
// runs.
//
// `order` is derived from each certificate's index in the static array
// (the same order CertificateGallery.tsx has always displayed them in per
// category, confirmed to already match Mongo's natural document order —
// see the Checkpoint 5.2 report). `published` is set to `true` for all of
// them: every one of these 20 certificates is already live on the public
// site today. `imagePublicId` is set to `null`: none of these 20 images
// were ever uploaded through the Cloudinary flow.
//
// `createdAt` is backfilled from each document's own ObjectId-embedded
// creation timestamp (`_id.getTimestamp()`) via the native MongoDB driver
// (`CertificateModel.collection.updateOne`), NOT
// `CertificateModel.updateOne()` — applied proactively here based on a
// real bug Checkpoint 5.1 discovered in the equivalent Projects migration:
// Mongoose's `timestamps: true` schema option makes its own
// updateOne()/findOneAndUpdate() silently strip a manually-set `createdAt`
// from `$set` (by design, to keep it immutable after creation), so the
// Mongoose-level call appears to succeed but doesn't actually persist the
// value. The native driver has no such restriction.
//
// Idempotency: only touches a document still missing `order`
// (`{ order: { $exists: false } }`) or `createdAt`
// (`{ createdAt: { $exists: false } }`) — running this script again after
// an admin has since edited real values through the UI is a safe no-op,
// never overwrites an admin's later edit.
//
// Run via: npm run migrate:certificateAdminFields
import mongoose from 'mongoose';
import { certificates as staticCertificates } from '@/data/certConst';
import { connectToDatabase } from '@/lib/db/connection';
import { CertificateModel } from '@/features/certificates/services/certificate.model';

async function main() {
  await connectToDatabase();
  console.log('Connected to Mongo.');

  let updated = 0;
  let skipped = 0;

  for (const [index, certificate] of staticCertificates.entries()) {
    const result = await CertificateModel.updateOne(
      { slug: certificate.slug, order: { $exists: false } },
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
      console.log(`  ✓ backfilled: ${certificate.slug} (order=${index}, published=true)`);
    } else {
      skipped++;
      console.log(`  – skipped (already has order, or slug not found): ${certificate.slug}`);
    }
  }

  const missingCreatedAt = await CertificateModel.find({ createdAt: { $exists: false } }).lean();
  for (const doc of missingCreatedAt) {
    const createdAt = doc._id.getTimestamp();
    // Native driver, not CertificateModel.updateOne() — see header comment.
    await CertificateModel.collection.updateOne({ _id: doc._id }, { $set: { createdAt } });
    console.log(`  ✓ backfilled createdAt: ${doc.slug} (${createdAt.toISOString()})`);
  }

  const total = await CertificateModel.countDocuments();
  const stillMissingOrder = await CertificateModel.countDocuments({ order: { $exists: false } });
  const stillMissingCreatedAt = await CertificateModel.countDocuments({ createdAt: { $exists: false } });

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
