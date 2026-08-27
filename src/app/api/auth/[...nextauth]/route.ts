import { handlers } from "@/lib/auth/auth";

// Thin catch-all handler per Auth.js's own App Router convention — all
// real configuration lives in src/lib/auth/auth.ts. Nothing else belongs
// in this file.
export const { GET, POST } = handlers;
