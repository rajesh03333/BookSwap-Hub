const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authController = require('../controllers/auth');
const authMiddleware = require('../middleware/authMiddleware');

// Traditional OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

// Google Identity Services endpoint
router.post('/google', authController.googleAuth);

// User registration and login
router.post('/register', authController.register);
router.post('/login', authController.login);

// Get current user
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;