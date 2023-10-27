const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorPayment = [
    check("products").exists().notEmpty().isArray(),
    (req, res, next) => validateResults(req, res, next)
];


module.exports = validatorPayment