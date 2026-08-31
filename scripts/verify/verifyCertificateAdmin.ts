// Verifies Checkpoint 5.2's Certificate admin validation + DAL in one
// pass, modeled directly on verifyProjectAdmin.ts (Checkpoint 5.1,
// hardened in its follow-up pass).
// Run via: npm run verify:certificateAdmin
//
// Part 1 (schema, pure, no network): certificateInputSchema/
// certificateUpdateSchema behavior in isolation.
// Part 2 (live DAL round trip against the real .env.local database): a
// single throwaway test Certificate, created/listed/updated/deleted
// through the actual admin repository functions.
// Part 3 (live): duplicate-slug rejection on create and update — `slug`
// carries a real DB-level unique index for Certificates too (confirmed
// via CertificateModel.collection.indexes(), same as Projects).
// All temp certificates (slugs starting
// "checkpoint-5-2-verify-certificate-temp") are cleaned up unconditionally
// in a finally block so a failed assertion never leaves one behind.
import assert from "node:assert/strict";

const TEST_SLUG = "checkpoint-5-2-verify-certificate-temp";
const TEST_SLUG_2 = "checkpoint-5-2-verify-certificate-temp-2";

async function verifySchemas() {
  const { certificateInputSchema, certificateUpdateSchema } = await import(
    "@/features/certificates/schemas/certificateInput.schema"
  );

  const validInput = {
    slug: "sample-certificate",
    title: "Sample Certificate",
    category: "fullstack",
    school: "Sample School",
    credentialUrl: "https://example.com/cert/123",
    issued: "jan 2023",
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/certificates/sample.jpg",
    imagePublicId: "portfolio/certificates/sample",
    order: 0,
    published: true,
  };

  assert.equal(certificateInputSchema.safeParse(validInput).success, true);
  console.log("PASS: valid certificate input accepted");

  assert.equal(
    certificateInputSchema.safeParse({ ...validInput, arbitraryField: "sneaky" }).success,
    false,
    "unknown field must be rejected by .strict()"
  );
  console.log("PASS: unknown field rejected");

  assert.equal(
    certificateInputSchema.safeParse({ ...validInput, credentialUrl: "not-a-url" }).success,
    false
  );
  console.log("PASS: invalid URL rejected (credentialUrl)");

  assert.equal(certificateInputSchema.safeParse({ ...validInput, order: -1 }).success, false);
  assert.equal(certificateInputSchema.safeParse({ ...validInput, order: 1.5 }).success, false);
  assert.equal(certificateInputSchema.safeParse({ ...validInput, order: 100000 }).success, false);
  console.log("PASS: invalid order rejected (negative, non-integer, out of bounds)");

  assert.equal(
    certificateInputSchema.safeParse({ ...validInput, slug: "Not A Valid Slug!" }).success,
    false
  );
  console.log("PASS: invalid slug rejected");

  assert.equal(
    certificateInputSchema.safeParse({ ...validInput, category: "not-a-real-category" }).success,
    false
  );
  console.log("PASS: invalid category rejected");

  assert.equal(
    certificateInputSchema.safeParse({ title: "Missing everything else" }).success,
    false
  );
  console.log("PASS: incomplete create payload rejected");

  // PATCH allows partial input, still .strict() against unknown keys, and
  // still rejects _id/createdAt/updatedAt (never part of the schema at all).
  assert.equal(certificateUpdateSchema.safeParse({ title: "New title only" }).success, true);
  assert.equal(
    certificateUpdateSchema.safeParse({ title: "ok", notARealField: 1 }).success,
    false
  );
  assert.equal(
    certificateUpdateSchema.safeParse({ _id: "507f1f77bcf86cd799439011" }).success,
    false,
    "_id must never be an accepted field"
  );
  assert.equal(
    certificateUpdateSchema.safeParse({ createdAt: new Date().toISOString() }).success,
    false,
    "createdAt must never be an accepted field"
  );
  console.log("PASS: partial update accepted; unknown/_id/createdAt fields rejected");

  assert.equal(
    certificateUpdateSchema.safeParse({}).success,
    false,
    "an empty update object must be rejected"
  );
  console.log("PASS: empty update object {} is rejected");
}

