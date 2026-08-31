// One-off local script — never an HTTP endpoint, never run in production
// automatically. Seeds the Certificates collection in whichever database
// MONGODB_URI (.env.local) currently points to, from the existing
// src/data/certConst.ts static array. Same shape as seedProjects.ts
// (Checkpoint 3.3) — see that file for why `--conditions=react-server
// --env-file=.env.local` is required.
//
// Run via: npm run seed:certificates
//
// Idempotency: upserts each record keyed by `slug` (verified unique
// across all 20 current records — see the Checkpoint 3.4 report) rather
// than inserting — running this script any number of times converges on
// the same 20 documents, never duplicates. Never touches any other
// collection.
//
// Checkpoint 5.2 correction, applied proactively (Checkpoint 5.1 found
// this exact bug in seedProjects.ts after the fact — see that file's own
// comment for the full story): `imagePublicId`/`order`/`published` are
// applied via `$setOnInsert`, never `$set`. certificateSchema.parse()
// gives every static record the SAME defaults for these three fields
// (order: 0, published: true, imagePublicId: null), since the static
// array has no concept of them. If they were in `$set`, re-running this
// script after Checkpoint 5.2's migration had backfilled real per-
// certificate `order` values would silently overwrite every one of them
// back to `order: 0` and clobber any admin edit to `published`/
// `imagePublicId` — exactly the destructive-reset failure mode this
// checkpoint was told to guard against. `$setOnInsert` only applies those
// three on a genuine upsert-insert (a static certificate that doesn't
// exist in Mongo yet); every other field still refreshes via `$set` on
// every run, matching this script's original "keep Mongo content synced
// with the static source" purpose.
import mongoose from 'mongoose';
import { certificates } from '@/data/certConst';
import { certificateSchema } from '@/features/certificates/schemas/certificate.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { CertificateModel } from '@/features/certificates/services/certificate.model';

async function main() {
  console.log(`Validating ${certificates.length} static certificate records against certificateSchema...`);
  const validated = certificates.map((certificate) => certificateSchema.parse(certificate));
  console.log('All records passed Zod validation.');

  await connectToDatabase();
  console.log('Connected to Mongo.');

  for (const [index, certificate] of validated.entries()) {
    const { imagePublicId, order, published, ...content } = certificate;
    void imagePublicId;
    void order;
    void published;
    await CertificateModel.findOneAndUpdate(
      { slug: certificate.slug },
      {
        $set: content,
        $setOnInsert: { order: index, published: true, imagePublicId: null },
      },
      { upsert: true, setDefaultsOnInsert: true }
    );
    console.log(`  ✓ upserted: ${certificate.slug}`);
  }

  const count = await CertificateModel.countDocuments();
  console.log(`Seed complete. ${validated.length} records upserted. Collection now has ${count} document(s).`);

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Seed FAILED:', error instanceof Error ? error.name : 'UnknownError');
  process.exit(1);
});
