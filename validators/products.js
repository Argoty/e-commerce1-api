const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCreateProduct = [
    check("name").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("price").exists().notEmpty().isNumeric(),
    check("description").exists().notEmpty().isLength(
        {min: 10}
    ),
    (req, res, next) => validateResults(req, res, next),
]


module.exports = {
    validatorCreateProduct
}
