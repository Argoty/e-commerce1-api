const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")


const validatorGetRating = [
    check("productId").exists().notEmpty().isMongoId(),
    check("userId").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next)
]


const validatorAddRating = [
    check("rating")
        .exists().notEmpty().isInt({ min: 1, max: 10 })
        .withMessage("Rating must be an integer between 1 and 10"),
    (req, res, next) => validateResults(req, res, next)
]

module.exports = { validatorAddRating, validatorGetRating }