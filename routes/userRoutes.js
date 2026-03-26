const express = require('express');
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const { validateCreateUser, validateUpdateUser } = require('../middleware/validateUser');

const router = express.Router();

router
  .route('/')
  .get(getUsers)
  .post(validateCreateUser, createUser);

router
  .route('/:id')
  .get(getUser)
  .put(validateUpdateUser, updateUser)
  .delete(deleteUser);

module.exports = router;
