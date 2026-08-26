import { z } from 'zod';

// Mirrors src/data/certConst.ts's current shape exactly. Unlike Projects
// (Checkpoint 3.2), there are no nullable fields here — every one of the
// 20 current records has every field present with a real, non-empty
// value; none are ever null. No `.nullable()` calls anywhere, truthfully
// matching that.
//
// `category` is a strict enum, not a plain string — a deliberate
// departure from Projects' `icon` field (which stayed z.string() because
// it references a large, open-ended, shared 44-key icon registry, per
// Checkpoint 3.2). `category` is different: it's the small, closed set
// CertificateGallery.tsx's own CATEGORY_BY_BUTTON mapping is structurally
// built around (exactly 4 tabs), and every one of the 20 current records
// uses one of exactly these 4 values, verified with 100% coverage — the
// enum describes the data's real invariant rather than inventing one.
//
// `credentialUrl` uses z.url() — verified every one of the 20 current
// values is a real absolute https:// URL, no exceptions. `issued` stays a
// plain non-empty string, not a date type: current values are
// inconsistently formatted free text ("jan 2023", "Aug 2022"), so parsing
// it as a real date would invent a stricter shape the data doesn't
// actually have. `image` stays a plain non-empty string (root-relative
// public/ path), matching Projects' `image` field treatment.
export const certificateSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.enum(['fullstack', 'frontend', 'backend', 'misc']),
  school: z.string().min(1),
  credentialUrl: z.url(),
  issued: z.string().min(1),
  image: z.string().min(1),
});

export type Certificate = z.infer<typeof certificateSchema>;
