// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, adminOnly, hospitalOrAdmin } = require('../middleware/auth');
const { userRules } = require('../middleware/validation');

// Create a new user (needs admin or hospital credentials)
router.post('/', 
  authMiddleware, 
  hospitalOrAdmin, 
  userRules.create, 
  userController.createUser
);

// Get all users (with pagination and filters)
router.get('/', 
  authMiddleware, 
  userRules.getAll, 
  userController.getUsers
);

// Get user statistics
router.get('/stats', 
  authMiddleware, 
  adminOnly, 
  userController.getStats
);

// Get a single user by ID
router.get('/:id', 
  authMiddleware, 
  userRules.getById, 
  userController.getUser
);

// Update a user
router.put('/:id', 
  authMiddleware, 
  userRules.update, 
  userController.updateUser
);

// Delete a user
router.delete('/:id', 
  authMiddleware, 
  userRules.delete, 
  userController.deleteUser
);

module.exports = router;