const logger = require('../utils/logger');
const { AppError } = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Recurso no encontrado con ID: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Valor duplicado: ${value}. Por favor usa otro valor.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(val => val.message);
  const message = `Datos inválidos: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token inválido. Por favor inicia sesión de nuevo.', 401);

const handleJWTExpiredError = () =>
  new AppError('Tu token ha expirado. Por favor inicia sesión de nuevo.', 401);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    ...(err.validationErrors && { validationErrors: err.validationErrors }),
  });
};

const sendErrorProd = (err, res) => {
  // Trusted operational errors: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(err.validationErrors && { validationErrors: err.validationErrors }),
    });
  } else {
    // Programming errors: don't leak details to client
    logger.error('ERROR:', err);

    res.status(500).json({
      status: 'error',
      message: 'Algo salió mal en el servidor',
    });
  }
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

// Middleware to handle not found routes
const notFound = (req, res, next) => {
  const message = `No se pudo encontrar ${req.originalUrl} en este servidor`;
  next(new AppError(message, 404));
};

module.exports = {
  errorHandler,
  notFound,
};
