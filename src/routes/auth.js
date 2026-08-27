const express = require('express');
const { rateLimit } = require('express-rate-limit');
const { createSupabaseClient } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (_req, res) => res.status(429).json({ error: 'Too many failed login attempts. Try again later.' }),
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });

  return res.status(201).json({ user: data.user });
});

router.post('/login', loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session) return res.status(401).json({ error: 'Invalid login credentials' });

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body || {};
  if (!refresh_token) return res.status(400).json({ error: 'Refresh token is required' });

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });
  if (error || !data.session) return res.status(401).json({ error: 'Invalid or expired refresh token' });

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    // Server-side sign-out accepts the verified user's JWT and revokes the session refresh token.
    // It does not require the service_role key for this user-session operation.
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.admin.signOut(req.accessToken, 'local');

    if (error) return res.status(401).json({ error: 'Unable to log out session' });
    return res.status(204).send();
  } catch (_error) {
    return res.status(401).json({ error: 'Unable to log out session' });
  }
});

module.exports = router;
