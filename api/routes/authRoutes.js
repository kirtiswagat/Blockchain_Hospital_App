// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');
const { authRules } = require('../middleware/validation');

// Login route
router.post('/login', 
  authRules.login, 
  authController.login
);

// Logout route (token invalidation happens client-side with JWT, 
// but we include this for API consistency)
router.post('/logout', 
  authMiddleware, 
  authController.logout
);

// Verify token route (useful for checking if token is still valid)
router.get('/verify', 
  authMiddleware, 
  (req, res) => {
    res.json({ 
      valid: true, 
      user: { 
        id: req.user.id, 
        email: req.user.email, 
        role: req.user.role 
      } 
    });
  }
);

module.exports = router;