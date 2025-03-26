// routes/blockchainRoutes.js
const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const { authMiddleware, adminOnly, hospitalOrAdmin } = require('../middleware/auth');
const { blockchainRules } = require('../middleware/validation');

// Connection Management Routes
// ===========================

// Connect to blockchain (admin only)
router.post('/connect', 
  authMiddleware, 
  adminOnly, 
  blockchainRules.connect, 
  blockchainController.connectBlockchain
);

// Get blockchain connection status
router.get('/status', 
  authMiddleware, 
  blockchainController.getStatus
);

// Disconnect from blockchain (admin only)
router.post('/disconnect', 
  authMiddleware, 
  adminOnly, 
  blockchainController.disconnectBlockchain
);

// Transaction Routes
// ===========================

// Get blockchain transactions (admin or hospital)
router.get('/transactions', 
  authMiddleware, 
  hospitalOrAdmin,
  blockchainRules.getTransactions, 
  blockchainController.getTransactions
);

// Get transaction details by hash
router.get('/transactions/:hash', 
  authMiddleware, 
  hospitalOrAdmin,
  blockchainController.getTransactionByHash
);

// Smart Contract Routes
// ===========================

// Deploy a new smart contract (admin only)
router.post('/contracts/deploy', 
  authMiddleware, 
  adminOnly, 
  blockchainController.deploySmartContract
);

// Get all deployed smart contracts
router.get('/contracts', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.getSmartContracts
);

// Get smart contract details by address
router.get('/contracts/:address', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.getSmartContractByAddress
);

// Execute smart contract function (admin or hospital)
router.post('/contracts/:address/execute', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.executeSmartContract
);

// Medical Record Routes
// ===========================

// Store medical record hash on blockchain
router.post('/records', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.storeRecordHash
);

// Verify medical record integrity
router.post('/records/verify', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.verifyRecordIntegrity
);

// Get medical records by patient ID
router.get('/records/patient/:patientId', 
  authMiddleware, 
  hospitalOrAdmin, 
  blockchainController.getPatientRecords
);

// Hospital Credentialing Routes
// ===========================

// Add hospital credentials to blockchain
router.post('/credentials/hospital', 
  authMiddleware, 
  adminOnly, 
  blockchainController.addHospitalCredentials
);

// Verify hospital credentials
router.get('/credentials/hospital/:hospitalId/verify', 
  authMiddleware, 
  blockchainController.verifyHospitalCredentials
);

// Analytics Routes
// ===========================

// Get blockchain usage statistics
router.get('/analytics/usage', 
  authMiddleware, 
  adminOnly, 
  blockchainController.getBlockchainUsageStats
);

// Get transaction volume statistics
router.get('/analytics/volume', 
  authMiddleware, 
  adminOnly, 
  blockchainController.getTransactionVolumeStats
);

module.exports = router;