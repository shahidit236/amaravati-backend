const Category = require('../models/Category');

exports.addCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const profile = req.file ? req.file.filename : null;

    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required' });
    }

    const newCategory = new Category({
      name,
      description,
      status: status || 'active', // default status if not provided
      profile
    });

    await newCategory.save();

    res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
