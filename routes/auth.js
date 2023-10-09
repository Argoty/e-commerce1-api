const express = require("express");
const router = express.Router();

const { validatorLogin, validatorRegister } = require("../validators/auth");

const { registerUser, loginUser  } = require("../controllers/auth")
// loginUser


router.post("/register", validatorRegister, registerUser);
router.post("/login", validatorLogin, loginUser);

module.exports = router;