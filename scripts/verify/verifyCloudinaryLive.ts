// Live, end-to-end check against a REAL Cloudinary account: uploads one
// tiny generated PNG through the same signing logic the app uses, confirms
// it landed in the expected controlled folder with a working secure URL
// and real metadata, then deletes it via the server-side SDK so no junk
// asset is left behind. Requires real CLOUDINARY_* values in .env.local.
//
// Run via: npm run verify:cloudinaryLive
// Never logs signature/secret values — only non-sensitive result fields.
import assert from "node:assert/strict";
import type { ImageFormat } from "cloudinary";

// A minimal valid 1x1 red PNG, generated inline so this script has no file
// dependency and leaves nothing on disk.
const ONE_BY_ONE_RED_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

async function main() {
  const { getCloudinaryClient } = await import("@/lib/cloudinary/config");
  const { createSignedUploadParams } = await import("@/lib/cloudinary/sign");

  const cloudinary = getCloudinaryClient();
  const signed = createSignedUploadParams("PROJECT_IMAGE");

  console.log(`Uploading a throwaway 1x1 test image to folder "${signed.folder}"...`);

  const dataUri = `data:image/png;base64,${ONE_BY_ONE_RED_PNG_BASE64}`;

  const uploadResult = await cloudinary.uploader.upload(dataUri, {
    api_key: signed.apiKey,
    timestamp: signed.timestamp,
    signature: signed.signature,
    folder: signed.folder,
    // The SDK's types want an array; it internally re-joins with "," before
    // sending (node_modules/cloudinary/lib/utils/parsing/toArray.js), so
    // this produces the exact same request-body value that was signed.
    allowed_formats: signed.allowedFormats.split(",") as ImageFormat[],
  });

  assert.ok(uploadResult.public_id, "upload result must include public_id");
  assert.ok(uploadResult.secure_url, "upload result must include secure_url");
  assert.equal(uploadResult.width, 1, "expected 1px width");
  assert.equal(uploadResult.height, 1, "expected 1px height");
  assert.ok(uploadResult.format, "upload result must include format");
  assert.ok(
    uploadResult.public_id.startsWith(`${signed.folder}/`),
    `expected public_id to live under "${signed.folder}/", got "${uploadResult.public_id}"`
  );

  console.log("Upload succeeded:");
  console.log(`  publicId: ${uploadResult.public_id}`);
  console.log(`  secureUrl: ${uploadResult.secure_url}`);
  console.log(`  width x height: ${uploadResult.width} x ${uploadResult.height}`);
  console.log(`  format: ${uploadResult.format}`);
  console.log(`  bytes: ${uploadResult.bytes}`);

  console.log("Confirming secureUrl is reachable...");
  const fetchResult = await fetch(uploadResult.secure_url);
  assert.equal(fetchResult.status, 200, "secureUrl should return HTTP 200");
  console.log(`  HTTP ${fetchResult.status} OK`);

  console.log("Deleting the test asset via the Admin API...");
  const destroyResult = await cloudinary.uploader.destroy(uploadResult.public_id);
  assert.equal(destroyResult.result, "ok", `expected destroy result "ok", got "${destroyResult.result}"`);
  console.log("  Deleted successfully. No junk asset left behind.");

  console.log("\nLive Cloudinary verification passed.");
}

main().catch((error) => {
  console.error("Live verification FAILED:", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
