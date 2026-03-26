const UserModel = require('../models/userModel');

// @desc    Get all users (with optional filtering, sorting, pagination)
// @route   GET /users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const result = await UserModel.findAll(req.query);
    
    res.status(200).json({
      success: true,
      count: result.data.length,
      pagination: result.pagination,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /users/:id
// @access  Public
const getUser = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new user
// @route   POST /users
// @access  Public
const createUser = async (req, res, next) => {
  try {
    const { name, email, age } = req.body;

    // Check if email already exists
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already exists'
      });
    }

    const newUser = await UserModel.create({ name, email, age });

    res.status(201).json({
      success: true,
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /users/:id
// @access  Public
const updateUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    // If updating email, check if new email already exists and belongs to someone else
    if (email) {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser && existingUser.id !== req.params.id) {
        return res.status(400).json({
          success: false,
          error: 'Email already registered to another user'
        });
      }
    }

    const updatedUser = await UserModel.update(req.params.id, req.body);

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Public
const deleteUser = async (req, res, next) => {
  try {
    const isDeleted = await UserModel.delete(req.params.id);

    if (!isDeleted) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
};
