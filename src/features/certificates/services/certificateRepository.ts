import "server-only";
import { certificates as staticCertificates } from '@/data/certConst';
import { connectToDatabase } from '@/lib/db/connection';
import { CertificateModel } from './certificate.model';
import { certificateSchema, type Certificate } from '../schemas/certificate.schema';

// Data Access Layer for the Certificates domain — same shape as
// projectRepository.ts (Checkpoint 3.3). getCertificates.ts (the queries/
// layer) just calls getCertificates() below; it doesn't know or care
// whether the read came from Mongo or the static fallback.
//
// Read strategy: try Mongo first; on any failure (connection, query, or
// shape validation), fall back to the existing static
// src/data/certConst.ts array so the public site can never go down from a
// Mongo outage. Same temporary-scaffolding status as Projects' fallback —
// see PLAN.md Part IV §5's retirement protocol.
export async function getCertificates(): Promise<Certificate[]> {
  try {
    await connectToDatabase();
    const docs = await CertificateModel.find({}).lean();

    // .lean() returns plain objects, not Mongoose Documents, but they
    // still carry Mongo-only fields (_id, __v). Stripping those and
    // re-validating every record through the same Zod schema the seed
    // script uses guarantees the returned array is byte-for-byte
    // Certificate-shaped, not just "whatever Mongo happened to store."
    return docs.map((doc) => {
      const { _id, __v, ...rest } = doc;
      void _id;
      void __v;
      return certificateSchema.parse(rest);
    });
  } catch (error) {
    // error.name only, never error.message — some driver error paths can
    // include connection details in their message.
    console.warn(
      '[certificateRepository] Mongo read or validation failed, falling back to static certificate data. Reason:',
      error instanceof Error ? error.name : 'UnknownError'
    );
    // certConst.ts has no `as const`, so its inferred `category` type is
    // the widened `string`, not the stricter enum literal union
    // certificateSchema requires — re-validating through the same schema
    // (rather than a type assertion) narrows it correctly and doubles as
    // a real guarantee the fallback data is itself spec-conformant.
    return staticCertificates.map((certificate) => certificateSchema.parse(certificate));
  }
}
