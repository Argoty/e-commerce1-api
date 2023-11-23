const client = require("../config/mongo.js")
const { ObjectId } = require('mongodb')
import { uploadImage, deleteImage } from "../utils/cloudinary"

const getSections = async (req, res) => {
    try {
        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const data = await db.collection("sections").find({}).sort({ "createdAt": -1 }).toArray();


        res.status(200).json(data);
    } catch (err) {
        return res.status(404).json({ "error": "Error getting sections" });
    } finally {
        await client.close();
    }
}

const getSectionProducts = async (req, res) => {
    try {
        await client.connect();
        const { sectionId } = req.params;

        const db = client.db("e-commerce_vue_express");
        const products = await db.collection("products").find({ sectionId: sectionId }).sort({ "createdAt": -1 }).toArray();

        if (!products) {
            res.status(404).json({ "error": 'Could not find the products of the section!' });
        }

        res.status(200).json(products);

    } catch (err) {
        return res.status(404).json({ "error": "Error getting products of the section" });
    } finally {
        await client.close()
    }
}

const createSection = async (req, res) => {
    try {
        const { body } = req;

        if (!req.files?.image) {
            return res.status(404).json({ error: "NEED_IMAGE_FILE" });
        }

        // ADDING IMAGE TO THE CLOUDINARY DB
        const data_img = await uploadImage(req.files.image.data, "sections");

        body.imageUrl = data_img.url;
        body.createdAt = new Date();

        await client.connect();


        const db = client.db("e-commerce_vue_express");
        const sectionsCollection = db.collection("sections");

        const result = await sectionsCollection.insertOne(body)

        const section = await sectionsCollection.findOne({ _id: result.insertedId });

        if (!section) {
            return res.status(404).json({ "error": 'Could not find the section!' });
        }

        res.status(201).json(section);
    } catch (err) {
        return res.status(404).json({ "error": "Error creating section" });
    } finally {
        await client.close();
    }
}

const updateSection = async (req, res) => {
    try {
        const { body, params } = req;
        const sectionObjId = new ObjectId(params.sectionId); // Obtén el ID del producto de los parámetros de la URL

        if (!req.files?.image) {
            return res.status(400).json({ error: "NEED_IMAGE_FILE" });
        }

        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const sectionsCollection = db.collection("sections")

        const section = await sectionsCollection.findOne({ _id: sectionObjId });

        if (!section) {
            res.status(404).json({ "error": 'Could not find the section!' });
            return
        }

        // Elimina la imagen anterior de Cloudinary utilizando su URL anterior
        const previousImageUrl = section.imageUrl
        await deleteImage(previousImageUrl);

        // ADICIÓN DE LA NUEVA IMAGEN A CLOUDINARY
        const data_img = await uploadImage(req.files.image.data, "sections");

        body.imageUrl = data_img.url;

        // Actualiza el producto en la base de datos utilizando el método 'findOneAndUpdate'
        await sectionsCollection.findOneAndUpdate({
            _id: sectionObjId
        }, {
            $set: body
        }, { returnOriginal: false });

        res.status(200).json({
            _id: sectionObjId,
            ...body
        });

    } catch (err) {
        return res.status(400).json({ error: "Error updating section" });
    } finally {
        await client.close();
    }
};

const deleteSection = async (req, res) => {
    try {
        const { sectionId } = req.params;
        const sectionObjId = new ObjectId(sectionId); // Obtén el ID del producto de los parámetros de la URL

        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const sectionsCollection = db.collection("sections")

        const section = await sectionsCollection.findOneAndDelete({ _id: sectionObjId });

        if (!section) {
            res.status(404).json({ "error": 'Could not find the section!' });
            return
        }

        // Elimina la imagen anterior de Cloudinary utilizando su URL anterior
        const imageUrl = section.imageUrl
        await deleteImage(imageUrl);

        // Elimina los productos de esta sección
        await db.collection("products").deleteMany({ sectionId })


        res.status(204).json({
            data: "SECTION ELIMINATED CORRECTLY"
        });

    } catch (err) {
        return res.status(400).json({ error: "Error eliminating section" });
    } finally {
        await client.close();
    }
};

module.exports = {
    getSections,
    getSectionProducts,
    createSection,
    updateSection,
    deleteSection
}