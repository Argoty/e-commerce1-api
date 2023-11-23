const client = require("../config/mongo.js")
const {ObjectId} = require('mongodb')

const getProductsInCart = async (req, res) => {
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
}

const postProductInCart = async (req, res) => {
    try {
        const {productId, amount} = req.body;
        const productIdObj = new ObjectId(productId);
        const {userId} = req.params;
        const userIdObj = new ObjectId(userId);

        if (req.user._id.toString() !== userId) {
            return res.status(404).json({"error": "USER DENIED"});
        }

        await client.connect();
        const db = client.db("e-commerce_vue_express");

        // Comprueba si existe el producto
        const product = await db.collection("products").findOne({_id: productIdObj});

        if (! product) {
            return res.status(404).json({"error": 'Could not find the product!'});
        }

        // Actualizar o agregar el nuevo producto en el usuario
        const {modifiedCount} = await db.collection("users").updateOne({
            _id: userIdObj,
            "cartItems.productId": productId
        }, {
            $set: {
                "cartItems.$.amount": amount
            }
        });

        if (modifiedCount === 0) {
            await db.collection("users").updateOne({
                _id: userIdObj
            }, {
                $addToSet: {
                    cartItems: {
                        productId,
                        amount
                    }
                }
            });
        }

        // Obtiene los productos del usuario
        const user = await db.collection("users").findOne({_id: userIdObj});
        const cartItems = await obtenerProductosPorUsuario(db, user);

        res.status(200).json(cartItems);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error adding a product to the cart"});
    }
};

const deleteProductInCart = async (req, res) => {
    try {
        const {userId, productId} = req.params;
        const userIdObj = new ObjectId(userId);

        if (req.user._id.toString() !== userId) {
            return res.status(404).json({"error": "USER DENIED"});
        }

        await client.connect();
        const db = client.db("e-commerce_vue_express");

        // Elimina el producto del usuario con el productId correspondiente
        await db.collection("users").updateOne({
            _id: userIdObj
        }, {
            $pull: {
                cartItems: {
                    productId
                }
            }
        });

        // Obtiene los productos del usuario
        const user = await db.collection("users").findOne({_id: userIdObj});

        const cartItems = await obtenerProductosPorUsuario(db, user);

        res.status(200).json(cartItems);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error deleting a product to the cart"});
    }
}


// Funcion para obtener los productos del usuario
const obtenerProductosPorUsuario = async (db, user) => { // Obtener todos los productos
    const products = await db.collection("products").find({}).toArray();

    // Obtener los productos en el carrito del usuario
    const cartItems = user.cartItems.map(item => {
        const product = products.find(p => p._id.toString() === item.productId);
        return {
            ... product,
            amount: item.amount
        };
    });

    return cartItems;
};

module.exports = {
    getProductsInCart,
    postProductInCart,
    deleteProductInCart
}
