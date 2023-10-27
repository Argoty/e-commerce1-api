
const client = require("../config/mongo")

const getContact = async (req, res) => {
    try {
        await client.connect()
        const db = client.db("e-commerce_vue_express")

        const contact = await db.collection("contact").findOne({})
        res.status(200).json(contact)
        await client.close();
    } catch(err) {
        res.status(404).json({"ERROR": "ERROR_GETTING_CONTACT"})
    }
}

module.exports = getContact