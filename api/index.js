/**
 * Vercel Serverless Function — API handler
 *
 * This file is the entry point for all /api/* requests on Vercel.
 * It imports the compiled Express app from the esbuild bundle (dist/index.js)
 * and exports it as the default handler.
 *
 * Vercel routes:
 *   /api/*  → this file (Express handles /api/trpc and /api/oauth/callback)
 *   /*      → dist/public/index.html (served by Vercel CDN)
 *
 * Build: pnpm build
 *   → vite build          → dist/public/  (frontend static files)
 *   → esbuild bundle      → dist/index.js (Express server bundle)
 */

// Use dynamic require so Vercel resolves the bundle at runtime
// The bundle is at dist/index.js relative to the project root
import handler from '../dist/index.js';

export default handler;
