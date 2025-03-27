// controllers/userController.js
const bcrypt = require('bcrypt');
const { db, generateId } = require('../models/database');

// Create a new user
exports.createUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    hospitalId,
    password="password",
    isActive = true
  } = req.body;


  // Basic validation
  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  // Validate role
  const validRoles = ['admin', 'doctor', 'nurse', 'patient', 'staff', 'hospital'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  // Hash password
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = generateId();
    const now = new Date().toISOString();

    // If hospitalId is provided, check if it exists
    if (hospitalId) {
      db.get('SELECT id FROM hospitals WHERE id = ?', [hospitalId], (err, hospital) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (!hospital) {
          return res.status(404).json({ message: 'Hospital not found' });
        }
        
        // Hospital exists, proceed with user creation
        insertUser();
      });
    } else {
      // No hospitalId, proceed with user creation
      insertUser();
    }

    function insertUser() {
      db.run(
        `INSERT INTO users (id, firstName, lastName, email, phone, password, role, hospitalId, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, firstName, lastName, email, phone, hashedPassword, role, hospitalId, isActive ? 1 : 0, now, now],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
              return res.status(409).json({ message: 'A user with this email already exists' });
            }
            return res.status(500).json({ message: 'Error creating user' });
          }

          // Return created user without password
          db.get(
            'SELECT id, firstName, lastName, email, phone, role, hospitalId, isActive, createdAt, updatedAt FROM users WHERE id = ?',
            [id],
            (err, user) => {
              if (err) {
                return res.status(500).json({ message: 'Error retrieving user data' });
              }
              res.status(201).json(user);
            }
          );
        }
      );
    }
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password' });
  }
};

// Get all users with pagination and search
exports.getUsers = (req, res) => {
  const { page = 1, limit = 10, search = '', role, hospitalId, status } = req.query;
  const offset = (page - 1) * limit;
  
  let query = `SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.role, 
               u.hospitalId, u.isActive, u.createdAt, u.updatedAt,
               h.name as hospitalName
               FROM users u
               LEFT JOIN hospitals h ON u.hospitalId = h.id`;
               
  let countQuery = 'SELECT COUNT(*) as total FROM users u';
  let conditions = [];
  let params = [];
  
  // For hospital users, restrict to viewing their own users
  if (req.user && req.user.role === 'hospital') {
    conditions.push('u.hospitalId = ?');
    params.push(req.user.hospitalId);
  }
  
  if (search) {
    conditions.push(`(u.firstName LIKE ? OR u.lastName LIKE ? OR u.email LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (role) {
    conditions.push('u.role = ?');
    params.push(role);
  }
  
  if (hospitalId) {
    conditions.push('u.hospitalId = ?');
    params.push(hospitalId);
  }
  
  if (status === 'active') {
    conditions.push('u.isActive = 1');
  } else if (status === 'inactive') {
    conditions.push('u.isActive = 0');
  }
  
  if (conditions.length > 0) {
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    query += ` ${whereClause}`;
    countQuery += ` ${whereClause}`;
  }
  
  query += ` ORDER BY u.firstName, u.lastName LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);
  
  db.get(countQuery, params.slice(0, params.length - 2), (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error counting users' });
    }
    
    const total = result.total;
    
    db.all(query, params, (err, users) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving users' });
      }
      
      res.json({
        users,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      });
    });
  });
};

// Get user statistics
exports.getStats = (req, res) => {
  // Get total users
  db.get('SELECT COUNT(*) as total FROM users', [], (err, totalResult) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving user statistics' });
    }
    
    // Get active users
    db.get('SELECT COUNT(*) as active FROM users WHERE isActive = 1', [], (err, activeResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving user statistics' });
      }
      
      // Get inactive users
      db.get('SELECT COUNT(*) as inactive FROM users WHERE isActive = 0', [], (err, inactiveResult) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving user statistics' });
        }
        
        // Get users by role
        db.all('SELECT role, COUNT(*) as count FROM users GROUP BY role', [], (err, roleResults) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving user statistics' });
          }
          
          // Transform role results into an object
          const byRole = {};
          roleResults.forEach(item => {
            byRole[item.role] = item.count;
          });
          
          res.json({
            total: totalResult.total,
            active: activeResult.active,
            inactive: inactiveResult.inactive,
            byRole
          });
        });
      });
    });
  });
};

// Get a single user
exports.getUser = (req, res) => {
  const query = `
    SELECT u.id, u.firstName, u.lastName, u.email, u.phone, u.role, 
    u.hospitalId, u.isActive, u.createdAt, u.updatedAt,
    h.name as hospitalName
    FROM users u
    LEFT JOIN hospitals h ON u.hospitalId = h.id
    WHERE u.id = ?
  `;
  
  db.get(query, [req.params.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving user' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check permissions - users can only see themselves, hospitals their users, admins everyone
    if (req.user.role !== 'admin') {
      if (req.user.role === 'hospital' && user.hospitalId !== req.user.hospitalId) {
        return res.status(403).json({ message: 'Unauthorized access to user data' });
      } else if (req.user.id !== user.id) {
        return res.status(403).json({ message: 'Unauthorized access to user data' });
      }
    }
    
    res.json(user);
  });
};

// Update a user
exports.updateUser = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    role,
    hospitalId,
    password,
    isActive
  } = req.body;
  
  // First check if user exists
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check permissions - users can only update themselves, hospitals their users, admins everyone
    if (req.user.role !== 'admin') {
      if (req.user.role === 'hospital' && user.hospitalId !== req.user.hospitalId) {
        return res.status(403).json({ message: 'Unauthorized to update this user' });
      } else if (req.user.id !== user.id) {
        return res.status(403).json({ message: 'Unauthorized to update this user' });
      }
    }
    
    // Non-admins can't change roles or activation status
    if (req.user.role !== 'admin' && (role !== undefined || isActive !== undefined)) {
      return res.status(403).json({ message: 'Unauthorized to update role or activation status' });
    }
    
    // Build update query
    let updates = [];
    let params = [];
    
    if (firstName !== undefined) {
      updates.push('firstName = ?');
      params.push(firstName);
    }
    
    if (lastName !== undefined) {
      updates.push('lastName = ?');
      params.push(lastName);
    }
    
    if (email !== undefined) {
      updates.push('email = ?');
      params.push(email);
    }
    
    if (phone !== undefined) {
      updates.push('phone = ?');
      params.push(phone);
    }
    
    if (role !== undefined) {
      updates.push('role = ?');
      params.push(role);
    }
    
    if (hospitalId !== undefined) {
      // If setting a hospitalId, check if it exists
      if (hospitalId) {
        try {
          const hospitalExists = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM hospitals WHERE id = ?', [hospitalId], (err, hospital) => {
              if (err) reject(err);
              resolve(!!hospital);
            });
          });
          
          if (!hospitalExists) {
            return res.status(404).json({ message: 'Hospital not found' });
          }
        } catch (error) {
          return res.status(500).json({ message: 'Error checking hospital existence' });
        }
      }
      
      updates.push('hospitalId = ?');
      params.push(hospitalId);
    }
    
    if (password !== undefined) {
      try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.push('password = ?');
        params.push(hashedPassword);
      } catch (error) {
        return res.status(500).json({ message: 'Error hashing password' });
      }
    }
    
    if (isActive !== undefined) {
      updates.push('isActive = ?');
      params.push(isActive ? 1 : 0);
    }
    
    const now = new Date().toISOString();
    updates.push('updatedAt = ?');
    params.push(now);
    
    // Add user id as the last parameter
    params.push(req.params.id);
    
    if (updates.length === 1) {
      // Only updatedAt field was added, no real updates
      return res.status(400).json({ message: 'No update data provided' });
    }
    
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(query, params, function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ message: 'A user with this email already exists' });
        }
        return res.status(500).json({ message: 'Error updating user' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Fetch the updated user record without password
      db.get(
        `SELECT id, firstName, lastName, email, phone, role, hospitalId, isActive, createdAt, updatedAt 
         FROM users WHERE id = ?`, 
        [req.params.id], 
        (err, updatedUser) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving updated user data' });
          }
          res.json(updatedUser);
        }
      );
    });
  });
};

// Delete a user
exports.deleteUser = (req, res) => {
  // First check if user exists
  db.get('SELECT * FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check permissions - hospitals can only delete their users, admins everyone
    if (req.user.role !== 'admin') {
      if (req.user.role === 'hospital' && user.hospitalId !== req.user.hospitalId) {
        return res.status(403).json({ message: 'Unauthorized to delete this user' });
      } else {
        return res.status(403).json({ message: 'Unauthorized to delete users' });
      }
    }
    
    // Prevent deleting the last admin
    if (user.role === 'admin') {
      db.get('SELECT COUNT(*) as count FROM users WHERE role = "admin"', [], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error' });
        }
        
        if (result.count <= 1) {
          return res.status(409).json({ message: 'Cannot delete the last admin user' });
        }
        
        // Safe to delete, proceed
        proceedWithDeletion();
      });
    } else {
      // Non-admin user, proceed with deletion
      proceedWithDeletion();
    }
    
    function proceedWithDeletion() {
      db.run('DELETE FROM users WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error deleting user' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully' });
      });
    }
  });
};

// Alternative to permanent deletion: mark as