const client = require("../config/mongo.js")
const {ObjectId} = require('mongodb')
import {uploadImage, deleteImage} from "../utils/cloudinary"

const getProducts = async (req, res) => {
    await client.connect();

    const db = client.db("e-commerce_vue_express");
    const data = await db.collection("products").find({}).toArray();


    res.status(200).json(data);
    await client.close();
}

const getProduct = async (req, res) => {
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

const createProduct = async (req, res) => {
    try {
        const {body} = req;

        if (!req.files ?. image) {
            return res.status(404).json({error: "NEED_IMAGE_FILE"});
        }

        // ADDING IMAGE TO THE CLOUDINARY DB
        const data_img = await uploadImage(req.files.image.data);

        body.averageRating = "5.0"
        body.imageUrl = data_img.url;
        body.createdAt = new Date();
        body.updatedAt = body.createdAt

        await client.connect();


        const db = client.db("e-commerce_vue_express");
        const productsCollection = db.collection("products");

        const result = await productsCollection.insertOne(body)

        const product = await productsCollection.findOne({_id: result.insertedId});

        if (! product) {
            return res.status(404).json({"error": 'Could not find the product!'});
        }

        res.status(201).json(product);
        await client.close();

    } catch (err) {
        return res.status(404).json({"error": "Error creating product"});
    }
}

const updateProduct = async (req, res) => {
    try {
        const {body, params} = req;
        const productObjId = new ObjectId(params.productId); // Obtén el ID del producto de los parámetros de la URL

        if (!req.files ?. image) {
            return res.status(400).json({error: "NEED_IMAGE_FILE"});
        }

        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const productsCollection = db.collection("products")

        const product = await productsCollection.findOne({_id: productObjId});

        if (! product) {
            res.status(404).json({"error": 'Could not find the product!'});
            return
        }

        // Elimina la imagen anterior de Cloudinary utilizando su URL anterior
        const previousImageUrl = product.imageUrl
        await deleteImage(previousImageUrl);

        // ADICIÓN DE LA NUEVA IMAGEN A CLOUDINARY
        const data_img = await uploadImage(req.files.image.data);

        body.averageRating = "5.0";
        body.imageUrl = data_img.url;
        body.updatedAt = new Date();

        // Actualiza el producto en la base de datos utilizando el método 'findOneAndUpdate'
        await productsCollection.findOneAndUpdate({
            _id: productObjId
        }, {
            $set: body
        }, {returnOriginal: false});

        res.status(200).json({
            _id: productObjId,
            ...body
        });
        await client.close();
    } catch (err) {
        return res.status(400).json({error: "Error updating product"});
    }
};

const deleteProduct = async (req, res) => {
    try {
        const {productId} = req.params;
        const productObjId = new ObjectId(productId); // Obtén el ID del producto de los parámetros de la URL

        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const productsCollection = db.collection("products")

        const product = await productsCollection.findOneAndDelete({_id: productObjId});

        if (! product) {
            res.status(404).json({"error": 'Could not find the product!'});
            return
        }

        // Elimina la imagen anterior de Cloudinary utilizando su URL anterior
        const imageUrl = product.imageUrl
        await deleteImage(imageUrl);


        res.status(204).json({
            data: "PRODUCT ELIMINATED CORRECTLY"
        });
        await client.close();
    } catch (err) {
        return res.status(400).json({error: "Error eliminating product"});
    }
};

module.exports = {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
}
