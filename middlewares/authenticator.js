const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticator = (req, res, next) => {
  const token = req.headers.authorization;
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (decoded) {
      req.body.user = decoded.user;
      next();
    } else {
      res.send({ msg: "Login First" });
    }
  });
};

module.exports = { authenticator };
