const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join('. ');
  }

  // multer rejected a file, e.g. it was too large or not an image
  if (err.name === 'MulterError') {
    statusCode = 400;
    message = err.message;
  }

  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} '${err.keyValue[field]}' already exists`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
};

module.exports = errorHandler;