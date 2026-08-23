import { certificates } from '@/data/certConst';

// Same treatment as features/projects/queries/getPublishedProjects.ts
// (Checkpoint 2.5): introduces the queries/ layer's call shape now so a
// later Mongo-backed swap only changes this function's body, but stays a
// plain async read — no "use cache"/cacheTag/cacheLife/cacheComponents.
// That's still deliberately out of scope until it gets its own isolated
// checkpoint (see the Checkpoint 2.5 report for the full rationale).
export async function getCertificates() {
  return certificates;
}
