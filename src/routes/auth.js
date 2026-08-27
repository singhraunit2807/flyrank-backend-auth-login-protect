const express = require('express');
const { createSupabaseClient } = require('../supabase');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.status(201).json({ user: data.user });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return res.status(401).json({ error: 'Invalid login credentials' });
  }

  return res.status(200).json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
});

router.post('/logout', requireAuth, async (req, res) => {
  try {
    const supabase = createSupabaseClient(req.accessToken);
    const { error } = await supabase.auth.signOut({ scope: 'local' });

    if (error) {
      return res.status(401).json({ error: 'Unable to log out session' });
    }

    return res.status(204).send();
  } catch (_error) {
    return res.status(401).json({ error: 'Unable to log out session' });
  }
});

module.exports = router;
