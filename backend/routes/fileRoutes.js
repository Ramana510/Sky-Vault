import express from 'express';
import { upload } from '../utils/upload.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile, getUserFiles, deleteFile, renameFile, getRecentFiles } from '../controllers/fileController.js';

const router = express.Router();

router.route('/').get(protect, getUserFiles);
router.route('/recent').get(protect, getRecentFiles);
router.route('/upload').post(protect, (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (err) {
      res.status(400);
      return next(new Error(err.message || 'File upload error'));
    }
    next();
  });
}, uploadFile);
router.route('/:id').delete(protect, deleteFile).put(protect, renameFile);

export default router;
