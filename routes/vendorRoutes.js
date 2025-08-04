const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Vendor = require('../models/vendor');

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/vendors/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


// ✅ POST /api/vendors/add — Add Vendor
router.post('/add', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      location,
      status = 'Active',
      latitude,
      longitude,
      address,
    } = req.body;

    const vendor = new Vendor({
      name,
      email,
      phone,
      category,
      location,
      status,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
      profileImage: req.file ? `/uploads/vendors/${req.file.filename}` : '',
    });

    await vendor.save();
    res.status(201).json({ message: 'Vendor added successfully', vendor });
  } catch (err) {
    console.error('Error adding vendor:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ GET /api/vendors — Get All Vendors
router.get('/', async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (err) {
    console.error('Error fetching vendors:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ PUT /api/vendors/:id — Update Vendor
router.put('/:id', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      location,
      status = 'Active',
      latitude,
      longitude,
      address,
    } = req.body;

    const updatedData = {
      name,
      email,
      phone,
      category,
      location,
      status,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      address,
    };

    if (req.file) {
      updatedData.profileImage = `/uploads/vendors/${req.file.filename}`;
    }

    const updatedVendor = await Vendor.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    if (!updatedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (err) {
    console.error('Error updating vendor:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ DELETE /api/vendors/:id — Delete Vendor
router.delete('/:id', async (req, res) => {
  try {
    const deletedVendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!deletedVendor) {
      return res.status(404).json({ message: 'Vendor not found' });
    }

    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (err) {
    console.error('Error deleting vendor:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// ✅ Export Router
module.exports = router;
