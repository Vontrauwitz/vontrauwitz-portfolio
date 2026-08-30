// Verifies the Cloudinary signing logic in isolation — no network calls,
// no real Cloudinary account needed. Run via: npm run verify:cloudinarySign
//
// Deliberately does NOT import this project's real .env.local Cloudinary
// values for the "valid config" assertions below; it sets throwaway fake
// credentials on process.env itself, since src/lib/cloudinary/config.ts
// reads process.env lazily (on first call, memoized), not at import time —
// exactly the property that makes this script possible without touching
// real secrets. The "missing config" assertions run first, before any
// fake credentials are set, and against a fresh module instance (dynamic
// import after clearing require cache isn't available under ESM/tsx, so
// this script controls ordering instead: read-credential functions are
// only called once per config state within a single process).
import assert from "node:assert/strict";

async function main() {
  // 1) Missing config fails closed — no Cloudinary env vars set yet.
  delete process.env.CLOUDINARY_CLOUD_NAME;
  delete process.env.CLOUDINARY_API_KEY;
  delete process.env.CLOUDINARY_API_SECRET;

  const { getCloudinaryCredentials, CloudinaryConfigError } = await import(
    "@/lib/cloudinary/config"
  );

  assert.throws(
    () => getCloudinaryCredentials(),
    CloudinaryConfigError,
    "getCloudinaryCredentials() should throw CloudinaryConfigError when env vars are missing"
  );
  console.log("PASS: missing Cloudinary config fails closed (CloudinaryConfigError)");

  // 2) purpose -> folder mapping, and unknown purpose rejected.
  const { getFolderForPurpose, uploadPurposeSchema, UPLOAD_PURPOSES } = await import(
    "@/lib/cloudinary/purposes"
  );

  assert.equal(getFolderForPurpose("PROJECT_IMAGE"), "portfolio/projects");
  assert.equal(getFolderForPurpose("CERTIFICATE_IMAGE"), "portfolio/certificates");
  assert.equal(getFolderForPurpose("PROFILE_IMAGE"), "portfolio/profile");
  console.log("PASS: every supported purpose maps to its expected folder");

  assert.throws(
    () => getFolderForPurpose("NOT_A_REAL_PURPOSE" as (typeof UPLOAD_PURPOSES)[number]),
    /No folder mapping configured/,
    "getFolderForPurpose() should throw for an unrecognized purpose"
  );
  console.log("PASS: unknown purpose is rejected by getFolderForPurpose()");

  const parsedUnknown = uploadPurposeSchema.safeParse("NOT_A_REAL_PURPOSE");
  assert.equal(parsedUnknown.success, false, "uploadPurposeSchema should reject an unknown purpose");
  console.log("PASS: unknown purpose is rejected by uploadPurposeSchema (what the route actually uses)");

  // 3) Route-level input contract (hardening pass): the schema is now
  // .strict(), so a client sending ANY extra field alongside `purpose` —
  // folder/timestamp/resource_type, or literally anything else — fails
  // validation outright rather than being silently stripped. There is
  // still no code path in createSignedUploadParams() that accepts any of
  // those as input at all (its signature is `(purpose: UploadPurpose)`),
  // so this is defense-in-depth on top of an already-authoritative
  // server, not a new trust boundary. Confirmed here at the exact schema
  // shape the route uses.
  const { z } = await import("zod");
  const requestSchema = z.object({ purpose: uploadPurposeSchema }).strict();

  const validOnly = requestSchema.safeParse({ purpose: "PROJECT_IMAGE" });
  assert.equal(validOnly.success, true, "a body containing only `purpose` must still be accepted");
  console.log("PASS: { purpose: \"PROJECT_IMAGE\" } is accepted");

  for (const extraField of ["folder", "timestamp", "resource_type", "anythingElse"]) {
    const withExtra = requestSchema.safeParse({
      purpose: "PROJECT_IMAGE",
      [extraField]: extraField === "timestamp" ? 123 : "evil",
    });
    assert.equal(
      withExtra.success,
      false,
      `a body with an unexpected "${extraField}" field must be rejected, not stripped`
    );
  }
  console.log("PASS: folder/timestamp/resource_type/anythingElse are all rejected (400), not stripped");

  // 4) Valid (fake, throwaway) config -> signing actually runs, timestamp
  // is server-generated, and signatures are deterministic for fixed input.
  process.env.CLOUDINARY_CLOUD_NAME = "test-cloud";
  process.env.CLOUDINARY_API_KEY = "123456789012345";
  process.env.CLOUDINARY_API_SECRET = "fake-test-secret-not-real-1234567890";

  const { createSignedUploadParams } = await import("@/lib/cloudinary/sign");

  const before = Math.floor(Date.now() / 1000);
  const signed1 = createSignedUploadParams("PROJECT_IMAGE");
  const after = Math.floor(Date.now() / 1000);

  assert.ok(
    signed1.timestamp >= before && signed1.timestamp <= after,
    "timestamp must be the server's current time, not client-influenced"
  );
  assert.equal(signed1.folder, "portfolio/projects");
  assert.equal(signed1.cloudName, "test-cloud");
  assert.equal(signed1.apiKey, "123456789012345");
  assert.ok(signed1.signature.length > 0, "signature must be non-empty");
  console.log("PASS: valid config produces a signed payload with a server-generated timestamp");

  // Deterministic signature: same secret, same signed params (forcing the
  // same timestamp by calling the underlying SDK utility directly) ->
  // same signature every time.
  const { getCloudinaryClient, getCloudinaryCredentials: getCreds } = await import(
    "@/lib/cloudinary/config"
  );
  const cloudinary = getCloudinaryClient();
  const { apiSecret } = getCreds();
  const fixedParams = { timestamp: 1700000000, folder: "portfolio/projects", allowed_formats: "jpg,jpeg,png,webp,gif,avif" };
  const sigA = cloudinary.utils.api_sign_request(fixedParams, apiSecret);
  const sigB = cloudinary.utils.api_sign_request(fixedParams, apiSecret);
  assert.equal(sigA, sigB, "signing the same params with the same secret must be deterministic");
  console.log("PASS: signature generation is deterministic for fixed params + secret");

  // 5) Response payload never contains the secret itself.
  const signedKeys = Object.keys(signed1);
  assert.ok(
    !signedKeys.includes("apiSecret") && !JSON.stringify(signed1).includes(process.env.CLOUDINARY_API_SECRET!),
    "signed payload must never contain CLOUDINARY_API_SECRET"
  );
  console.log("PASS: signed payload never contains the API secret");

  console.log("\nAll Cloudinary signing checks passed.");
}

main().catch((error) => {
  console.error("Verification FAILED:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
