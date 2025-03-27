// middleware/auth.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

 

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = decoded;
   

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

function hospitalOrAdmin(req, res, next) {
  if (req.user.role !== 'admin' && req.user.role !== 'hospital') {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }
  next();
}

module.exports = {
  authMiddleware,
  adminOnly,
  hospitalOrAdmin
};