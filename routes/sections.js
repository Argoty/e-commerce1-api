const express = require('express');
const router = express.Router();

const {
    getSections,
    getSectionProducts,
    createSection,
    updateSection,
    deleteSection
} = require("../controllers/sections");

const {validatorCreateSection, validatorSection} = require("../validators/sections")
// const {validatorProduct} = require("../validators/cart")

const authMiddleware = require("../middleware/session")
const checkRol = require("../middleware/rol");

// OBTENER TODOS LOS PRODUCTOS
router.get('/', getSections);

// OBTENER PRODUCTOS DE LA SECCIÓN
router.get('/:sectionId', validatorSection, getSectionProducts);

router.post('/', authMiddleware, checkRol(["admin"]), validatorCreateSection, createSection)

router.put('/:sectionId', authMiddleware, checkRol(["admin"]), validatorSection, validatorCreateSection, updateSection),

router.delete('/:sectionId', authMiddleware, checkRol(["admin"]), validatorSection, deleteSection)

module.exports = router