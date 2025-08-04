const express = require('express');
const router = express.Router();

// Example route
router.get('/subcategories', (req, res) => {
  res.json({ message: 'Subcategories route working' });
});

module.exports = router;
