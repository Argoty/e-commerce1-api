const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorRegister = [
    check("username").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("birthdate").exists().notEmpty(),
    check("phone").exists().notEmpty(),
    check("password").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("email").exists().notEmpty().isEmail(),
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
