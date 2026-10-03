const cloudinary = require('../config/cloudinary');

// cloudinary's upload_stream returns a writable stream. we write our
// buffer into it and wrap the whole thing in a promise so controllers
// can just await it like any other async call
const uploadBufferToCloudinary = (buffer, folder = 'products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(buffer);
  });
};

module.exports = uploadBufferToCloudinary;