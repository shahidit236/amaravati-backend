const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory'); // Make sure this model exists

// Multer Storage Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// ======================== CATEGORY ========================

// ✅ Add new category
router.post('/categories', upload.single('profile'), async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const profile = req.file ? req.file.filename : '';

    const newCategory = new Category({
      name,
      description,
      status,
      profile
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category added successfully', category: newCategory });
  } catch (err) {
    console.error('Add Category Error:', err);
    res.status(500).json({ error: 'Failed to add category' });
  }
});

// ✅ Get all categories with image URLs
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();

    const fullCategories = categories.map(cat => ({
      ...cat._doc,
      profile: cat.profile
        ? `${req.protocol}://${req.get('host')}/uploads/${cat.profile}`
        : '',
    }));

    res.json(fullCategories);
  } catch (err) {
    console.error('Fetch Categories Error:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// ======================== SUBCATEGORY ========================

// ✅ Add new subcategory
router.post('/subcategories', upload.single('profile'), async (req, res) => {
  try {
    const { name, description, status, categoryId } = req.body;
    const profile = req.file ? req.file.filename : '';

    const newSubcategory = new Subcategory({
      name,
      description,
      status,
      categoryId,
      profile
    });

    await newSubcategory.save();
    res.status(201).json({ message: 'Subcategory added successfully', subcategory: newSubcategory });
  } catch (err) {
    console.error('Add Subcategory Error:', err);
    res.status(500).json({ error: 'Failed to add subcategory' });
  }
});

// ✅ Get all subcategories with image URLs and category names
router.get('/subcategories', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId', 'name');

    const fullSubcategories = subcategories.map(sub => ({
      ...sub._doc,
      profile: sub.profile
        ? `${req.protocol}://${req.get('host')}/uploads/${sub.profile}`
        : '',
    }));

    res.json(fullSubcategories);
  } catch (err) {
    console.error('Fetch Subcategories Error:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

module.exports = router;
