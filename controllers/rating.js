const client = require("../config/mongo.js");
const { ObjectId } = require('mongodb');

const addRating = async (req, res) => {
    try {
        const { body } = req;
        const { productId, userId } = body;

        // VER SI USER DEL TOKEN ES EL MISMO QUE SE PUSO EN EL BODY
        if (req.user._id.toString() !== userId) {
            return res.status(404).json({"error": "USER DENIED"});
        }

        const productIdObj = new ObjectId(productId)
        const userIdObj = new ObjectId(userId)

        await client.connect();
        const db = client.db("e-commerce_vue_express");

        // Comprobación de existencia del productId en la colección "products"
        const productExists = await db.collection("products").findOne({ _id: productIdObj });
        if (!productExists) {
            return res.status(404).json({ "error": 'Product not found' });
        }

        // Comprobación de existencia del userId en la colección "user"
        const userExists = await db.collection("users").findOne({ _id: userIdObj });
        if (!userExists) {
            return res.status(404).json({ "error": 'User not found' });
        }

        // Verificación y posterior inserción o actualización en la colección "rating"
        const filter = { productId, userId };
        const updateDoc = {
            $set: { rating: body.rating }
        };

        // Poner el rating en la base de datos del usuario y su producto
        await db.collection("rating").updateOne(filter, updateDoc, { upsert: true });

        // Obtener ratings de un producto y sacar promedio
        const ratingsForProduct = await db.collection("rating").find({ productId }).toArray();
        const totalRatings = ratingsForProduct.reduce((acc, curr) => acc + curr.rating, 0);
        const averageRating = totalRatings / ratingsForProduct.length;

        // Actualizar el documento en la colección "products" con el nuevo averageRating
        await db.collection("products").updateOne(
            { _id: productIdObj },
            { $set: { averageRating } }
        );

        res.status(200).json({...productExists, averageRating});
    } catch (err) {
        return res.status(404).json({ "error": "Error adding rate" });
    } finally {
        await client.close();
    }
};

const getRating = async (req, res) => {
    try {
        const {userId, productId} = req.params;

        if (req.user._id.toString() !== userId) {
            return res.status(404).json({"error": "USER DENIED"});
        }

        await client.connect();
        const db = client.db("e-commerce_vue_express");

        const rating = await db.collection("rating").findOne({userId, productId})

        res.status(200).json(rating);
    } catch (err) {
        return res.status(404).json({ "error": "Error getting rate" });
    } finally {
        await client.close();
    }
}

const getUserRatings = async (req, res) => {
    try {
        const {userId} = req.params;

        if (req.user._id.toString() !== userId) {
            return res.status(404).json({"error": "USER DENIED"});
        }

        await client.connect();
        const db = client.db("e-commerce_vue_express");

        const ratings = await db.collection("rating").find({userId}).toArray()

        res.status(200).json(ratings);
    } catch (err) {
        return res.status(404).json({ "error": "Error getting ratings of a user " });
    } finally {
        await client.close();
    }
}

module.exports = {
    addRating,
    getRating,
    getUserRatings
};


