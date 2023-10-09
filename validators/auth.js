const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegister = [
    check("username").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("age").exists().notEmpty().isNumeric(),
    check("password").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    (req, res, next) => validateResults(req, res, next),
]

const validatorLogin = [
    check("username").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("password").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    (req, res, next) => validateResults(req, res, next),
]

module.exports = {validatorRegister, validatorLogin}
