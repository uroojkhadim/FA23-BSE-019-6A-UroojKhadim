const ApiError = require('../utils/ApiError');

const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'ER_SIGNAL_EXCEPTION' || err.sqlState === '45000') {
    statusCode = 403;
    message = err.sqlMessage || err.message;
  }

  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || undefined,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 ? { stack: err.stack } : {}),
  });
};

module.exports = errorHandler;
