const User = require('../models/User');
const { AppError } = require('../utils/appError');
const { createSendToken } = require('../utils/jwt');
const logger = require('../utils/logger');

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Ya existe un usuario con este email', 400));
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name,
    });

    logger.info(`Nuevo usuario registrado: ${email}`, { userId: user._id });

    createSendToken(user, 201, res, 'Usuario registrado exitosamente');
  } catch (error) {
    logger.error('Error en registro de usuario:', {
      error: error.message,
      email: req.body.email,
    });
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Email o contraseña incorrectos', 401));
    }

    // Check if user is active
    if (!user.isActive) {
      return next(
        new AppError('Cuenta desactivada. Contacta al administrador', 401)
      );
    }

    // Update last login
    await user.updateLastLogin();

    logger.info(`Usuario autenticado: ${email}`, { userId: user._id });

    createSendToken(user, 200, res, 'Inicio de sesión exitoso');
  } catch (error) {
    logger.error('Error en login:', {
      error: error.message,
      email: req.body.email,
    });
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    // Clear JWT cookie
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    logger.info(`Usuario cerró sesión: ${req.user?.email}`, {
      userId: req.user?._id,
    });

    res.status(200).json({
      status: 'success',
      message: 'Sesión cerrada exitosamente',
    });
  } catch (error) {
    logger.error('Error en logout:', {
      error: error.message,
      userId: req.user?._id,
    });
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Error obteniendo perfil de usuario:', {
      error: error.message,
      userId: req.user?.id,
    });
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    // Only allow updating certain fields
    const allowedFields = { name };

    const user = await User.findByIdAndUpdate(req.user.id, allowedFields, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return next(new AppError('Usuario no encontrado', 404));
    }

    logger.info(`Perfil actualizado: ${user.email}`, { userId: user._id });

    res.status(200).json({
      status: 'success',
      message: 'Perfil actualizado exitosamente',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Error actualizando perfil:', {
      error: error.message,
      userId: req.user?.id,
    });
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    // Verify current password
    if (!(await user.comparePassword(currentPassword))) {
      return next(new AppError('Contraseña actual incorrecta', 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    logger.info(`Contraseña cambiada: ${user.email}`, { userId: user._id });

    res.status(200).json({
      status: 'success',
      message: 'Contraseña actualizada exitosamente',
    });
  } catch (error) {
    logger.error('Error cambiando contraseña:', {
      error: error.message,
      userId: req.user?.id,
    });
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
