const express = require("express")
const router = express.Router()

const getContact = require("../controllers/contact")

router.get("/", getContact)

module.exports = router