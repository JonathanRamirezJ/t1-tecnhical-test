const jwt = require('jsonwebtoken');

const generateToken = payload => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const verifyToken = token => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const createSendToken = (
  user,
  statusCode,
  res,
  message = 'Operación exitosa'
) => {
  const token = generateToken({ id: user._id });

  // Configuración de cookie (opcional para mayor seguridad)
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (process.env.JWT_COOKIE_EXPIRES_IN || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('jwt', token, cookieOptions);

  // Remover password del output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    message,
    token,
    data: {
      user,
    },
  });
};

module.exports = {
  generateToken,
  verifyToken,
  createSendToken,
};
