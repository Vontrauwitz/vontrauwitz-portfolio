import "server-only";
import mongoose from "mongoose";
import { env } from "@/lib/env/server";

// Cached-connection-promise pattern (PLAN.md Part IV §5 / Phase 3
// Checkpoint 3.1). Caching on `globalThis` — not a plain module-level
// variable — is deliberate: Next.js Fast Refresh can re-evaluate this
// module during local dev without restarting the Node process, which would
// reset a module-level variable and open a second connection on every
// edit. `globalThis` survives that re-evaluation. In production/Vercel,
// the same cache prevents a "connection storm" — multiple concurrent
// invocations of a warm serverless instance racing to open their own
// connection — by ensuring every caller awaits the same in-flight promise
// instead of each starting its own `mongoose.connect()`.
type MongooseGlobal = typeof globalThis & {
  __mongooseConnectionPromise__?: Promise<typeof mongoose>;
};

const globalForMongoose = globalThis as MongooseGlobal;

export function connectToDatabase(): Promise<typeof mongoose> {
  if (!globalForMongoose.__mongooseConnectionPromise__) {
    globalForMongoose.__mongooseConnectionPromise__ = mongoose.connect(env.MONGODB_URI, {
      // Conservative for Atlas's serverless/shared-tier connection limits —
      // many short-lived Vercel function instances can each hold a pool,
      // so each pool needs to stay small.
      maxPoolSize: 10,
      // Fail within a bounded time instead of hanging indefinitely if the
      // cluster is unreachable — important in a serverless request/response
      // cycle that itself has a timeout.
      serverSelectionTimeoutMS: 10_000,
      // Reject operations immediately while disconnected instead of
      // silently queuing them — surfaces connection problems as errors
      // right away rather than as mysterious hangs.
      bufferCommands: false,
    });
  }

  return globalForMongoose.__mongooseConnectionPromise__;
}
