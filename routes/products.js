const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProduct
  } = require("../controllers/products");

// OBTENER TODOS LOS PRODUCTOS
router.get('/', getProducts);

// OBTENER UN PRODUCTO NOMÁS
router.get('/:productId', getProduct);

module.exports = router