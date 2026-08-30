import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/verifyAdmin";
import { uploadPurposeSchema } from "@/lib/cloudinary/purposes";
import { createSignedUploadParams } from "@/lib/cloudinary/sign";
import { CloudinaryConfigError } from "@/lib/cloudinary/config";

// Checkpoint 4.5 — verifyAdmin() is the authoritative check here, exactly
// as it is in every other admin Server Action / protected Route Handler
// (PLAN.md Part IV §3). This route is independently POST-reachable
// regardless of src/proxy.ts's matcher, so it re-verifies from scratch —
// it does not assume proxy.ts or the protected layout already handled it.
//
// Checkpoint 4.5 hardening pass — .strict() instead of the plain object
// schema: an unrecognized key (folder/timestamp/resource_type/anything
// else) now fails validation outright rather than being silently
// stripped. verifyAdmin() and createSignedUploadParams()'s own
// server-derived values were already authoritative either way — this
// doesn't change what could ever be signed, only makes an attempted
// smuggle attempt a hard 400 instead of a quiet no-op, for clearer API
// semantics and defense-in-depth.
const requestSchema = z.object({ purpose: uploadPurposeSchema }).strict();

export async function POST(request: Request) {
  try {
    await verifyAdmin();
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Not authorized." }, { status: 403 });
    }
    // Unexpected failure inside verifyAdmin() itself — fail closed, no
    // signature, no stack trace or internal detail in the response.
    console.error("verifyAdmin() failed unexpectedly in uploads/sign:", error);
    return NextResponse.json({ message: "Authorization check failed." }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request body." }, { status: 400 });
  }

  // Only `purpose` is ever read from the client. There is no code path
  // that lets a caller influence folder, timestamp, or resource_type —
  // those are entirely server-derived below, and .strict() above now
  // rejects the request outright if any such extra field is present at
  // all, rather than silently dropping it.
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Request body must contain only a supported upload purpose." },
      { status: 400 }
    );
  }

  try {
    const signedParams = createSignedUploadParams(parsed.data.purpose);
    return NextResponse.json(signedParams);
  } catch (error) {
    if (error instanceof CloudinaryConfigError) {
      // Deliberately generic to the client — never reflect which specific
      // env var is missing/malformed.
      console.error("Cloudinary is not configured:", error.message);
      return NextResponse.json({ message: "Upload service is not configured." }, { status: 500 });
    }
    console.error("Failed to generate Cloudinary upload signature:", error);
    return NextResponse.json({ message: "Unable to generate upload signature." }, { status: 500 });
  }
}

const methodNotAllowed = () =>
  NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: { Allow: "POST" } });

export const GET = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
