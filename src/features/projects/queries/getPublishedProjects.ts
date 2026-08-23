import { projects } from '@/data/projectConst';

// Introduces the queries/ layer PLAN.md's target architecture calls for
// (Part III §2), so that when Phase 3 swaps this to a Mongo-backed read the
// call shape at every consumer stays identical — only this function's body
// changes.
//
// Deliberately NOT using "use cache" / cacheTag / cacheLife here yet.
// PLAN.md Part III §6 designs Cache Components adoption as a Phase 2
// decision, but enabling `cacheComponents` is a global next.config flag
// that changes rendering semantics for the whole app, not something to
// fold into a single route migration without its own isolated checkpoint
// and test pass. This stays a plain async read of the same static import
// every other still-unmigrated page already uses — async only so the
// call site (`await getPublishedProjects()`) doesn't need to change shape
// when the cached/Mongo-backed version lands later.
export async function getPublishedProjects() {
  return projects;
}
