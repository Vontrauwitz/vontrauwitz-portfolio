import type { UploadPurpose } from "./purposes";

// Checkpoint 4.5 — client-safe upload helper for future admin CMS forms.
// No secrets, no Cloudinary config, no auth logic here: it only calls the
// signing endpoint (which does the real authorization) and then POSTs
// straight from the browser to Cloudinary using exactly the params that
// came back signed. It never sends resource_type, folder, or timestamp of
// its own choosing — everything except the file and the requested
// `purpose` originates from the server response.
export class UploadError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "UploadError";
    this.cause = cause;
  }
}

export interface NormalizedUploadResult {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface SignResponseBody {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  allowedFormats: string;
}

function isSignResponseBody(value: unknown): value is SignResponseBody {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.signature === "string" &&
    typeof v.timestamp === "number" &&
    typeof v.cloudName === "string" &&
    typeof v.apiKey === "string" &&
    typeof v.folder === "string" &&
    typeof v.allowedFormats === "string"
  );
}

async function requestSignature(purpose: UploadPurpose): Promise<SignResponseBody> {
  const response = await fetch("/api/admin/uploads/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ purpose }),
  });

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (cause) {
    throw new UploadError("Received a malformed signing response.", cause);
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String((payload as { message: unknown }).message)
        : "Unable to obtain an upload signature.";
    throw new UploadError(message);
  }

  if (!isSignResponseBody(payload)) {
    throw new UploadError("Received an incomplete signing response.");
  }

  return payload;
}

interface RawCloudinaryUploadResult {
  public_id?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: { message?: string };
}

function normalizeCloudinaryResult(raw: RawCloudinaryUploadResult): NormalizedUploadResult {
  if (
    !raw.public_id ||
    !raw.secure_url ||
    typeof raw.width !== "number" ||
    typeof raw.height !== "number" ||
    !raw.format ||
    typeof raw.bytes !== "number"
  ) {
    throw new UploadError("Cloudinary response was missing expected fields.");
  }

  return {
    publicId: raw.public_id,
    secureUrl: raw.secure_url,
    width: raw.width,
    height: raw.height,
    format: raw.format,
    bytes: raw.bytes,
  };
}

/**
 * Signs, then uploads `file` directly from the browser to Cloudinary for
 * the given `purpose`. Never persists anything to the database — the
 * caller decides what to do with the normalized result.
 */
export async function uploadImage(
  file: File,
  purpose: UploadPurpose
): Promise<NormalizedUploadResult> {
  const signed = await requestSignature(purpose);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signed.apiKey);
  formData.append("timestamp", String(signed.timestamp));
  formData.append("signature", signed.signature);
  formData.append("folder", signed.folder);
  formData.append("allowed_formats", signed.allowedFormats);

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${signed.cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
  } catch (cause) {
    throw new UploadError("Could not reach Cloudinary.", cause);
  }

  let raw: RawCloudinaryUploadResult;
  try {
    raw = (await uploadResponse.json()) as RawCloudinaryUploadResult;
  } catch (cause) {
    throw new UploadError("Cloudinary returned a malformed response.", cause);
  }

  if (!uploadResponse.ok) {
    throw new UploadError(raw.error?.message ?? "Cloudinary upload failed.");
  }

  return normalizeCloudinaryResult(raw);
}
