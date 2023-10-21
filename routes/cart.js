const express = require('express');
const router = express.Router();

const {
    getProductsInCart,
    postProductInCart,
    deleteProductInCart
  } = require("../controllers/cart");

const {validatorGetCart, validatorProduct} = require("../validators/cart")
const authMiddleware = require("../middleware/session")

router.get('/:userId',validatorGetCart, authMiddleware, getProductsInCart);

// AGREGAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.post('/:userId', validatorGetCart, validatorProduct, authMiddleware, postProductInCart);


// ELIMINAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.delete('/:userId/:productId', validatorGetCart, validatorProduct, authMiddleware, deleteProductInCart);

module.exports = router