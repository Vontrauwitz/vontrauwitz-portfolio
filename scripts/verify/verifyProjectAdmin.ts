// Verifies Checkpoint 5.1's Project admin validation + DAL in one pass.
// Run via: npm run verify:projectAdmin
//
// Part 1 (schema, pure, no network): projectInputSchema/projectUpdateSchema
// behavior in isolation.
// Part 2 (live DAL round trip against the real .env.local database): a
// single throwaway test Project, created/listed/updated/deleted through
// the actual admin repository functions.
// Part 3 (hardening pass, live): duplicate-slug rejection on both create
// and update, exercised against the real DB-level unique index — not a
// pre-check simulation.
// All temp projects (slugs starting "checkpoint-5-1-verify-project-temp")
// are cleaned up unconditionally in a finally block so a failed assertion
// never leaves one behind.
import assert from "node:assert/strict";

const TEST_SLUG = "checkpoint-5-1-verify-project-temp";
const TEST_SLUG_2 = "checkpoint-5-1-verify-project-temp-2";

async function verifySchemas() {
  const { projectInputSchema, projectUpdateSchema } = await import(
    "@/features/projects/schemas/projectInput.schema"
  );

  const validInput = {
    slug: "sample-project",
    title: "Sample Project",
    titleNote: null,
    type: "Full-Stack App",
    summary: "A sample project for validation testing.",
    note: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/sample.jpg",
    imageWidth: 1200,
    imageHeight: 800,
    imagePublicId: "portfolio/projects/sample",
    deployUrl: "https://example.com",
    githubUrl: "https://github.com/example/sample",
    icon: "github",
    technologies: ["React", "Next.js"],
    featured: false,
    order: 0,
    published: true,
  };

  assert.equal(projectInputSchema.safeParse(validInput).success, true);
  console.log("PASS: valid project input accepted");

  assert.equal(
    projectInputSchema.safeParse({ ...validInput, arbitraryField: "sneaky" }).success,
    false,
    "unknown field must be rejected by .strict()"
  );
  console.log("PASS: unknown field rejected");

  assert.equal(
    projectInputSchema.safeParse({ ...validInput, githubUrl: "not-a-url" }).success,
    false
  );
  assert.equal(
    projectInputSchema.safeParse({ ...validInput, deployUrl: "not-a-url" }).success,
    false
  );
  console.log("PASS: invalid URL rejected (githubUrl, deployUrl)");

  assert.equal(projectInputSchema.safeParse({ ...validInput, order: -1 }).success, false);
  assert.equal(projectInputSchema.safeParse({ ...validInput, order: 1.5 }).success, false);
  assert.equal(projectInputSchema.safeParse({ ...validInput, order: 100000 }).success, false);
  console.log("PASS: invalid order rejected (negative, non-integer, out of bounds)");

  assert.equal(
    projectInputSchema.safeParse({ ...validInput, slug: "Not A Valid Slug!" }).success,
    false
  );
  console.log("PASS: invalid slug rejected");

  assert.equal(
    projectInputSchema.safeParse({ title: "Missing everything else" }).success,
    false
  );
  console.log("PASS: incomplete create payload rejected");

  // PATCH allows partial input, still .strict() against unknown keys.
  assert.equal(projectUpdateSchema.safeParse({ title: "New title only" }).success, true);
  assert.equal(
    projectUpdateSchema.safeParse({ title: "ok", notARealField: 1 }).success,
    false
  );
  console.log("PASS: partial update accepted; unknown field still rejected");

  // Hardening pass: {} must be rejected, not silently accepted as a no-op.
  assert.equal(
    projectUpdateSchema.safeParse({}).success,
    false,
    "an empty update object must be rejected"
  );
  console.log("PASS: empty update object {} is rejected");
}

async function verifyDalRoundTrip() {
  const { connectToDatabase } = await import("@/lib/db/connection");
  const { ProjectModel } = await import("@/features/projects/services/project.model");
  const {
    listAdminProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  } = await import("@/features/projects/services/projectAdminRepository");

  await connectToDatabase();

  // Safety: never run against a slug that might collide with real content.
  await ProjectModel.deleteOne({ slug: TEST_SLUG });

  const created = await createProject({
    slug: TEST_SLUG,
    title: "Checkpoint 5.1 Verify Temp",
    titleNote: null,
    type: "Verification fixture",
    summary: "Temporary project created by verify:projectAdmin, deleted at the end of the same run.",
    note: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/temp.jpg",
    imageWidth: 100,
    imageHeight: 100,
    imagePublicId: null,
    deployUrl: null,
    githubUrl: "https://github.com/example/temp",
    icon: "github",
    technologies: ["Test"],
    featured: false,
    order: 9999,
    published: false,
  });
  assert.ok(created.id, "createProject() must return a document with an id");
  console.log(`PASS: createProject() succeeded (id=${created.id})`);

  const listed = await listAdminProjects();
  assert.ok(
    listed.some((p) => p.id === created.id),
    "the newly created project must appear in listAdminProjects()"
  );
  console.log("PASS: listAdminProjects() includes the newly created project");

  const fetched = await getProjectById(created.id);
  assert.ok(fetched, "getProjectById() must find the just-created project");
  assert.equal(fetched!.title, "Checkpoint 5.1 Verify Temp");
  console.log("PASS: getProjectById() returns the created project");

  const updated = await updateProject(created.id, { title: "Checkpoint 5.1 Verify Temp (updated)" });
  assert.ok(updated, "updateProject() must succeed for an existing id");
  assert.equal(updated!.title, "Checkpoint 5.1 Verify Temp (updated)");
  console.log("PASS: updateProject() persists a partial change");

  const notFoundGet = await getProjectById("507f1f77bcf86cd799439011");
  assert.equal(notFoundGet, null, "a well-formed but nonexistent id must return null, not throw");
  console.log("PASS: getProjectById() returns null for a well-formed but nonexistent id");

  const deleteResult = await deleteProject(created.id);
  assert.equal(deleteResult.deleted, true);
  console.log("PASS: deleteProject() reports deleted=true");

  const afterDelete = await getProjectById(created.id);
  assert.equal(afterDelete, null, "the deleted project must no longer be retrievable");
  console.log("PASS: deleted project no longer appears via getProjectById()");

  const listedAfterDelete = await listAdminProjects();
  assert.ok(
    !listedAfterDelete.some((p) => p.id === created.id),
    "the deleted project must no longer appear in listAdminProjects()"
  );
  console.log("PASS: deleted project no longer appears in listAdminProjects()");

  const secondDelete = await deleteProject(created.id);
  assert.equal(secondDelete.deleted, false, "deleting an already-deleted id must report deleted=false, not throw");
  console.log("PASS: deleting an already-deleted project reports deleted=false");
}

