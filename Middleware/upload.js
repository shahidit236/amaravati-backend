// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure 'uploads/vendors' directory exists
const vendorUploadPath = path.join(__dirname, '../uploads/vendors');
if (!fs.existsSync(vendorUploadPath)) {
  fs.mkdirSync(vendorUploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, vendorUploadPath); // Save in 'uploads/vendors'
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

module.exports = upload;
