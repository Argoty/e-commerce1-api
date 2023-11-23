const express = require("express");
const router = express.Router();

const {validatorGetCart} = require("../validators/cart")

const { getUsers, getUser  } = require("../controllers/users")

const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol");

router.get("/", authMiddleware, checkRol(["admin"]), getUsers);
// router.get("/:userId", authMiddleware, checkRol(["admin"]), validatorGetCart, getUser);

module.exports = router;