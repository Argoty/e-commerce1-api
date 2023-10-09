const {verifyToken } = require("../utils/handleJwt")
const client = require("../config/mongo.js")
const {ObjectId} = require('mongodb')

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization){
            res.status(401).send({error: "NOT TOKEN SESSION"})
        }

        const token = req.headers.authorization.split(" ").pop(); // QUITA EL 'BEARER' DEL TOKEN
        const dataToken = await verifyToken(token)

        if (!dataToken) {
            res.status(401).send({err: "NOT_PAYLOAD_DATA"})
        }

        await client.connect();
        const db = client.db("e-commerce_vue_express");
        const user = await db.collection("users").findOne({_id: new ObjectId(dataToken._id)})

        delete user.password
        req.user = user;
        
        await client.close();
        next();
    } catch (err) {
        res.status(401).send({"error": "NOT SESSION"})
    }
}

module.exports = authMiddleware