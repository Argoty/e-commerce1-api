require("dotenv").config()

import express from "express";
import bodyParser from "body-parser";
import path from "path"

import fileUpload from "express-fileupload";

const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000

const corsOptions = {
    origin: 'http://localhost:8080',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si estás manejando cookies u otras credenciales, establece esto en true
};


app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use("/images", express.static(path.join(__dirname + "/assets")))

app.use(fileUpload());

app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/auth', require('./routes/auth'));
app.use('/payment', require('./routes/payment'));
app.use('/contact', require('./routes/contact'));
app.use('/users', require('./routes/users'));
app.use('/rating', require('./routes/rating'));
app.use('/sections', require('./routes/sections'));

app.get("/", async (req, res) => {
    res.status(200).json({data: "This api is for my e-commerce"})
})
app.listen(port, () => console.log("server listening " + port + "!"))


// npm run dev
