require("dotenv").config()
import {v2 as cloudinary} from "cloudinary"

cloudinary.config({cloud_name: process.env.CLOUDINARY_NAME, api_key: process.env.CLOUDINARY_KEY, api_secret: process.env.CLOUDINARY_SECRET, secure: true})

const uploadImage = (imageBuffer, subfolder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({
            resource_type: "image",
            folder: `e-commerce1/${subfolder}`
        }, (error, result) => {
            if (error) {

                reject("Error uploading image in Cloudinary");
            } else {
                resolve(result);
            }
        }).end(imageBuffer);
    });
};

const deleteImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
        const parts = imageUrl.split("/"); // Divide la URL por el carácter "/"
        const startIndex = parts.indexOf("upload") + 2; // Encuentra la posición de "upload" y suma 1 para comenzar desde la siguiente parte
        const public_id = parts.slice(startIndex).join("/").replace(/\.[^.]+$/, '');

        cloudinary.uploader.destroy(public_id, (error, result) => {
            if (error) {
                reject("Error deleting image in Cloudinary");
            } else {
                resolve(result);
            }
        });
    });
};


module.exports = {
    uploadImage,
    deleteImage
}
