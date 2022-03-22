const express = require('express');
const router = express.Router();

const productController = require('../controllers/productController');

router.get('/categories', productController.getCategories);
router.get('/list', productController.getLists);
router.get('/detail', productController.getDetail);

module.exports = router;