async function verifyDalRoundTrip() {
  const { connectToDatabase } = await import("@/lib/db/connection");
  const { CertificateModel } = await import("@/features/certificates/services/certificate.model");
  const {
    listAdminCertificates,
    getCertificateById,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  } = await import("@/features/certificates/services/certificateAdminRepository");

  await connectToDatabase();

  // Safety: never run against a slug that might collide with real content.
  await CertificateModel.deleteOne({ slug: TEST_SLUG });

  const created = await createCertificate({
    slug: TEST_SLUG,
    title: "Checkpoint 5.2 Verify Temp",
    category: "misc",
    school: "Verification Fixture School",
    credentialUrl: "https://example.com/cert/temp",
    issued: "jan 2026",
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/certificates/temp.jpg",
    imagePublicId: null,
    order: 9999,
    published: false,
  });
  assert.ok(created.id, "createCertificate() must return a document with an id");
  console.log(`PASS: createCertificate() succeeded (id=${created.id})`);

  const listed = await listAdminCertificates();
  assert.ok(
    listed.some((c) => c.id === created.id),
    "the newly created certificate must appear in listAdminCertificates()"
  );
  console.log("PASS: listAdminCertificates() includes the newly created certificate");

  const fetched = await getCertificateById(created.id);
  assert.ok(fetched, "getCertificateById() must find the just-created certificate");
  assert.equal(fetched!.title, "Checkpoint 5.2 Verify Temp");
  console.log("PASS: getCertificateById() returns the created certificate");

  const updated = await updateCertificate(created.id, {
    title: "Checkpoint 5.2 Verify Temp (updated)",
  });
  assert.ok(updated, "updateCertificate() must succeed for an existing id");
  assert.equal(updated!.title, "Checkpoint 5.2 Verify Temp (updated)");
  console.log("PASS: updateCertificate() persists a partial change");

  const notFoundGet = await getCertificateById("507f1f77bcf86cd799439011");
  assert.equal(notFoundGet, null, "a well-formed but nonexistent id must return null, not throw");
  console.log("PASS: getCertificateById() returns null for a well-formed but nonexistent id");

  const deleteResult = await deleteCertificate(created.id);
  assert.equal(deleteResult.deleted, true);
  console.log("PASS: deleteCertificate() reports deleted=true");

  const afterDelete = await getCertificateById(created.id);
  assert.equal(afterDelete, null, "the deleted certificate must no longer be retrievable");
  console.log("PASS: deleted certificate no longer appears via getCertificateById()");

  const listedAfterDelete = await listAdminCertificates();
  assert.ok(
    !listedAfterDelete.some((c) => c.id === created.id),
    "the deleted certificate must no longer appear in listAdminCertificates()"
  );
  console.log("PASS: deleted certificate no longer appears in listAdminCertificates()");

  const secondDelete = await deleteCertificate(created.id);
  assert.equal(
    secondDelete.deleted,
    false,
    "deleting an already-deleted id must report deleted=false, not throw"
  );
  console.log("PASS: deleting an already-deleted certificate reports deleted=false");
}

async function verifyDuplicateSlugHandling() {
  const { connectToDatabase } = await import("@/lib/db/connection");
  const { CertificateModel } = await import("@/features/certificates/services/certificate.model");
  const { createCertificate, updateCertificate, isDuplicateSlugError } = await import(
    "@/features/certificates/services/certificateAdminRepository"
  );

  await connectToDatabase();
  await CertificateModel.deleteMany({ slug: { $in: [TEST_SLUG, TEST_SLUG_2] } });

  const base = {
    title: "Dup Slug Fixture",
    category: "misc" as const,
    school: "Verification Fixture School",
    credentialUrl: "https://example.com/cert/temp",
    issued: "jan 2026",
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/certificates/temp.jpg",
    imagePublicId: null,
    order: 9998,
    published: false,
  };

  await createCertificate({ ...base, slug: TEST_SLUG });
  console.log(`PASS: first certificate created (slug=${TEST_SLUG})`);

  await assert.rejects(
    () => createCertificate({ ...base, slug: TEST_SLUG }),
    (error: unknown) => isDuplicateSlugError(error),
    "creating a certificate with a duplicate slug must throw a duplicate-key error"
  );
  console.log("PASS: createCertificate() with a duplicate slug throws a duplicate-key error (DB-level)");

  const stillOnlyOne = await CertificateModel.countDocuments({ slug: TEST_SLUG });
  assert.equal(stillOnlyOne, 1, "the failed duplicate create must not have inserted a second document");
  console.log("PASS: no duplicate document was actually inserted");

  const second = await createCertificate({ ...base, slug: TEST_SLUG_2 });
  console.log(`PASS: second certificate created (slug=${TEST_SLUG_2})`);

  await assert.rejects(
    () => updateCertificate(second.id, { slug: TEST_SLUG }),
    (error: unknown) => isDuplicateSlugError(error),
    "updating a certificate's slug to collide with another certificate's slug must throw a duplicate-key error"
  );
  console.log("PASS: updateCertificate() with a colliding slug throws a duplicate-key error (DB-level)");

  const secondUnchanged = await CertificateModel.findById(second.id).lean();
  assert.equal(
    secondUnchanged?.slug,
    TEST_SLUG_2,
    "the failed duplicate update must not have changed the document's slug"
  );
  console.log("PASS: the second certificate's slug was left unchanged after the failed update");
}

async function main() {
  await verifySchemas();
  await verifyDalRoundTrip();
  await verifyDuplicateSlugHandling();
  console.log("\nAll Certificate admin verification checks passed.");
}

main()
  .catch((error) => {
    console.error("Verification FAILED:", error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      const { connectToDatabase } = await import("@/lib/db/connection");
      const { CertificateModel } = await import("@/features/certificates/services/certificate.model");
      await connectToDatabase();
      const result = await CertificateModel.deleteMany({ slug: { $in: [TEST_SLUG, TEST_SLUG_2] } });
      if (result.deletedCount > 0) {
        console.log(`Cleanup: removed ${result.deletedCount} leftover test certificate(s).`);
      }
    } catch (cleanupError) {
      console.error(
        "Cleanup FAILED — a test certificate may remain, check manually:",
        cleanupError instanceof Error ? cleanupError.name : "UnknownError"
      );
    }
    process.exit(process.exitCode ?? 0);
  });
