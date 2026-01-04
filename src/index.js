/**
 * Cloudflare Worker - ALZENT Digital
 * Minimal worker to serve static site and add security headers
 * 
 * Note: This worker works best when combined with Cloudflare Pages
 * For pure static hosting, consider using Cloudflare Pages instead
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Security headers
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self';"
    };

    // Minimal worker - just ensures build succeeds
    // In production, integrate with Cloudflare Pages for static file serving
    // This worker can be extended to add custom logic, API routes, etc.
    // 
    // Note: For serving static files directly from Worker, you would need:
    // - Cloudflare Assets (requires paid plan), or
    // - Fetch from CDN/storage, or
    // - Use Cloudflare Pages integration (recommended)
    return new Response('ALZENT Digital - Worker is running', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        ...securityHeaders
      }
    });
  }
};

