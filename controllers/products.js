const client = require("../config/mongo.js")
const {ObjectId} = require('mongodb')

const getProducts =  async (req, res) => {
    await client.connect();

    const db = client.db("e-commerce_vue_express");
    const data = await db.collection("products").find({}).toArray();


    res.status(200).json(data);
    await client.close();
}

const getProduct =  async (req, res) => {
    try {
        await client.connect();
        const {productId} = req.params;
        const productObjId = new ObjectId(productId);

        const db = client.db("e-commerce_vue_express");
        const product = await db.collection("products").findOne({_id: productObjId});

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({"error": 'Could not find the product!'});
        }
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error getting product"});
    }
}

module.exports = { getProduct, getProducts }