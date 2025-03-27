const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../models/database');

// Login handler
exports.login = (req, res) => {
  let { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  // Define allowed roles for 'user'
  const userRoles = ['user', 'patient', 'staff', 'anything_else'];

  let query = `SELECT * FROM users WHERE email = ?`;
  let params = [email];

  // Apply role condition dynamically
  if (role) {
    if (role === 'user') {
      query += ` AND role IN (${userRoles.map(() => '?').join(', ')})`;
      params.push(...userRoles);
    } else if (role !== 'hospital' && role !== 'admin') {
      query += ` AND role = ?`;
      params.push(role);
    }
  }

  db.get(query, params, (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is inactive' });
    }
    
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).json({ message: 'Authentication error' });
      }
      
      if (!match) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      
      console.log(token);
      
      // Remove password before sending user data
      const { password, ...userWithoutPassword } = user;
      
      res.json({
        token,
        user: userWithoutPassword
      });
    });
  });
};

// Logout handler (just for API consistency, JWT handling happens client-side)
exports.logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};
