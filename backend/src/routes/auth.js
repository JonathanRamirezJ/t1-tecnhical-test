const express = require('express');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../middleware/validation');

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);

// Rutas protegidas (requieren autenticación)
router.use(auth); // Middleware aplicado a todas las rutas siguientes

router.post('/logout', logout);
router.get('/me', getMe);
router.patch('/profile', updateProfile);
router.patch('/change-password', changePassword);

module.exports = router;
