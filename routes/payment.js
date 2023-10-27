const express = require('express');
const router = express.Router();

const { checkout } = require("../controllers/payment")
const validatorPayment = require("../validators/payment")

router.post("/create-checkout-session", validatorPayment, checkout)

module.exports = router