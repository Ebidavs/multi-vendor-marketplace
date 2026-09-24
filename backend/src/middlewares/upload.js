const multer = require('multer');
const AppError = require('../utils/appError');

// keeps the uploaded file in memory as a buffer instead of writing it to
// disk. we forward that buffer straight to Cloudinary, so we never need
// local file storage on the server at all
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files are allowed', 400), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;