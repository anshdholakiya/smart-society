const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getStorage = (folderName) => new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: folderName,
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

const uploadComplaint = multer({ storage: getStorage('society_complaints') });
const uploadProfile = multer({ storage: getStorage('society_profiles') });
const uploadGallery = multer({ storage: getStorage('society_gallery') });

module.exports = {
  uploadComplaint,
  uploadProfile,
  uploadGallery,
  cloudinary
};