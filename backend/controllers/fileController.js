import asyncHandler from 'express-async-handler';
import cloudinary from '../config/cloudinary.js';
import File from '../models/fileModel.js';

const getFileType = (mimetype) => {
  if (mimetype.startsWith('image')) return 'image';
  if (mimetype.startsWith('video')) return 'video';
  return 'other';
};

export const uploadFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    console.error('Upload failed: missing file in request', {
      path: req.originalUrl,
      method: req.method,
      userId: req.user?._id,
    });
    res.status(400);
    throw new Error('File upload failed');
  }

  const file = req.file;
  const fileType = getFileType(file.mimetype);

  const result = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: fileType === 'video' ? 'video' : 'image',
        folder: `sky-vault/${req.user._id}`,
      },
      (error, uploadResult) => {
        if (error) {
          // Cloudinary returns a plain object, not a JS Error — convert it so
          // the error middleware can read .message and .stack properly.
          const errMsg =
            (typeof error === 'string' ? error : null) ||
            error?.message ||
            error?.error?.message ||
            JSON.stringify(error);
          const jsError = new Error(`Cloudinary: ${errMsg}`);
          console.error('Cloudinary upload error', {
            userId: req.user?._id,
            fileName: file.originalname,
            fileType,
            mimeType: file.mimetype,
            cloudinaryError: error,
          });
          reject(jsError);
        } else {
          resolve(uploadResult);
        }
      }
    );

    uploadStream.end(file.buffer);
  });

  const createdFile = await File.create({
    userId: req.user._id,
    fileName: file.originalname,
    fileUrl: result.secure_url,
    publicId: result.public_id,
    fileType,
    fileSize: file.size,
  });

  res.status(201).json(createdFile);
});

export const getUserFiles = asyncHandler(async (req, res) => {
  const { type, sort, search } = req.query;
  const filter = { userId: req.user._id };

  if (type === 'image' || type === 'video') {
    filter.fileType = type;
  }

  if (search) {
    filter.fileName = { $regex: search, $options: 'i' };
  }

  const sortOption = sort === 'latest' ? { createdAt: -1 } : { createdAt: -1 };
  const files = await File.find(filter).sort(sortOption);

  res.json(files);
});

export const deleteFile = asyncHandler(async (req, res) => {
  const file = await File.findOne({ _id: req.params.id, userId: req.user._id });
  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  await cloudinary.uploader.destroy(file.publicId, { resource_type: file.fileType === 'video' ? 'video' : 'image' });
  await file.deleteOne();

  res.json({ message: 'File deleted successfully' });
});

export const renameFile = asyncHandler(async (req, res) => {
  const { fileName } = req.body;
  const file = await File.findOne({ _id: req.params.id, userId: req.user._id });

  if (!file) {
    res.status(404);
    throw new Error('File not found');
  }

  file.fileName = fileName || file.fileName;
  const updatedFile = await file.save();
  res.json(updatedFile);
});

export const getRecentFiles = asyncHandler(async (req, res) => {
  const files = await File.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(8);
  res.json(files);
});
