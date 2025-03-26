// controllers/blockchainController.js
const { db, generateId } = require('../models/database');

// Connection Management Methods
// ===========================

// Connect to blockchain
exports.connectBlockchain = (req, res) => {
  const { walletAddress, networkUrl } = req.body;
  
  if (!walletAddress || !networkUrl) {
    return res.status(400).json({ message: 'Wallet address and network URL are required' });
  }
  
  const id = generateId();
  const now = new Date().toISOString();
  
  // Set status of any existing connections to 'disconnected'
  db.run(
    `UPDATE blockchain_connections 
     SET status = 'disconnected', disconnectedAt = ?, updatedAt = ? 
     WHERE status = 'connected'`,
    [now, now],
    (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error updating existing connections' });
      }
      
      // Create new connection
      db.run(
        `INSERT INTO blockchain_connections 
         (id, walletAddress, networkUrl, networkName, chainId, blockNumber, status, connectedAt, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, 
          walletAddress, 
          networkUrl, 
          'Healthcare Blockchain Network', // Mock data
          '0x539', // Mock data
          1548293, // Mock data
          'connected',
          now,
          now,
          now
        ],
        function(err) {
          if (err) {
            return res.status(500).json({ message: 'Error connecting to blockchain' });
          }
          
          db.get('SELECT * FROM blockchain_connections WHERE id = ?', [id], (err, connection) => {
            if (err) {
              return res.status(500).json({ message: 'Error retrieving connection data' });
            }
            
            res.status(201).json(connection);
          });
        }
      );
    }
  );
};

// Get blockchain connection status
exports.getStatus = (req, res) => {
  db.get(
    'SELECT * FROM blockchain_connections WHERE status = "connected"',
    [],
    (err, connection) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving connection status' });
      }
      
      if (!connection) {
        return res.json({ status: 'disconnected' });
      }
      
      res.json(connection);
    }
  );
};

// Disconnect from blockchain
exports.disconnectBlockchain = (req, res) => {
  const now = new Date().toISOString();
  
  db.run(
    `UPDATE blockchain_connections 
     SET status = 'disconnected', disconnectedAt = ?, updatedAt = ? 
     WHERE status = 'connected'`,
    [now, now],
    function(err) {
      if (err) {
        return res.status(500).json({ message: 'Error disconnecting from blockchain' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'No active blockchain connection found' });
      }
      
      res.json({ message: 'Disconnected from blockchain' });
    }
  );
};

// Transaction Methods
// ===========================

// Get blockchain transactions
exports.getTransactions = (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  // This is mock data - in a real app, you would fetch this from the blockchain
  const mockTransactions = [
    {
      txHash: '0x8a7d953bf8badf7a4b91022ec9eba69b952c3bfb82c1b49011a8a7edc5f9ff7a',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
      value: '0.5 ETH',
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    },
    {
      txHash: '0x27ed85d127b851f0c8b67fe213e4ba37c8a8a42b1b00c0b1e608fca4cb31cfee',
      from: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
      to: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      value: '1.2 ETH',
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    },
    {
      txHash: '0x21ef583daeb7a3dce95a3dabaa0a9a28110c3d8b0ddf9849b35677e59dfa4da3',
      from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      to: '0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2',
      value: '0.8 ETH',
      timestamp: new Date().toISOString(),
      status: 'pending'
    }
  ];
  
  // Generate more mock transactions
  const transactions = [];
  const total = 25; // Mock total count
  
  for (let i = 0; i < Math.min(limit, total - offset); i++) {
    const mockTx = mockTransactions[i % mockTransactions.length];
    transactions.push({
      ...mockTx,
      txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      timestamp: new Date(Date.now() - i * 60000).toISOString() // Each transaction 1 minute apart
    });
  }
  
  res.json({
    transactions,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    }
  });
};

// Get transaction by hash
exports.getTransactionByHash = (req, res) => {
  const { hash } = req.params;
  
  // Mock transaction data
  const transaction = {
    txHash: hash,
    from: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    to: '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4',
    value: '0.5 ETH',
    gasPrice: '20 Gwei',
    gasUsed: '21000',
    blockNumber: 12345678,
    blockHash: '0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b',
    timestamp: new Date().toISOString(),
    status: 'confirmed',
    data: '0x',
    nonce: 42
  };
  
  res.json(transaction);
};

// Smart Contract Methods
// ===========================

// Deploy smart contract
exports.deploySmartContract = (req, res) => {
  const { name, bytecode, abi } = req.body;
  
  // This would deploy a smart contract in a real implementation
  
  // Mock response
  res.status(201).json({
    id: generateId(),
    name,
    address: `0x${Math.random().toString(36).substr(2, 40)}`,
    txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
    createdAt: new Date().toISOString(),
    status: 'deployed',
    createdBy: req.user.id
  });
};

// Get all smart contracts
exports.getSmartContracts = (req, res) => {
  // Mock data
  const contracts = [
    {
      id: generateId(),
      name: 'PatientRecords',
      address: `0x${Math.random().toString(36).substr(2, 40)}`,
      txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      createdAt: new Date().toISOString(),
      status: 'deployed',
      createdBy: 'admin'
    },
    {
      id: generateId(),
      name: 'HospitalCredentialing',
      address: `0x${Math.random().toString(36).substr(2, 40)}`,
      txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      createdAt: new Date().toISOString(),
      status: 'deployed',
      createdBy: 'admin'
    }
  ];
  
  res.json({ contracts });
};

// Get smart contract by address
exports.getSmartContractByAddress = (req, res) => {
  const { address } = req.params;
  
  // Mock data
  const contract = {
    id: generateId(),
    name: 'PatientRecords',
    address,
    txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
    createdAt: new Date().toISOString(),
    status: 'deployed',
    createdBy: 'admin',
    abi: '[{"inputs":[{"internalType":"string","name":"patientId","type":"string"},{"internalType":"string","name":"recordHash","type":"string"}],"name":"addRecord","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"patientId","type":"string"}],"name":"getRecords","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"patientId","type":"string"},{"internalType":"string","name":"recordHash","type":"string"}],"name":"verifyRecord","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]',
    functions: [
      { name: 'addRecord', type: 'write' },
      { name: 'getRecords', type: 'read' },
      { name: 'verifyRecord', type: 'read' }
    ]
  };
  
  res.json(contract);
};

// Execute smart contract function
exports.executeSmartContract = (req, res) => {
  const { address } = req.params;
  const { functionName, params } = req.body;
  
  // Mock execution
  res.json({
    success: true,
    address,
    functionName,
    params,
    result: functionName === 'getRecords' ? ['0x123...', '0x456...'] : true,
    txHash: functionName.startsWith('get') ? null : `0x${Math.random().toString(36).substr(2, 40)}`
  });
};

// Medical Record Methods
// ===========================

// Store medical record hash
exports.storeRecordHash = (req, res) => {
  const { patientId, recordHash, recordType, metadata } = req.body;
  
  // Mock response
  res.status(201).json({
    id: generateId(),
    patientId,
    recordHash,
    recordType,
    metadata,
    timestamp: new Date().toISOString(),
    txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
    storedBy: req.user.id,
    verified: true
  });
};

// Verify record integrity
exports.verifyRecordIntegrity = (req, res) => {
  const { recordHash } = req.body;
  
  // Mock verification
  res.json({
    recordHash,
    exists: true,
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    patientId: `patient-${Math.floor(Math.random() * 1000)}`,
    verified: true
  });
};

// Get patient records
exports.getPatientRecords = (req, res) => {
  const { patientId } = req.params;
  
  // Mock records
  const records = [
    {
      id: generateId(),
      patientId,
      recordHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      recordType: 'Prescription',
      metadata: { doctor: 'Dr. Smith', date: '2023-01-15' },
      timestamp: new Date(Date.now() - 86400000 * 10).toISOString(),
      txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      storedBy: 'hospital-1',
      verified: true
    },
    {
      id: generateId(),
      patientId,
      recordHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      recordType: 'Lab Result',
      metadata: { lab: 'City Medical Lab', test: 'Blood Test' },
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
      txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
      storedBy: 'hospital-2',
      verified: true
    }
  ];
  
  res.json({ records });
};

// Hospital Credentialing Methods
// ===========================

// Add hospital credentials
exports.addHospitalCredentials = (req, res) => {
  const { hospitalId, credentials } = req.body;
  
  // Mock response
  res.status(201).json({
    id: generateId(),
    hospitalId,
    credentials,
    timestamp: new Date().toISOString(),
    txHash: `0x${Math.random().toString(36).substr(2, 40)}`,
    addedBy: req.user.id,
    verified: true
  });
};

// Verify hospital credentials
exports.verifyHospitalCredentials = (req, res) => {
  const { hospitalId } = req.params;
  
  // Mock verification
  res.json({
    hospitalId,
    verified: true,
    timestamp: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
    credentials: {
      name: 'General Hospital',
      licenseNumber: 'LIC-12345',
      validUntil: new Date(Date.now() + 86400000 * 365).toISOString(), // 1 year from now
      accreditations: ['Joint Commission', 'AAHC']
    }
  });
};

// Analytics Methods
// ===========================

// Get blockchain usage stats
exports.getBlockchainUsageStats = (req, res) => {
  // Mock stats
  res.json({
    totalTransactions: 1267,
    recordsStored: 895,
    credentialsVerified: 124,
    smartContractsDeployed: 8,
    activeHospitals: 12,
    averageDailyTransactions: 42,
    storageUsed: '1.2 GB',
    lastUpdated: new Date().toISOString()
  });
};

// Get transaction volume stats
exports.getTransactionVolumeStats = (req, res) => {
  // Mock volume data
  const days = 30;
  const volumes = [];
  
  for (let i = 0; i < days; i++) {
    volumes.push({
      date: new Date(Date.now() - 86400000 * (days - i - 1)).toISOString().split('T')[0],
      transactions: Math.floor(Math.random() * 50) + 20,
      gasUsed: Math.floor(Math.random() * 10000000) + 5000000
    });
  }
  
  res.json({
    volumes,
    totalVolume: volumes.reduce((sum, day) => sum + day.transactions, 0),
    averageDaily: Math.floor(volumes.reduce((sum, day) => sum + day.transactions, 0) / days),
    trend: 'increasing'
  });
};