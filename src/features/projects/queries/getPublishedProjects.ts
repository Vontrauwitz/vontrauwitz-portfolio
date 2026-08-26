import { getProjects } from '@/features/projects/services/projectRepository';

// Checkpoint 3.3: now delegates to the projectRepository (Mongo-backed,
// with a static-data fallback — see that file for the read/fallback
// strategy) instead of directly importing src/data/projectConst. The
// call shape PLAN.md's queries/ layer promised in Phase 2 holds exactly as
// designed: this function's signature and return shape are unchanged, so
// /projects and its generateMetadata (both already `await
// getPublishedProjects()`) needed zero changes.
//
// Deliberately still NOT using "use cache" / cacheTag / cacheLife /
// cacheComponents. PLAN.md Part III §6's correction note (added after
// Phase 2 sign-off) records that cacheComponents was deliberately deferred
// and Phase 3 must not enable it implicitly — there's still no write path
// yet (no admin CRUD until Phase 5) to create a staleness problem worth
// solving, so every request just reads fresh, same as before.
export async function getPublishedProjects() {
  return getProjects();
}
