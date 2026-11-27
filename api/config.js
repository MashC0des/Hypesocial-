/**
 * Vercel Serverless Function: Exposes public Supabase project configuration
 * from Vercel Environment Variables (SUPABASE_URL & SUPABASE_ANON_KEY).
 * Never expose SUPABASE_SERVICE_ROLE_KEY here.
 */
module.exports = function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  res.status(200).json({
    supabaseUrl: (process.env.SUPABASE_URL || '').trim(),
    supabaseAnonKey: (process.env.SUPABASE_ANON_KEY || '').trim()
  });
};
