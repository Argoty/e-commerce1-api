const express = require('express');
const router = express.Router();

const {getProductsInCart, postProductInCart, deleteProductInCart} = require("../controllers/cart");

const {validatorGetCart, validatorProduct} = require("../validators/cart")
const authMiddleware = require("../middleware/session")

router.get('/:userId', authMiddleware, validatorGetCart, getProductsInCart);

// AGREGAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.post('/:userId', authMiddleware, validatorGetCart, validatorProduct, postProductInCart);


// ELIMINAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.delete('/:userId/:productId', authMiddleware, validatorGetCart, validatorProduct, deleteProductInCart);

module.exports = router
