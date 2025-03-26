// controllers/hospitalController.js
const { db, generateId } = require('../models/database');

// Create a new hospital
exports.createHospital = (req, res) => {
  const {
    name,
    address,
    city,
    state,
    zipCode,
    contactPerson,
    email,
    phone,
    isActive = true
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const id = generateId();
  const now = new Date().toISOString();

  db.run(
    `INSERT INTO hospitals (id, name, address, city, state, zipCode, contactPerson, email, phone, isActive, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, name, address, city, state, zipCode, contactPerson, email, phone, isActive ? 1 : 0, now, now],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ message: 'A hospital with this email already exists' });
        }
        return res.status(500).json({ message: 'Error creating hospital' });
      }

      db.get('SELECT * FROM hospitals WHERE id = ?', [id], (err, hospital) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving hospital data' });
        }
        res.status(201).json(hospital);
      });
    }
  );
};

// Get all hospitals with pagination and search
exports.getHospitals = (req, res) => {
  const { page = 1, limit = 10, search = '', status } = req.query;
  const offset = (page - 1) * limit;
  
  let query = 'SELECT * FROM hospitals';
  let countQuery = 'SELECT COUNT(*) as total FROM hospitals';
  let conditions = [];
  let params = [];
  
  if (search) {
    conditions.push(`(name LIKE ? OR email LIKE ? OR contactPerson LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  
  if (status === 'active') {
    conditions.push('isActive = 1');
  } else if (status === 'inactive') {
    conditions.push('isActive = 0');
  }
  
  if (conditions.length > 0) {
    const whereClause = `WHERE ${conditions.join(' AND ')}`;
    query += ` ${whereClause}`;
    countQuery += ` ${whereClause}`;
  }
  
  query += ` ORDER BY name LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);
  
  db.get(countQuery, params.slice(0, params.length - 2), (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error counting hospitals' });
    }
    
    const total = result.total;
    
    db.all(query, params, (err, hospitals) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving hospitals' });
      }
      
      res.json({
        hospitals,
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

// Get statistics
exports.getStats = (req, res) => {
  db.get('SELECT COUNT(*) as total FROM hospitals', [], (err, totalResult) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving hospital statistics' });
    }
    
    db.get('SELECT COUNT(*) as active FROM hospitals WHERE isActive = 1', [], (err, activeResult) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving hospital statistics' });
      }
      
      db.get('SELECT COUNT(*) as inactive FROM hospitals WHERE isActive = 0', [], (err, inactiveResult) => {
        if (err) {
          return res.status(500).json({ message: 'Error retrieving hospital statistics' });
        }
        
        res.json({
          total: totalResult.total,
          active: activeResult.active,
          inactive: inactiveResult.inactive
        });
      });
    });
  });
};

// Get a single hospital
exports.getHospital = (req, res) => {
  db.get('SELECT * FROM hospitals WHERE id = ?', [req.params.id], (err, hospital) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving hospital' });
    }
    
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }
    
    res.json(hospital);
  });
};

// controllers/hospitalController.js (continued)

// Update a hospital
exports.updateHospital = (req, res) => {
    const {
      name,
      address,
      city,
      state,
      zipCode,
      contactPerson,
      email,
      phone,
      isActive
    } = req.body;
    
    const now = new Date().toISOString();
    
    // First check if hospital exists
    db.get('SELECT * FROM hospitals WHERE id = ?', [req.params.id], (err, hospital) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (!hospital) {
        return res.status(404).json({ message: 'Hospital not found' });
      }
      
      // Build update query
      let updates = [];
      let params = [];
      
      if (name !== undefined) {
        updates.push('name = ?');
        params.push(name);
      }
      
      if (address !== undefined) {
        updates.push('address = ?');
        params.push(address);
      }
      
      if (city !== undefined) {
        updates.push('city = ?');
        params.push(city);
      }
      
      if (state !== undefined) {
        updates.push('state = ?');
        params.push(state);
      }
      
      if (zipCode !== undefined) {
        updates.push('zipCode = ?');
        params.push(zipCode);
      }
      
      if (contactPerson !== undefined) {
        updates.push('contactPerson = ?');
        params.push(contactPerson);
      }
      
      if (email !== undefined) {
        updates.push('email = ?');
        params.push(email);
      }
      
      if (phone !== undefined) {
        updates.push('phone = ?');
        params.push(phone);
      }
      
      if (isActive !== undefined) {
        updates.push('isActive = ?');
        params.push(isActive ? 1 : 0);
      }
      
      updates.push('updatedAt = ?');
      params.push(now);
      
      // Add hospital id as the last parameter
      params.push(req.params.id);
      
      if (updates.length === 1) {
        // Only updatedAt field was added, no real updates
        return res.status(400).json({ message: 'No update data provided' });
      }
      
      const query = `UPDATE hospitals SET ${updates.join(', ')} WHERE id = ?`;
      
      db.run(query, params, function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'A hospital with this email already exists' });
          }
          return res.status(500).json({ message: 'Error updating hospital' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Hospital not found' });
        }
        
        // Fetch the updated hospital record
        db.get('SELECT * FROM hospitals WHERE id = ?', [req.params.id], (err, updatedHospital) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving updated hospital data' });
          }
          res.json(updatedHospital);
        });
      });
    });
  };
  
  // Delete a hospital
  exports.deleteHospital = (req, res) => {
    // Check for associated users first
    db.get('SELECT COUNT(*) as count FROM users WHERE hospitalId = ?', [req.params.id], (err, result) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      
      if (result.count > 0) {
        return res.status(409).json({ 
          message: 'Cannot delete hospital with associated users',
          count: result.count
        });
      }
      
      // Proceed with deletion if no associated users
      db.run('DELETE FROM hospitals WHERE id = ?', [req.params.id], function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error deleting hospital' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Hospital not found' });
        }
        
        res.json({ message: 'Hospital deleted successfully' });
      });
    });
  };
  
  // Alternative to permanent deletion: mark as inactive
  exports.setHospitalStatus = (req, res) => {
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      return res.status(400).json({ message: 'isActive field is required' });
    }
    
    const now = new Date().toISOString();
    
    db.run(
      'UPDATE hospitals SET isActive = ?, updatedAt = ? WHERE id = ?',
      [isActive ? 1 : 0, now, req.params.id],
      function(err) {
        if (err) {
          return res.status(500).json({ message: 'Error updating hospital status' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ message: 'Hospital not found' });
        }
        
        res.json({ 
          message: `Hospital ${isActive ? 'activated' : 'deactivated'} successfully`,
          id: req.params.id,
          isActive: isActive
        });
      }
    );
  };