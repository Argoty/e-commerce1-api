const express = require('express');
const router = express.Router();

const {getProductsInCart, postProductInCart, deleteProductInCart} = require("../controllers/cart");

const {validatorGetCart, validatorProduct, validatorAddProduct} = require("../validators/cart")
const authMiddleware = require("../middleware/session")

router.get('/:userId', authMiddleware, validatorGetCart, getProductsInCart);

// AGREGAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.post('/:userId', authMiddleware, validatorGetCart, validatorAddProduct, postProductInCart);


// ELIMINAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.delete('/:userId/:productId', authMiddleware, validatorGetCart, validatorProduct, deleteProductInCart);

module.exports = router
