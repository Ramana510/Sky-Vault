import multer from 'multer';
import path from 'path';

const memoryStorage = multer.memoryStorage();

const allowedExtensions = ['.jpeg', '.jpg', '.png', '.gif', '.mp4', '.mov', '.avi', '.mkv', '.webm', '.heic', '.heif', '.avif'];
const allowedImageMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif', 'image/avif'];
const allowedVideoMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska', 'video/webm', 'video/x-ms-wmv', 'video/mpeg', 'video/3gpp', 'video/3gpp2'];

const fileFilter = (req, file, cb) => {
  const extName = allowedExtensions.includes(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedImageMimes.includes(file.mimetype) || allowedVideoMimes.includes(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed'));
  }
};

export const upload = multer({
  storage: memoryStorage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter,
});
