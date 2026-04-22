/**
 * esbuild bundling config for Lambda@Edge.
 *
 * TODO:
 * - Use esbuild to bundle src/handler.ts into a single file
 * - Externalize 'sharp' (it's provided via a Lambda layer as a native binary)
 * - Target: node18 (Lambda@Edge runtime)
 * - Minify: true (smaller bundle = faster cold start)
 * - Tree-shake unused code
 * - Output to dist/handler.js
 *
 * Example:
 * require('esbuild').buildSync({
 *   entryPoints: ['src/handler.ts'],
 *   bundle: true,
 *   minify: true,
 *   platform: 'node',
 *   target: 'node18',
 *   external: ['sharp'],
 *   outfile: 'dist/handler.js',
 * });
 */
console.log('TODO: Implement esbuild bundling — see comments above');
