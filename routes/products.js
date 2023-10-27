const express = require('express');
const router = express.Router();

const {getProducts, getProduct, createProduct, updateProduct, deleteProduct} = require("../controllers/products");

const {validatorCreateProduct} = require("../validators/products")
const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol");

// OBTENER TODOS LOS PRODUCTOS
router.get('/', getProducts);

// OBTENER UN PRODUCTO NOMÁS
router.get('/:productId', getProduct);

router.post('/', authMiddleware, checkRol(["admin"]), validatorCreateProduct, createProduct)

router.put('/:productId', authMiddleware, checkRol(["admin"]), validatorCreateProduct, updateProduct),

router.delete('/:productId', authMiddleware, checkRol(["admin"]), deleteProduct)

module.exports = router
