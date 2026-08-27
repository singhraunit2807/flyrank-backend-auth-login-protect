const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  const { id, email, created_at } = req.user;
  return res.status(200).json({ id, email, created_at });
});

router.get('/dashboard', requireAuth, (req, res) => {
  return res.status(200).json({
    message: 'Welcome to your protected dashboard.',
    user_id: req.user.id,
    email: req.user.email,
  });
});

router.get('/admin', requireAuth, (req, res) => {
  const role = req.user.app_metadata?.role;

  if (role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.status(200).json({
    message: 'Admin access granted.',
    user_id: req.user.id,
  });
});

module.exports = router;
