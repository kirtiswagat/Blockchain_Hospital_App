// routes/hospitalRoutes.js
const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { hospitalRules } = require('../middleware/validation');

// Create a new hospital (admin only)
router.post('/', 
  authMiddleware, 
  adminOnly, 
  hospitalRules.create, 
  hospitalController.createHospital
);

// Get all hospitals (with pagination and filters)
router.get('/', 
  authMiddleware, 
  hospitalRules.getAll, 
  hospitalController.getHospitals
);

// Get hospital statistics
router.get('/stats', 
  authMiddleware, 
  adminOnly,
  hospitalController.getStats
);

// Get a single hospital by ID
router.get('/:id', 
  authMiddleware, 
  hospitalRules.getById, 
  hospitalController.getHospital
);

// Update a hospital
router.put('/:id', 
  authMiddleware, 
  adminOnly, 
  hospitalRules.update, 
  hospitalController.updateHospital
);

// Delete a hospital
router.delete('/:id', 
  authMiddleware, 
  adminOnly, 
  hospitalRules.delete, 
  hospitalController.deleteHospital
);

// Set hospital active/inactive status
router.patch('/:id/status', 
  authMiddleware, 
  adminOnly, 
  hospitalController.setHospitalStatus
);

module.exports = router;