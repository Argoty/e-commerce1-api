const express = require('express');
const router = express.Router();

const {
    getProductsInCart,
    postProductInCart,
    deleteProductInCart
  } = require("../controllers/cart");

router.get('/:userId',getProductsInCart);

// AGREGAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.post('/:userId', postProductInCart);


// ELIMINAR UN PRODUCTO AL CARRITO DE UN USUARIO
router.delete('/:userId/:productId', deleteProductInCart);

module.exports = router