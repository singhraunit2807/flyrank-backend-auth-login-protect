const express = require('express');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/profile', requireAuth, (req, res) => {
  const { id, email, created_at } = req.user;

  return res.status(200).json({
    id,
    email,
    created_at,
  });
});

module.exports = router;
