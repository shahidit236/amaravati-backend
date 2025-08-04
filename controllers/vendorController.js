const Vendor = require('../models/vendor');

exports.addVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      category,
      location,
      latitude,
      longitude,
      status,
      address, // ➕ Address
    } = req.body;

    const profileImage = req.file ? req.file.filename : '';

    const newVendor = new Vendor({
      name,
      email,
      phone,
      category,
      location,
      latitude,
      longitude,
      status,
      profileImage,
      address, // ➕ Save address
    });

    await newVendor.save();
    res.status(201).json({ message: 'Vendor created successfully', vendor: newVendor });
  } catch (error) {
    res.status(500).json({ message: 'Error adding vendor', error: error.message });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ createdAt: -1 });

    const formatted = vendors.map((v) => ({
      ...v._doc,
      profileImage: v.profileImage
        ? `${req.protocol}://${req.get('host')}/uploads/vendors/${v.profileImage}`
        : '',
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendors', error: error.message });
  }
};
