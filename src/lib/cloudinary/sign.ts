import "server-only";
import { getCloudinaryClient, getCloudinaryCredentials } from "./config";
import { getFolderForPurpose, type UploadPurpose } from "./purposes";

// Checkpoint 4.5 — the only place that produces a Cloudinary upload
// signature. Deliberately tiny signed-parameter surface: timestamp, folder,
// and allowed_formats. Nothing here is client-supplied — the caller passes
// only a `purpose`, already validated against the shared enum by the route
// handler before this runs.
//
// resource_type is NOT one of the signed params below, and that's a real,
// documented limitation, not an oversight: Cloudinary's signature only
// binds the params it was computed over, not the URL path a client later
// POSTs to. A client holding a valid signature for {timestamp, folder,
// allowed_formats} could in principle send that same signed payload to a
// different resource_type endpoint (e.g. .../video/upload) and it would
// still validate, since resource_type isn't part of what's signed. This
// checkpoint's actual image-only enforcement comes from allowed_formats
// (a real signed param Cloudinary itself checks against the uploaded
// file), combined with the client helper (uploadImage.ts) hardcoding the
// image/upload endpoint URL and never exposing resource_type as a caller
// input. A stronger guarantee (e.g. rejecting the request outright if
// Cloudinary ever reports a non-image resource_type back) is future work,
// not implemented here.
const ALLOWED_FORMATS = "jpg,jpeg,png,webp,gif,avif";

export interface SignedUploadParams {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  allowedFormats: string;
}

/** Fails closed — throws (CloudinaryConfigError, or an unknown-purpose Error) rather than returning a partial payload. */
export function createSignedUploadParams(purpose: UploadPurpose): SignedUploadParams {
  const folder = getFolderForPurpose(purpose);
  const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
  const cloudinary = getCloudinaryClient();

  // Server-generated, never client-supplied — see this module's own header
  // comment and PLAN.md's Checkpoint 4.5 note on signature timestamps.
  const timestamp = Math.floor(Date.now() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
    allowed_formats: ALLOWED_FORMATS,
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder,
    allowedFormats: ALLOWED_FORMATS,
  };
}
