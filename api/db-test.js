const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Try different paths to see which works
const paths = [
  './db/test.db',
  path.resolve(__dirname, 'db/test.db'),
  path.resolve(__dirname, './db/test.db'),
  ':memory:'  // In-memory database as a last resort
];

paths.forEach((dbPath, index) => {
  console.log(`Trying path ${index + 1}: ${dbPath}`);
  
  const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error(`Path ${index + 1} failed:`, err.message);
    } else {
      console.log(`Path ${index + 1} succeeded!`);
      db.close();
    }
  });
});