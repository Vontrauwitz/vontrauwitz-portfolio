import { z } from "zod";

// Checkpoint 5.2 — the .strict() schema every admin Certificate write
// (create and update) actually validates against, mirroring
// projectInput.schema.ts (Checkpoint 5.1, hardened in the 5.1 follow-up
// pass) exactly: unrecognized keys rejected outright, no defaults (every
// field must be explicitly supplied), and PATCH additionally rejects an
// empty `{}` body from day one — the 5.1 checkpoint found and fixed that
// gap after the fact; this domain doesn't repeat it.
//
// Deliberately excludes: _id, createdAt, updatedAt, imageWidth,
// imageHeight. Mongo/Mongoose owns the first three; the last two don't
// exist anywhere in this domain (CertificateGallery.tsx renders every
// image at a fixed 500x300 box — see certificate.model.ts's own comment).
export const certificateInputSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .max(120)
      .regex(
        /^[a-z0-9]+(-[a-z0-9]+)*$/,
        "slug must be lowercase alphanumeric words separated by single hyphens"
      ),
    title: z.string().min(1).max(200),
    category: z.enum(["fullstack", "frontend", "backend", "misc"]),
    school: z.string().min(1).max(200),
    credentialUrl: z.url(),
    issued: z.string().min(1).max(50),
    // `image`/`imagePublicId` together are the normalized Cloudinary
    // upload result (src/lib/cloudinary/uploadImage.ts, purpose
    // CERTIFICATE_IMAGE) once an admin replaces the image, or the
    // untouched legacy /public path + null publicId for a certificate not
    // yet re-uploaded. Never trust a client-supplied `imagePublicId` as
    // authorization for anything — stored purely for a later,
    // not-yet-built asset-management feature to read back server-side.
    image: z.string().min(1),
    imagePublicId: z.string().min(1).nullable(),
    order: z.number().int().min(0).max(9999),
    published: z.boolean(),
  })
  .strict();

export type CertificateInput = z.infer<typeof certificateInputSchema>;

// PATCH — every field optional, but still .strict(), and still rejects an
// empty `{}` body: a client sending no fields to change is almost always a
// caller bug, not a legitimate no-op request.
export const certificateUpdateSchema = certificateInputSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided.",
  });

export type CertificateUpdateInput = z.infer<typeof certificateUpdateSchema>;
