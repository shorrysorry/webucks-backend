const productService = require('../services/productService');

const getCategories = async (req, res) => {
  try {
    const categories = await productService.getCategories();
    return res.status(200).json({ categories });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getLists = async (req, res) => {
  try {
    const lists = await productService.getLists();
    return res.status(200).json({ lists });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

const getDetail = async (req, res) => {
  try {
    const detail = await productService.getDetail();
    return res.status(200).json({ detail });
  } catch (err) {
    console.log(err);
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
};

module.exports = { getCategories, getLists, getDetail };
