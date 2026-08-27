require('dotenv').config();

const express = require('express');
const { createSupabaseClient } = require('./supabase');
const authRoutes = require('./routes/auth');
const publicRoutes = require('./routes/public');
const protectedRoutes = require('./routes/protected');
const { setupSwagger } = require('./swagger');

const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    message: 'FlyRank Auth API is running.',
    docs: '/docs',
  });
});

app.get('/health', async (_req, res) => {
  try {
    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.getSession();
    if (error) {
      return res.status(503).json({ status: 'degraded', error: error.message });
    }
    return res.status(200).json({ status: 'ok', supabase: 'connected' });
  } catch (error) {
    return res.status(503).json({ status: 'degraded', error: error.message });
  }
});

app.use('/auth', authRoutes);
app.use('/public', publicRoutes);
app.use('/protected', protectedRoutes);
setupSwagger(app);

module.exports = app;
