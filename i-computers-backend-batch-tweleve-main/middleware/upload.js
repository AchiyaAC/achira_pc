import multer from "multer";

const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only JPG, JPEG, PNG, WEBP and GIF images are allowed.")
    );
  }

  cb(null, true);
};

// IMPORTANT:
// Render's local filesystem is temporary. Do NOT use diskStorage for
// product images. Files are kept in memory and uploaded to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
