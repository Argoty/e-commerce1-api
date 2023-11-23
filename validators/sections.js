const {check} = require("express-validator")
const validateResults = require("../utils/handleValidator")

const validatorCreateSection = [
    check("name").exists().notEmpty().isLength(
        {min: 3, max: 99}
    ),
    check("description").exists().notEmpty().isLength(
        {min: 10}
    ),
    (req, res, next) => validateResults(req, res, next),
]

const validatorSection = [
    check("sectionId").exists().notEmpty().isMongoId(),
    (req, res, next) => validateResults(req, res, next),
]

module.exports = {
    validatorCreateSection,
    validatorSection
}