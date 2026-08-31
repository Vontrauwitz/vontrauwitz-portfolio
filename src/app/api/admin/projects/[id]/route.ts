import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/verifyAdmin";
import { projectUpdateSchema } from "@/features/projects/schemas/projectInput.schema";
import {
  getProjectById,
  updateProject,
  deleteProject,
  isValidProjectId,
  isDuplicateSlugError,
} from "@/features/projects/services/projectAdminRepository";

// Checkpoint 5.1 — same independent verifyAdmin() pattern as
// admin/projects/route.ts (this file's sibling) and
// admin/uploads/sign/route.ts (Checkpoint 4.5). See that file's comment.
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
    console.error("verifyAdmin() failed unexpectedly in admin/projects/[id]:", error);
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
  // (404); relying on Mongoose to throw a CastError and catching that as
  // a pseudo-404 would blur that distinction.
  if (!isValidProjectId(id)) {
    return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
  }

  try {
    const project = await getProjectById(id);
    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    console.error("Failed to load project:", error);
    return NextResponse.json({ message: "Unable to load project." }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidProjectId(id)) {
    return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Malformed request body." }, { status: 400 });
  }

  const parsed = projectUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid project data.", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const project = await updateProject(id, parsed.data);
    if (!project) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }
    // See admin/projects/route.ts's POST handler for why this is needed.
    revalidatePath("/projects");
    return NextResponse.json({ project });
  } catch (error) {
    if (isDuplicateSlugError(error)) {
      return NextResponse.json({ message: "A project with that slug already exists." }, { status: 409 });
    }
    console.error("Failed to update project:", error);
    return NextResponse.json({ message: "Unable to update project." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  if (!isValidProjectId(id)) {
    return NextResponse.json({ message: "Invalid project id." }, { status: 400 });
  }

  try {
    // Checkpoint 5.1 deliberately does NOT delete the Cloudinary asset
    // here, even though deleteProject() returns the record's own
    // imagePublicId (never client-supplied — read back from the deleted
    // Mongo document). Doing so safely requires the Mongo delete and the
    // Cloudinary destroy to behave as one unit — if the DB delete
    // succeeds but the Cloudinary call fails (or vice versa), the asset
    // and the record disagree with no rollback in place. That's real
    // consistency-risk infrastructure (a queue, a retry/reconciliation
    // job, or at minimum a soft-delete-then-sweep pattern), not something
    // to improvise inline in this checkpoint. Deferred to a focused later
    // checkpoint; documented here rather than silently risking orphaned
    // or double-deleted assets. For now: DB record deleted, Cloudinary
    // asset (if any) is left in place — an intentionally-chosen orphan,
    // not a bug.
    const result = await deleteProject(id);
    if (!result.deleted) {
      return NextResponse.json({ message: "Project not found." }, { status: 404 });
    }
    revalidatePath("/projects");
    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ message: "Unable to delete project." }, { status: 500 });
  }
}

const methodNotAllowed = () =>
  NextResponse.json(
    { message: "Method Not Allowed" },
    { status: 405, headers: { Allow: "GET, PATCH, DELETE" } }
  );

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
