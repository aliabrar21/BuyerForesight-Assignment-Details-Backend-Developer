const { z } = require('zod');

// Validation schema for creating a user
const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters string").max(100),
  email: z.string().email("Invalid email address"),
  age: z.number().int().min(0, "Age must be a positive number").max(120)
});

// Validation schema for updating a user (fields are optional)
const updateUserSchema = createUserSchema.partial();

const validateCreateUser = (req, res, next) => {
  try {
    req.body = createUserSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
    });
  }
};

const validateUpdateUser = (req, res, next) => {
  try {
    req.body = updateUserSchema.parse(req.body);
    // Ensure body is not empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: [{ message: 'At least one field must be provided for update' }]
      });
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: error.errors.map(err => ({ field: err.path.join('.'), message: err.message }))
    });
  }
};

module.exports = {
  validateCreateUser,
  validateUpdateUser
};
