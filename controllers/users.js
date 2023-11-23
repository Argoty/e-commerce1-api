const client = require("../config/mongo.js")

const getUsers = async (req, res) => {
    try {
        await client.connect();

        const db = client.db("e-commerce_vue_express");
        const data = await db.collection("users").find({}, {
            projection: {
                password: 0,
                cartItems: 0
            }
        }).sort({"createdAt": 1}).toArray();


        res.status(200).json(data);
        await client.close();
    } catch (err) {
        return res.status(404).json({"error": "Error getting users"});
    }
}

// const getUser = async (req, res) => {
//     try {
//         await client.connect();
//         const {userId} = req.params;
//         const userObjId = new ObjectId(userId);

//         const db = client.db("e-commerce_vue_express");
//         const user = await db.collection("users").findOne({
//             _id: userObjId
//         }, {
//             projection: {
//                 password: 0
//             }
//         });

//         if (! user) {
//             res.status(404).json({"error": 'Could not find the user!'});
//             return
//         }

//         res.status(200).json(user);
//         await client.close();
//     } catch (err) {
//         return res.status(404).json({"error": "Error getting user"});
//     }
// }


module.exports = {
    getUsers,
}
