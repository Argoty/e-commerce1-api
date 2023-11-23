const express = require('express');
const router = express.Router();

const {addRating, getRating, getUserRatings} = require("../controllers/rating");

const {validatorAddRating, validatorGetRating} = require("../validators/rating")
const {validatorGetCart} = require("../validators/cart")

const authMiddleware = require("../middleware/session")

// OBTENER RATING DE UN USUARIO CON SU PRODUCTO.
router.get('/:userId/:productId', authMiddleware, validatorGetRating, getRating);

// OBTENER RATINGS DE UN USUARIO.
router.get('/:userId', authMiddleware, validatorGetCart, getUserRatings);

// AGREGAR RATE DE UN PRODUCTO QUE HAYA PUESTO EL USUARIO.
router.post('/', authMiddleware, validatorGetRating, validatorAddRating, addRating);

module.exports = router