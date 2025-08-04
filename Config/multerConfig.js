// config/multerConfig.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const uniqueName = Date.now() + '-' + base + ext;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
module.exports = upload;
