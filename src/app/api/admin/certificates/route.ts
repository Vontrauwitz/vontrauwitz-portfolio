import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/verifyAdmin";
import { certificateInputSchema } from "@/features/certificates/schemas/certificateInput.schema";
import {
  listAdminCertificates,
  createCertificate,
  isDuplicateSlugError,
} from "@/features/certificates/services/certificateAdminRepository";

// Checkpoint 5.2 — mirrors src/app/api/admin/projects/route.ts
// (Checkpoint 5.1, hardened in its follow-up pass) exactly: verifyAdmin()
// runs independently in every handler below, never relies on
// src/proxy.ts or admin/(protected)/layout.tsx having already gated the
// request, per PLAN.md Part IV §3.
async function requireAdmin(): Promise<NextResponse | null> {
  try {
    await verifyAdmin();
    return null;
  } catch (error) {
    if (error instanceof UnauthenticatedError) {
      return NextResponse.json({ message: "Authentication required." }, { status: 401 });
    }
    if (error instanceof UnauthorizedError) {
      return NextResponse.json({ message: "Not authorized." }, { status: 403 });
    }
    console.error("verifyAdmin() failed unexpectedly in admin/certificates:", error);
    return NextResponse.json({ message: "Authorization check failed." }, { status: 500 });
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const certificates = await listAdminCertificates();
    return NextResponse.json({ certificates });
  } catch (error) {
    console.error("Failed to list admin certificates:", error);
    return NextResponse.json({ message: "Unable to load certificates." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request body." }, { status: 400 });
  }

  // .strict() — an unrecognized key (e.g. a client trying to set _id,
  // createdAt, or anything else) fails validation outright.
  const parsed = certificateInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid certificate data.", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const certificate = await createCertificate(parsed.data);
    // /certificates is statically generated (same pre-existing
    // characteristic as /projects — see that route's identical comment)
    // so without this, a new certificate would be invisible on the
    // public site until the next full `next build`/deploy.
    revalidatePath("/certificates");
    return NextResponse.json({ certificate }, { status: 201 });
  } catch (error) {
    // A duplicate slug (real DB-level unique index — confirmed via
    // CertificateModel.collection.indexes(), same as Projects) surfaces
    // here as a Mongo E11000 error — a distinct, still-generic 409 rather
    // than a bare 500, since it's a legitimate, expected admin mistake.
    if (isDuplicateSlugError(error)) {
      return NextResponse.json({ message: "A certificate with that slug already exists." }, { status: 409 });
    }
    console.error("Failed to create certificate:", error);
    return NextResponse.json({ message: "Unable to create certificate." }, { status: 500 });
  }
}

const methodNotAllowed = () =>
  NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: { Allow: "GET, POST" } });

export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
