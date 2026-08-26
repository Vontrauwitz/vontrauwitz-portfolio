import { getCertificates as getCertificatesFromRepository } from '@/features/certificates/services/certificateRepository';

// Checkpoint 3.4: now delegates to certificateRepository (Mongo-backed,
// with a static-data fallback — see that file for the read/fallback
// strategy) instead of directly importing src/data/certConst. Same
// treatment as Projects (Checkpoint 3.3): this function's exported name,
// signature, and return shape are unchanged, so /certificates and its
// generateMetadata (both already `await getCertificates()`) needed zero
// changes.
//
// Still no "use cache"/cacheTag/cacheLife/cacheComponents — same
// rationale as getPublishedProjects.ts: no write path exists yet (no
// admin CRUD until Phase 5), so there's no staleness problem to solve.
export async function getCertificates() {
  return getCertificatesFromRepository();
}
