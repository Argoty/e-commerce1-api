const {encrypt, compare} = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
// const { usersModel } = require("../models");
// const { handleHttpError } = require("../utils/handleError");
const client = require("../config/mongo.js")

const registerUser = async (req, res) => {
    try {
        const {body} = req
        await client.connect();
        const db = client.db("e-commerce_vue_express");

        const password = await encrypt(body.password);
        const bodyParser = {
            ...body,
            password,
            cartItems: [],
            role: ["user"]
        };


        const {insertedId} = await db.collection("users").insertOne(bodyParser)
        const dataUser = await db.collection("users").findOne({_id: insertedId})
        delete dataUser.password;

        const data = {
        token: await tokenSign(dataUser),
        user: dataUser,
        };

        res.status(200).json(data)
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error registering"});
    }

};

const loginUser = async (req, res) => {
    try {
      await client.connect();
      const db = client.db("e-commerce_vue_express");
      const {body} = req;
      
      const user = await db.collection("users").findOne({username: body.username})
      // await usersModel.findOne({email: body.email}).select("password name email age")
      if (!user) {
        return res.status(404).json({"error": "User doesn't exist"});
      }
  
      const hashPassword = user.password
      const check = await compare(body.password, hashPassword)
    
      if (!check) {
        return res.status(401).json({"error": "Password incorrect"});
      }
  
      delete user.password
  
      const data = {
        token: await tokenSign(user),
        user
      }
    
      res.send({ data });
      await client.close();
    } catch (err) {
        res.status(404).json({"error": "Error login"});
    }
    
  };

module.exports = {
    registerUser,
    loginUser
}