async function verifyDuplicateSlugHandling() {
  const { connectToDatabase } = await import("@/lib/db/connection");
  const { ProjectModel } = await import("@/features/projects/services/project.model");
  const { createProject, updateProject, isDuplicateSlugError } = await import(
    "@/features/projects/services/projectAdminRepository"
  );

  await connectToDatabase();
  await ProjectModel.deleteMany({ slug: { $in: [TEST_SLUG, TEST_SLUG_2] } });

  const base = {
    title: "Dup Slug Fixture",
    titleNote: null,
    type: "Verification fixture",
    summary: "Temporary project for duplicate-slug verification.",
    note: null,
    image: "https://res.cloudinary.com/demo/image/upload/v1/portfolio/projects/temp.jpg",
    imageWidth: 100,
    imageHeight: 100,
    imagePublicId: null,
    deployUrl: null,
    githubUrl: "https://github.com/example/temp",
    icon: "github",
    technologies: ["Test"],
    featured: false,
    order: 9999,
    published: false,
  };

  await createProject({ ...base, slug: TEST_SLUG });
  console.log(`PASS: first project created (slug=${TEST_SLUG})`);

  // A) POST-equivalent: creating a second project with the SAME slug must
  // fail at the database level (the real unique index), not silently
  // succeed or silently overwrite.
  await assert.rejects(
    () => createProject({ ...base, slug: TEST_SLUG }),
    (error: unknown) => isDuplicateSlugError(error),
    "creating a project with a duplicate slug must throw a duplicate-key error"
  );
  console.log("PASS: createProject() with a duplicate slug throws a duplicate-key error (DB-level)");

  const stillOnlyOne = await ProjectModel.countDocuments({ slug: TEST_SLUG });
  assert.equal(stillOnlyOne, 1, "the failed duplicate create must not have inserted a second document");
  console.log("PASS: no duplicate document was actually inserted");

  // B) PATCH-equivalent: a second, distinctly-slugged project, then update
  // it to collide with the first project's slug — same DB-level rejection
  // path (findByIdAndUpdate hits the same unique index on write).
  const second = await createProject({ ...base, slug: TEST_SLUG_2 });
  console.log(`PASS: second project created (slug=${TEST_SLUG_2})`);

  await assert.rejects(
    () => updateProject(second.id, { slug: TEST_SLUG }),
    (error: unknown) => isDuplicateSlugError(error),
    "updating a project's slug to collide with another project's slug must throw a duplicate-key error"
  );
  console.log("PASS: updateProject() with a colliding slug throws a duplicate-key error (DB-level)");

  const secondUnchanged = await ProjectModel.findById(second.id).lean();
  assert.equal(
    secondUnchanged?.slug,
    TEST_SLUG_2,
    "the failed duplicate update must not have changed the document's slug"
  );
  console.log("PASS: the second project's slug was left unchanged after the failed update");
}

async function main() {
  await verifySchemas();
  await verifyDalRoundTrip();
  await verifyDuplicateSlugHandling();
  console.log("\nAll Project admin verification checks passed.");
}

main()
  .catch((error) => {
    console.error("Verification FAILED:", error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  })
  .finally(async () => {
    // Unconditional cleanup — runs even if an assertion above threw, so a
    // failed run never leaves the temp project behind.
    try {
      const { connectToDatabase } = await import("@/lib/db/connection");
      const { ProjectModel } = await import("@/features/projects/services/project.model");
      await connectToDatabase();
      const result = await ProjectModel.deleteMany({ slug: { $in: [TEST_SLUG, TEST_SLUG_2] } });
      if (result.deletedCount > 0) {
        console.log(`Cleanup: removed ${result.deletedCount} leftover test project(s).`);
      }
    } catch (cleanupError) {
      console.error(
        "Cleanup FAILED — a test project may remain, check manually:",
        cleanupError instanceof Error ? cleanupError.name : "UnknownError"
      );
    }
    process.exit(process.exitCode ?? 0);
  });
