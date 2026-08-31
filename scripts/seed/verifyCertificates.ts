// One-off local script — confirms the seeded Mongo Certificates collection
// is byte-for-byte identical to src/data/certConst.ts before that domain
// is ever allowed to become the primary read source in production (see
// PLAN.md Part IV §5). Compared by `slug`, not array order — Mongo's
// natural document order isn't guaranteed to match the static array's
// order.
//
// Checkpoint 5.2: `imagePublicId`/`order`/`published` are excluded from
// the comparison below — genuinely new, admin-only fields that
// src/data/certConst.ts never had and never will (see project's
// equivalent verifyProjects.ts fix, Checkpoint 5.1, for the identical
// reasoning). The original migrated content is still asserted
// byte-for-byte identical, unchanged.
//
// Run via: npm run verify:certificates
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import { certificates as staticCertificates } from '@/data/certConst';
import { certificateSchema } from '@/features/certificates/schemas/certificate.schema';
import { connectToDatabase } from '@/lib/db/connection';
import { CertificateModel } from '@/features/certificates/services/certificate.model';

async function main() {
  await connectToDatabase();
  const docs = await CertificateModel.find({}).lean();

  console.log(`Static records: ${staticCertificates.length}`);
  console.log(`Mongo records:  ${docs.length}`);

  if (docs.length !== staticCertificates.length) {
    throw new Error(
      `Record count mismatch: static=${staticCertificates.length} mongo=${docs.length}`
    );
  }

  const mongoBySlug = new Map<string, unknown>();
  for (const doc of docs) {
    const { _id, __v, ...rest } = doc;
    void _id;
    void __v;
    const parsed = certificateSchema.parse(rest);
    const { imagePublicId, order, published, ...comparable } = parsed;
    void imagePublicId;
    void order;
    void published;
    mongoBySlug.set(parsed.slug, comparable);
  }

  let missing = 0;
  for (const staticCertificate of staticCertificates) {
    const mongoCertificate = mongoBySlug.get(staticCertificate.slug);
    if (!mongoCertificate) {
      console.error(`MISSING in Mongo: ${staticCertificate.slug}`);
      missing++;
      continue;
    }
    assert.deepStrictEqual(
      mongoCertificate,
      staticCertificate,
      `Field mismatch for slug "${staticCertificate.slug}"`
    );
  }

  if (missing > 0) {
    throw new Error(`${missing} record(s) from the static array are missing in Mongo.`);
  }

  console.log(`All ${staticCertificates.length} records match exactly (count + field-for-field).`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error('Verification FAILED:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
