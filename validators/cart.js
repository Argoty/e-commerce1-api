const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorGetCart = [
    check("userId").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next)
];

const validatorProduct = [
    check("productId").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorGetCart, validatorProduct }