// middleware/validation.js
const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: 'Validation error', 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Hospital validation rules
const hospitalRules = {
  create: [
    body('name')
      .trim()
      .notEmpty().withMessage('Hospital name is required')
      .isLength({ max: 100 }).withMessage('Hospital name cannot exceed 100 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Invalid phone number format'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters'),
    body('city')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters'),
    body('state')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('State cannot exceed 100 characters'),
    body('zipCode')
      .optional()
      .trim(),
    body('contactPerson')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Contact person cannot exceed 100 characters'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean value'),
    validateRequest
  ],
  update: [
    param('id')
      .isString().withMessage('Invalid hospital ID'),
    body('name')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Hospital name cannot exceed 100 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Invalid phone number format'),
    body('address')
      .optional()
      .trim()
      .isLength({ max: 255 }).withMessage('Address cannot exceed 255 characters'),
    body('city')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters'),
    body('state')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('State cannot exceed 100 characters'),
    body('zipCode')
      .optional()
      .trim()
      .matches(/^[0-9]{5}(-[0-9]{4})?$/).withMessage('Invalid ZIP code format'),
    body('contactPerson')
      .optional()
      .trim()
      .isLength({ max: 100 }).withMessage('Contact person cannot exceed 100 characters'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean value'),
    validateRequest
  ],
  getById: [
    param('id')
      .isString().withMessage('Invalid hospital ID'),
    validateRequest
  ],
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('search')
      .optional()
      .trim(),
    query('status')
      .optional()
      .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    validateRequest
  ],
  delete: [
    param('id')
      .isString().withMessage('Invalid hospital ID'),
    validateRequest
  ]
};

// User validation rules
const userRules = {
  create: [
    body('firstName')
      .trim()
      .notEmpty().withMessage('First name is required')
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .trim()
      .notEmpty().withMessage('Last name is required')
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Invalid phone number format'),
    body('role')
      .notEmpty().withMessage('Role is required')
      .isIn(['admin', 'doctor', 'nurse', 'patient', 'staff', 'hospital']).withMessage('Invalid role'),
    body('hospitalId')
      .optional()
      .isString().withMessage('Invalid hospital ID'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean value'),
    validateRequest
  ],
  update: [
    param('id')
      .isString().withMessage('Invalid user ID'),
    body('firstName')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters'),
    body('email')
      .optional()
      .trim()
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('phone')
      .optional()
      .trim()
      .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/).withMessage('Invalid phone number format'),
    body('role')
      .optional()
      .isIn(['admin', 'doctor', 'nurse', 'patient', 'staff', 'hospital']).withMessage('Invalid role'),
    body('hospitalId')
      .optional()
      .isString().withMessage('Invalid hospital ID'),
    body('password')
      .optional()
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('isActive')
      .optional()
      .isBoolean().withMessage('isActive must be a boolean value'),
    validateRequest
  ],
  getById: [
    param('id')
      .isString().withMessage('Invalid user ID'),
    validateRequest
  ],
  getAll: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    query('search')
      .optional()
      .trim(),
    query('role')
      .optional()
      .isIn(['admin', 'doctor', 'nurse', 'patient', 'staff', 'hospital']).withMessage('Invalid role'),
    query('hospitalId')
      .optional()
      .isString().withMessage('Invalid hospital ID'),
    query('status')
      .optional()
      .isIn(['active', 'inactive']).withMessage('Status must be active or inactive'),
    validateRequest
  ],
  delete: [
    param('id')
      .isString().withMessage('Invalid user ID'),
    validateRequest
  ]
};

// Authentication validation rules
const authRules = {
  login: [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Invalid email format')
      .normalizeEmail(),
    body('password')
      .notEmpty().withMessage('Password is required'),
    body('role')
      .isIn(['admin', 'hospital', 'user']).withMessage('Invalid role'),
    validateRequest
  ]
};

// Blockchain validation rules
const blockchainRules = {
  connect: [
    body('walletAddress')
      .trim()
      .notEmpty().withMessage('Wallet address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid wallet address format'),
    body('networkUrl')
      .trim()
      .notEmpty().withMessage('Network URL is required')
      .isURL().withMessage('Invalid network URL'),
    validateRequest
  ],
  getTransactions: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer')
      .toInt(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
      .toInt(),
    validateRequest
  ]
};

module.exports = {
  validateRequest,
  hospitalRules,
  userRules,
  authRules,
  blockchainRules
};