import "server-only";
import { v2 as cloudinaryClient } from "cloudinary";

// Checkpoint 4.5 — deliberately NOT merged into src/lib/env/server.ts.
// That module throws at import time, and it's already imported by
// everything that reads MONGODB_URI (i.e. most of the app) — Cloudinary is
// only needed by the upload feature, so coupling its config to the same
// eager, whole-app-crashing check would take down unrelated pages/routes
// the moment Cloudinary env vars are absent or wrong. Validation here is
// lazy (only runs when a Cloudinary operation is actually attempted) and
// memoized, so a missing/malformed config fails closed exactly where it
// matters — inside the signing/upload code path — without being a second,
// duplicate "auth" or "config" architecture: this is the only place in the
// app that reads these three env vars.
export class CloudinaryConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CloudinaryConfigError";
  }
}

interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

let cachedCredentials: CloudinaryCredentials | null = null;

function readCredentials(): CloudinaryCredentials {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new CloudinaryConfigError(
      "Cloudinary is not configured: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, " +
      "and CLOUDINARY_API_SECRET must all be set."
    );
  }

  return { cloudName, apiKey, apiSecret };
}

/** Fails closed — throws CloudinaryConfigError rather than returning a partial/undefined config. */
export function getCloudinaryCredentials(): CloudinaryCredentials {
  cachedCredentials ??= readCredentials();
  return cachedCredentials;
}

let configured = false;

/** Returns the official SDK instance, configured exactly once per process. */
export function getCloudinaryClient() {
  if (!configured) {
    const { cloudName, apiKey, apiSecret } = getCloudinaryCredentials();
    cloudinaryClient.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinaryClient;
}
