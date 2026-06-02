const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const ApiError = require('../utils/ApiError');

const uploadDir = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
const subdirs = ['payments', 'reports', 'prescriptions', 'avatars'];

subdirs.forEach((dir) => {
  const full = path.join(uploadDir, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const maxSize = (parseInt(process.env.MAX_FILE_SIZE_MB || '5', 10) * 1024 * 1024);

const storage = (folder) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, path.join(uploadDir, folder)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const fileFilter = (_req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.pdf', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(ApiError.badRequest(`File type ${ext} not allowed`));
  }
  cb(null, true);
};

const createUploader = (folder) =>
  multer({
    storage: storage(folder),
    limits: { fileSize: maxSize },
    fileFilter,
  });

module.exports = {
  paymentUpload: createUploader('payments').single('screenshot'),
  reportUpload: createUploader('reports').single('file'),
  prescriptionUpload: createUploader('prescriptions').single('attachment'),
  avatarUpload: createUploader('avatars').single('avatar'),
  uploadDir,
};
