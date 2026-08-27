const express = require('express');

const router = express.Router();

router.get('/profile', (req, res) => {
  const authorization = req.get('Authorization');
  const [scheme, token] = authorization ? authorization.trim().split(/\s+/) : [];

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  return res.status(200).json({ message: 'Token received. Verification is added in Stage 3.', token_present: true });
});

module.exports = router;
