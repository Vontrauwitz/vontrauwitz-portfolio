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

  for (const certificate of validated) {
    await CertificateModel.findOneAndUpdate(
      { slug: certificate.slug },
      certificate,
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
