const { body, query, validationResult } = require('express-validator');
const { AppError } = require('../utils/appError');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value,
    }));

    return next(new AppError('Datos de entrada inválidos', 400, errorMessages));
  }
  next();
};

// Validations for authentication
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'La contraseña debe contener al menos una letra minúscula, una mayúscula y un número'
    ),
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    .withMessage('El nombre solo puede contener letras y espacios'),
  handleValidationErrors,
];

const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Debe ser un email válido'),
  body('password').notEmpty().withMessage('La contraseña es requerida'),
  handleValidationErrors,
];

// Validations for component tracking
const validateComponentTracking = [
  body('componentName')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El nombre del componente debe tener entre 1 y 100 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'El nombre del componente solo puede contener letras, números, guiones y guiones bajos'
    ),
  body('variant')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La variante debe tener entre 1 y 50 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage(
      'La variante solo puede contener letras, números, guiones y guiones bajos'
    ),
  body('action')
    .optional()
    .isIn([
      'click',
      'hover',
      'focus',
      'blur',
      'change',
      'submit',
      'load',
      'scroll',
      'resize',
      'custom',
    ])
    .withMessage('Acción no válida'),
  body('sessionId')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El sessionId no puede exceder 100 caracteres'),
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Los metadatos deben ser un objeto'),
  body('metadata.userAgent')
    .optional()
    .isLength({ max: 500 })
    .withMessage('El userAgent no puede exceder 500 caracteres'),
  body('metadata.url')
    .optional()
    .isURL()
    .withMessage('La URL debe ser válida')
    .isLength({ max: 500 })
    .withMessage('La URL no puede exceder 500 caracteres'),
  body('metadata.screenResolution.width')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('El ancho de pantalla debe ser un número entre 1 y 10000'),
  body('metadata.screenResolution.height')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('La altura de pantalla debe ser un número entre 1 y 10000'),
  body('metadata.viewport.width')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('El ancho del viewport debe ser un número entre 1 y 10000'),
  body('metadata.viewport.height')
    .optional()
    .isInt({ min: 1, max: 10000 })
    .withMessage('La altura del viewport debe ser un número entre 1 y 10000'),
  handleValidationErrors,
];

// Validations for statistics queries
const validateStatsQuery = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La fecha de inicio debe ser una fecha válida en formato ISO8601'
    ),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La fecha de fin debe ser una fecha válida en formato ISO8601'
    ),
  query('componentName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'El nombre del componente debe tener entre 1 y 100 caracteres'
    ),
  query('variant')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('La variante debe tener entre 1 y 50 caracteres'),
  query('action')
    .optional()
    .isIn([
      'click',
      'hover',
      'focus',
      'blur',
      'change',
      'submit',
      'load',
      'scroll',
      'resize',
      'custom',
    ])
    .withMessage('Acción no válida'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage('El límite debe ser un número entre 1 y 1000'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número mayor a 0'),
  handleValidationErrors,
];

// Validations for export
const validateExportQuery = [
  query('format')
    .optional()
    .isIn(['csv', 'json'])
    .withMessage('El formato debe ser csv o json'),
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La fecha de inicio debe ser una fecha válida en formato ISO8601'
    ),
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage(
      'La fecha de fin debe ser una fecha válida en formato ISO8601'
    ),
  query('componentName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage(
      'El nombre del componente debe tener entre 1 y 100 caracteres'
    ),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateComponentTracking,
  validateStatsQuery,
  validateExportQuery,
  handleValidationErrors,
};
