const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Category = require('../models/Category');

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/categories/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// ✅ POST /api/categories — Add Category
router.post('/', upload.single('profile'), async (req, res) => {
  try {
    const { name, description, status = 'Active' } = req.body;
    const profile = req.file ? `/uploads/categories/${req.file.filename}` : '';

    const newCategory = new Category({ name, description, status, profile });
    await newCategory.save();

    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (err) {
    console.error('Error adding category:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET /api/categories — Get All Categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ PUT /api/categories/:id — Update Category
router.put('/:id', upload.single('profile'), async (req, res) => {
  try {
    const { name, description, status = 'Active' } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (req.file && category.profile) {
      const oldPath = path.join(__dirname, '..', category.profile);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedFields = {
      name,
      description,
      status,
      profile: req.file ? `/uploads/categories/${req.file.filename}` : category.profile,
    };

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updatedFields, {
      new: true,
    });

    res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ DELETE /api/categories/:id — Delete Category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    if (category.profile) {
      const filePath = path.join(__dirname, '..', category.profile);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Error deleting category:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Export Router
module.exports = router;