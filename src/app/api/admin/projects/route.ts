import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyAdmin, UnauthenticatedError, UnauthorizedError } from "@/lib/auth/verifyAdmin";
import { projectInputSchema } from "@/features/projects/schemas/projectInput.schema";
import {
  listAdminProjects,
  createProject,
  isDuplicateSlugError,
} from "@/features/projects/services/projectAdminRepository";

// Checkpoint 5.1 — verifyAdmin() runs independently in every handler
// below, exactly as it does in src/app/api/admin/uploads/sign/route.ts
// (Checkpoint 4.5) — never relies on src/proxy.ts or
// admin/(protected)/layout.tsx having already gated the request, per
// PLAN.md Part IV §3: a route is independently reachable regardless of
// what any matcher/layout says.
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
    console.error("verifyAdmin() failed unexpectedly in admin/projects:", error);
    return NextResponse.json({ message: "Authorization check failed." }, { status: 500 });
  }
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const projects = await listAdminProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Failed to list admin projects:", error);
    return NextResponse.json({ message: "Unable to load projects." }, { status: 500 });
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
  // createdAt, or anything else) fails validation outright, same hardening
  // decision as the Cloudinary signing endpoint (Checkpoint 4.5).
  const parsed = projectInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Invalid project data.", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const project = await createProject(parsed.data);
    // /projects is statically generated (no dynamic API call in that
    // page — a pre-existing characteristic, unchanged by this checkpoint)
    // so without this, a new project would be invisible on the public
    // site until the next full `next build`/deploy. Only touches the one
    // path this domain owns.
    revalidatePath("/projects");
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    // A duplicate slug (real unique index at the DB level — see
    // isDuplicateSlugError's own comment) surfaces here as a Mongo E11000
    // error — worth a distinct, still-generic 409 rather than a bare 500,
    // since it's a legitimate, expected admin mistake (typo'd slug),
    // not a server malfunction. Shared with PATCH's identical branch in
    // admin/projects/[id]/route.ts so the two can't drift apart.
    if (isDuplicateSlugError(error)) {
      return NextResponse.json({ message: "A project with that slug already exists." }, { status: 409 });
    }
    console.error("Failed to create project:", error);
    return NextResponse.json({ message: "Unable to create project." }, { status: 500 });
  }
}

const methodNotAllowed = () =>
  NextResponse.json({ message: "Method Not Allowed" }, { status: 405, headers: { Allow: "GET, POST" } });

export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
