const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const tokenSign = async (userObj) => {
  const sign = jwt.sign(
    {
      _id: userObj._id,
      role: userObj.role,
    },
    JWT_SECRET,
    { expiresIn: "24h" }
  );

  return sign
};

const verifyToken = async (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt,JWT_SECRET)
  } catch (err) {
    return null
  }
};

module.exports = { tokenSign, verifyToken}