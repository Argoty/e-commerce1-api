require("dotenv").config()

import express from "express";
import bodyParser from "body-parser";
import path from "path"

const cors = require("cors");
const client = require("./config/mongo.js")
const {ObjectId} = require('mongodb')


const app = express();
const port = process.env.PORT || 3000

app.use(bodyParser.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname + "/assets")))


const obtenerProductosPorUsuario = async (db, user) => {
    const products = await db.collection("products").find({}).toArray();
    const cartItemsIds = user.cartItems;
    const cartItems = products.filter(p => cartItemsIds.includes(p._id.toString()));

    return cartItems
}

// OBTENER TODOS LOS PRODUCTOS
app.get('/api/products', async (req, res) => {
    await client.connect();

    const db = client.db("e-commerce_vue_express");
    const data = await db.collection("products").find({}).toArray();


    res.status(200).json(data);
    await client.close();
});

// OBTENER UN PRODUCTO NOMÁS
app.get('/api/products/:productId', async (req, res) => {
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
});

// OBTENER LOS PRODUCTOS DEL CARRITO DE UN USUARIO
app.get('/api/users/:userId/cart', async (req, res) => {
    try {
        await client.connect();

        const {userId} = req.params;
        const userIdObj = new ObjectId(userId);

        const db = client.db("e-commerce_vue_express");
        const user = await db.collection("users").findOne({_id: userIdObj});

        if (! user) {
            return res.status(404).json({"error": "Couldn't find the user"});
        }

        const cartItems = await obtenerProductosPorUsuario(db, user)


        res.status(200).json(cartItems);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error getting cart"});
    }
});

// AGREGAR UN PRODUCTO AL CARRITO DE UN USUARIO
app.post('/api/users/:userId/cart', async (req, res) => {
    try {
        await client.connect();
        const {productId} = req.body;
        const productIdObj = new ObjectId(productId)
        const {userId} = req.params
        const userIdObj = new ObjectId(userId)


        const db = client.db("e-commerce_vue_express");

        // Comprueba si existe el producto
        const product = await db.collection("products").findOne({_id: productIdObj})

        if (! product) {
            return res.status(404).json({"error": 'Could not find the product!'});
        }

        // Agrega el nuevo producto en el usuario
        await db.collection("users").updateOne({
            _id: userIdObj
        }, {
            $addToSet: {
                cartItems: productId
            }
        })

        // Obtiene los productos del usuario
        const user = await db.collection("users").findOne({_id: userIdObj});

        const cartItems = await obtenerProductosPorUsuario(db, user)

        res.status(200).json(cartItems);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error adding a product to the cart"});
    }
});


// ELIMINAR UN PRODUCTO AL CARRITO DE UN USUARIO
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
    try {
        await client.connect();
        const {userId, productId} = req.params
        const userIdObj = new ObjectId(userId)

        const db = client.db("e-commerce_vue_express");

        // Agrega el nuevo producto en el usuario
        await db.collection("users").updateOne({
            _id: userIdObj
        }, {
            $pull: {
                cartItems: productId
            }
        })

        // Obtiene los productos del usuario
        const user = await db.collection("users").findOne({_id: userIdObj});

        const cartItems = await obtenerProductosPorUsuario(db, user)

        res.status(200).json(cartItems);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error deleting a product to the cart"});
    }


});

app.listen(port, () => console.log("server listening 8000..!!"))


// npm run dev
