const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Use an absolute path for maximum reliability
const dbPath = path.resolve(__dirname, '../db/healthcare_blockchain.db');
console.log('Using database path:', dbPath);

// Connect to SQLite database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initDatabase();
  }
});

// Rest of your code...

// Initialize database tables
function initDatabase() {
  db.serialize(() => {
    // Create Users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        hospitalId TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (hospitalId) REFERENCES hospitals (id)
      )
    `);

    // Create Hospitals table
    db.run(`
      CREATE TABLE IF NOT EXISTS hospitals (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT,
        city TEXT,
        state TEXT,
        zipCode TEXT,
        contactPerson TEXT,
        email TEXT UNIQUE NOT NULL,
        phone TEXT,
        isActive INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create BlockchainConnections table
    db.run(`
      CREATE TABLE IF NOT EXISTS blockchain_connections (
        id TEXT PRIMARY KEY,
        walletAddress TEXT NOT NULL,
        networkUrl TEXT NOT NULL,
        networkName TEXT,
        chainId TEXT,
        blockNumber INTEGER,
        status TEXT NOT NULL,
        connectedAt TEXT NOT NULL,
        disconnectedAt TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Insert default admin user if not exists
    db.get("SELECT * FROM users WHERE email = 'admin@example.com'", (err, row) => {
      if (err) {
        console.error('Error checking for admin user:', err.message);
      } else if (!row) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync('password', salt);
        const now = new Date().toISOString();
        
        db.run(
          `INSERT INTO users (id, firstName, lastName, email, password, role, isActive, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            generateId(),
            'Admin',
            'User',
            'admin@example.com',
            hash,
            'admin',
            1,
            now,
            now
          ],
          function(err) {
            if (err) {
              console.error('Error creating admin user:', err.message);
            } else {
              console.log('Default admin user created');
            }
          }
        );
      }
    });
  });
}

// Helper function to generate UUIDs
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

module.exports = {
  db,
  generateId
};