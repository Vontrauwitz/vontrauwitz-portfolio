import { z } from 'zod';

// Mirrors src/data/projectConst.ts's current shape exactly — see that
// file's own field-by-field comments for the semantics behind each
// nullable field (titleNote/note/deployUrl are all "present but null",
// never an absent key, so they're modeled as .nullable(), not .optional()).
// No fields added, removed, or renamed; no data normalization. This is
// Checkpoint 3.2's schema/model-architecture step only — nothing here is
// wired into any repository, query, or route yet.
//
// deployUrl/githubUrl use z.url() (Zod v4 top-level format validator) since
// every current value is a real absolute URL. `image` stays a plain
// non-empty string, not z.url() — it's a root-relative public/ path
// ("/images/projects/proy/x.jpg"), not an absolute URL, per that file's
// own comment.
//
// `technologies` is a required array (no `.default([])`): every current
// record already has the key present (as `[]`), so the Zod input contract
// requires it explicitly — an object missing the key fails validation
// rather than silently passing with an assumed empty array.
//
// Checkpoint 5.1 — `imagePublicId`/`order`/`published` added with
// `.default()`, deliberately unlike `technologies` above: this schema is
// also what scripts/seed/seedProjects.ts validates the *static*
// src/data/projectConst.ts array against, and that array predates these
// fields entirely (a real architectural constraint, not carelessness) —
// requiring them here would break that existing seed script. It's also
// what projectRepository.ts's getProjects() re-validates every Mongo
// document through on every public read, so the same default doubles as a
// safety net for any document a future migration might somehow miss. The
// actual source of truth for real values is Mongo (backfilled by this
// checkpoint's migration script) and projectInput.schema.ts (the .strict()
// schema every admin write actually goes through, with no defaults there —
// see that file).
export const projectSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  titleNote: z.string().min(1).nullable(),
  type: z.string().min(1),
  summary: z.string().min(1),
  note: z.string().min(1).nullable(),
  image: z.string().min(1),
  imageWidth: z.number().int().positive(),
  imageHeight: z.number().int().positive(),
  imagePublicId: z.string().min(1).nullable().default(null),
  deployUrl: z.url().nullable(),
  githubUrl: z.url(),
  icon: z.string().min(1),
  technologies: z.array(z.string()),
  featured: z.boolean(),
  order: z.number().int().min(0).default(0),
  published: z.boolean().default(true),
});

export type Project = z.infer<typeof projectSchema>;
