import "server-only";

// Centralized, server-only access to backend environment variables — per
// PLAN.md Part III §2's target tree (`lib/env/server.ts`). Fails fast at
// module-load time with a clear message rather than deep inside a query
// call, so a missing var is obvious immediately instead of surfacing as an
// unrelated connection timeout later. The `server-only` import guarantees a
// build-time error if this module is ever pulled into a client bundle.
//
// MONGODB_URI contract: a full Mongo connection string with the target
// database name baked into the URI path (not a separate DB-name var), e.g.
// mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db-name>?retryWrites=true&w=majority
// Set in .env.local for local development (git-ignored, never committed),
// and independently per Vercel environment (Production/Preview/Development)
// in the project's environment variable settings — one Atlas database per
// environment (e.g. portfolio_dev / portfolio_preview / portfolio_prod).


const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Missing MONGODB_URI environment variable. Set it in .env.local for local development, " +
    "and in Vercel's Production/Preview/Development environment variables for deployed environments."
  );
}

export const env = {
  MONGODB_URI,
};
