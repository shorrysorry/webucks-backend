const productDao = require('../models/productDao');

const getCategories = async () => {
  return await productDao.getCategories();
};

const getLists = async () => {
  return await productDao.getLists();
};

const getDetail = async () => {
  return await productDao.getDetail();
};

module.exports = { getCategories, getLists, getDetail };
