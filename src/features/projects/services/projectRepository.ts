import "server-only";
import { projects as staticProjects } from '@/data/projectConst';
import { connectToDatabase } from '@/lib/db/connection';
import { ProjectModel } from './project.model';
import { projectSchema, type Project } from '../schemas/project.schema';

// Data Access Layer for the Projects domain (PLAN.md Part II §12 / Part III
// Principle 9) — the only file that talks to ProjectModel directly.
// getPublishedProjects.ts (the queries/ layer) just calls getProjects()
// below; it doesn't know or care whether the read came from Mongo or the
// static fallback.
//
// Read strategy: try Mongo first; on any failure (connection, query, or
// shape validation), fall back to the existing static src/data/projectConst
// array so the public site can never go down from a Mongo outage. This is
// deliberately temporary scaffolding — PLAN.md Part IV §5 retires it,
// collection by collection, only once each domain's Mongo data has been
// trusted in production for a deliberate observation window.
//
// Checkpoint 5.1: now filters to `published: true` and sorts by `order`
// ascending — the two fields Checkpoint 5.1's migration script
// (scripts/migrate/backfillProjectAdminFields.ts) backfilled onto every
// existing document before this filter/sort went live, so this never
// silently empties the public page. projectSchema's `.default()`s for
// both fields (see that file) are a second safety net if a document
// somehow still lacks them — `published` defaults `true` (never hides a
// project nobody explicitly unpublished) and `order` defaults `0`.
export async function getProjects(): Promise<Project[]> {
  try {
    await connectToDatabase();
    const docs = await ProjectModel.find({ published: true }).sort({ order: 1 }).lean();

    // .lean() returns plain objects (not Mongoose Documents) — satisfies
    // "return plain serializable Project objects, not Mongoose Documents"
    // structurally, but they still carry Mongo-only fields (_id, __v) and
    // aren't guaranteed at the type level to match the static Project
    // shape. Stripping the Mongo-only fields and re-validating every
    // record through the same Zod schema the seed script uses closes that
    // gap: the returned array is guaranteed byte-for-byte Project-shaped,
    // not just "whatever Mongo happened to store."
    return docs.map((doc) => {
      const { _id, __v, ...rest } = doc;
      void _id;
      void __v;
      return projectSchema.parse(rest);
    });
  } catch (error) {
    // Deliberately not logging error.message — some driver error paths
    // (e.g. DNS resolution failures for a mongodb+srv:// URI) can include
    // connection details in their message. error.name alone (e.g.
    // "MongooseServerSelectionError", "ZodError") is enough to diagnose
    // the failure class without any risk of leaking the URI/credentials.
    console.warn(
      '[projectRepository] Mongo read or validation failed, falling back to static project data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    // Same projectSchema.parse() pass as the Mongo path above — the static
    // array predates imagePublicId/order/published (Checkpoint 5.1) and
    // has no ordering/publish concept of its own, so this applies the same
    // `.default()`s (imagePublicId: null, order: 0, published: true) to
    // every static record, keeping the fallback's output shape identical
    // to the Mongo path's rather than a separately-typed exception.
    return staticProjects.map((project) => projectSchema.parse(project));
  }
}
