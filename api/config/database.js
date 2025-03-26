// config/database.js
const path = require('path');
require('dotenv').config();

/**
 * Database configuration settings
 */
module.exports = {
  // SQLite database file path
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../db/healthcare_blockchain.db'),
  
  // Database connection options
  options: {
    // Enable foreign keys support
    foreignKeys: true,
    
    // Set timeout for operations (in milliseconds)
    timeout: 5000,
    
    // Set to true to output SQL queries for debugging
    verbose: process.env.NODE_ENV === 'development',
  },
  
  // Database schema versions for migrations
  schemaVersion: '1.0.0',
  
  // Define table schemas for code consistency
  schemas: {
    users: {
      id: 'TEXT PRIMARY KEY',
      firstName: 'TEXT NOT NULL',
      lastName: 'TEXT NOT NULL',
      email: 'TEXT UNIQUE NOT NULL',
      phone: 'TEXT',
      password: 'TEXT NOT NULL',
      role: 'TEXT NOT NULL',
      hospitalId: 'TEXT',
      isActive: 'INTEGER NOT NULL DEFAULT 1',
      createdAt: 'TEXT NOT NULL',
      updatedAt: 'TEXT NOT NULL',
      foreignKeys: [
        'FOREIGN KEY (hospitalId) REFERENCES hospitals (id)'
      ]
    },
    hospitals: {
      id: 'TEXT PRIMARY KEY',
      name: 'TEXT NOT NULL',
      address: 'TEXT',
      city: 'TEXT',
      state: 'TEXT',
      zipCode: 'TEXT',
      contactPerson: 'TEXT',
      email: 'TEXT UNIQUE NOT NULL',
      phone: 'TEXT',
      isActive: 'INTEGER NOT NULL DEFAULT 1',
      createdAt: 'TEXT NOT NULL',
      updatedAt: 'TEXT NOT NULL'
    },
    blockchain_connections: {
      id: 'TEXT PRIMARY KEY',
      walletAddress: 'TEXT NOT NULL',
      networkUrl: 'TEXT NOT NULL',
      networkName: 'TEXT',
      chainId: 'TEXT',
      blockNumber: 'INTEGER',
      status: 'TEXT NOT NULL',
      connectedAt: 'TEXT NOT NULL',
      disconnectedAt: 'TEXT',
      createdAt: 'TEXT NOT NULL',
      updatedAt: 'TEXT NOT NULL'
    },
    smart_contracts: {
      id: 'TEXT PRIMARY KEY',
      name: 'TEXT NOT NULL',
      address: 'TEXT NOT NULL',
      abi: 'TEXT NOT NULL',
      bytecode: 'TEXT',
      deployedBy: 'TEXT NOT NULL',
      deploymentTxHash: 'TEXT',
      status: 'TEXT NOT NULL',
      createdAt: 'TEXT NOT NULL',
      updatedAt: 'TEXT NOT NULL',
      foreignKeys: [
        'FOREIGN KEY (deployedBy) REFERENCES users (id)'
      ]
    },
    medical_records: {
      id: 'TEXT PRIMARY KEY',
      patientId: 'TEXT NOT NULL',
      recordHash: 'TEXT NOT NULL',
      recordType: 'TEXT NOT NULL',
      metadata: 'TEXT',
      storedBy: 'TEXT NOT NULL',
      txHash: 'TEXT',
      verified: 'INTEGER NOT NULL DEFAULT 0',
      createdAt: 'TEXT NOT NULL',
      updatedAt: 'TEXT NOT NULL',
      foreignKeys: [
        'FOREIGN KEY (patientId) REFERENCES users (id)',
        'FOREIGN KEY (storedBy) REFERENCES users (id)'
      ]
    }
  },
  
  // Default admin user details (for initial setup)
  defaultAdmin: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'password', // This will be hashed before storage
    role: 'admin'
  },
  
  // Helper function to generate CREATE TABLE SQL
  createTableSql: function(tableName) {
    const schema = this.schemas[tableName];
    if (!schema) return null;
    
    let sql = `CREATE TABLE IF NOT EXISTS ${tableName} (\n`;
    
    // Add all columns
    const columns = Object.entries(schema)
      .filter(([key]) => key !== 'foreignKeys')
      .map(([key, value]) => `  ${key} ${value}`)
      .join(',\n');
    
    sql += columns;
    
    // Add foreign keys if any
    if (schema.foreignKeys && schema.foreignKeys.length > 0) {
      sql += ',\n  ' + schema.foreignKeys.join(',\n  ');
    }
    
    sql += '\n)';
    
    return sql;
  }
};