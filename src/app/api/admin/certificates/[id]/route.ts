import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/verifyAdmin";
import { certificateUpdateSchema } from "@/features/certificates/schemas/certificateInput.schema";
import {
  getCertificateById,
  updateCertificate,
  deleteCertificate,
  isValidCertificateId,
  isDuplicateSlugError,
} from "@/features/certificates/services/certificateAdminRepository";

// Checkpoint 5.2 — same independent verifyAdmin() pattern as
// admin/certificates/route.ts (this file's sibling).
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
    console.error("verifyAdmin() failed unexpectedly in admin/certificates/[id]:", error);
    return NextResponse.json({ message: "Authorization check failed." }, { status: 500 });
  }
}

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  // Server validates the id shape before ever querying Mongo with it —
  // a malformed id is a client mistake (400), not a "document not found"
  // (404).
  if (!isValidCertificateId(id)) {
    return NextResponse.json({ message: "Invalid certificate id." }, { status: 400 });
  }

  try {
    const certificate = await getCertificateById(id);
    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
    }
    return NextResponse.json({ certificate });
  } catch (error) {
    console.error("Failed to load certificate:", error);
    return NextResponse.json({ message: "Unable to load certificate." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidCertificateId(id)) {
    return NextResponse.json({ message: "Invalid certificate id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request body." }, { status: 400 });
  }

  const parsed = certificateUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid certificate data.", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const certificate = await updateCertificate(id, parsed.data);
    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
    }
    revalidatePath("/certificates");
    return NextResponse.json({ certificate });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return NextResponse.json({ message: "A certificate with that slug already exists." }, { status: 409 });
    }
    console.error("Failed to update certificate:", error);
    return NextResponse.json({ message: "Unable to update certificate." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidCertificateId(id)) {
    return NextResponse.json({ message: "Invalid certificate id." }, { status: 400 });
  }

  try {
    // Same deferred-cleanup policy as Projects (Checkpoint 5.1's DELETE
    // handler — see that file's own comment for the full rationale): the
    // Cloudinary asset (if any) is deliberately left in place. Doing the
    // Mongo delete and a Cloudinary destroy as one safe unit is real
    // consistency-risk infrastructure this checkpoint doesn't build.
    // deleteCertificate() reads imagePublicId back from the deleted
    // record itself, never from client input, for whenever that future
    // checkpoint lands.
    const result = await deleteCertificate(id);
    if (!result.deleted) {
      return NextResponse.json({ message: "Certificate not found." }, { status: 404 });
    }
    revalidatePath("/certificates");
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete certificate:", error);
    return NextResponse.json({ message: "Unable to delete certificate." }, { status: 500 });
  }
}

const methodNotAllowed = () =>
  NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405, headers: { Allow: "GET, PATCH, DELETE" } }
  );

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
